import chalk from 'chalk';
import prompts from 'prompts';
import clipboard from 'clipboardy';
import { parseTemplate, renderTemplate, Template, VariableAtom } from '../lib';
import * as fs from 'fs';
import * as os from 'os';
import path from 'path';
import { OptionValues } from 'commander';
import * as _ from 'lodash';
import { getTemplatePath, TEMPLATES_DIR_PATH } from '../config';


export async function useTemplate(templateName: string, options: OptionValues) {
   const template = parseTemplate(templateName)
   printTemplate(template);

   const response = await prompts(
      template.vars.map(varName => {
         return {
            type: 'text',
            name: varName,
            message: `Value for ${varName}`
         };
      })
   );
   console.log();

   const content = renderTemplate(template, response);
   clipboard.writeSync(content);
   console.log(chalk.white(content) + '\n');
   console.log(chalk.bold.green('Copied to clipboard!'));
}

export async function addTemplate(fileName: string, options: OptionValues): Promise<void> {
   if (!fs.existsSync(fileName)) {
      console.log(chalk.bold.red('File not found! Please, provide a path to a valid file.'))
      return;
   }

   let templateName = path.basename(fileName);
   if (options.name) {
      templateName = options.name;
   } else if (options.noNamePrompt) {
      const response = await prompts({
         type: 'text',
         name: 'templateName',
         message: `Name for the template ${chalk.dim('(empty if the same as the filename')}`
      });
      templateName = response.templateName ?? templateName;
   }

   const existingTemplates = fs.readdirSync(TEMPLATES_DIR_PATH);
   const templateWithSameName = _.find(existingTemplates, t => t === templateName);
   if (templateWithSameName && !options.override) {
      console.log(chalk.bold.red(`Template ${templateName} already exists! Please use other name or use ${chalk.white.italic('--override')} option`));
      return;
   }

   fs.writeFileSync(getTemplatePath(templateName), fs.readFileSync(fileName));
}

export function listTemplates(options: OptionValues) {
   fs.readdirSync(TEMPLATES_DIR_PATH)
      .forEach(templateName => console.log(chalk.bold.yellow(templateName)));
}

export function inspectTemplate(templateName: string) {
   const template = parseTemplate(templateName);
   printTemplate(template);
}

export async function deleteTemplate(templateName: string, options: OptionValues) {
   const templatePath = getTemplatePath(templateName);
   if (!fs.existsSync(templatePath)) {
      console.log(chalk.bold.red('Template not found! Please, provide a valid template name.'))
      return;
   }

   if (!options.skipConfirmation) {
      const response = await prompts({
         type: 'confirm',
         name: 'value',
         initial: false,
         message: `Do you want to delete ${chalk.bold(templateName)} from templates?`
      });

      if (!response.value) {
         return;
      }
   }

   fs.rmSync(templatePath);
}

function printTemplate(template: Template) {
   const templateContent = template.content
      .map(a => typeof a === 'string' ? chalk.green(a) : chalk.bold.red.inverse((a as VariableAtom).original))
      .join('');
   console.log(templateContent + os.EOL);
}