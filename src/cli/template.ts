import chalk from 'chalk';
import prompts from 'prompts';
import clipboard from 'clipboardy';
import { parseTemplate, renderTemplate, VariableAtom } from '../lib';
import * as fs from 'fs';
import path from 'path';
import { OptionValues } from 'commander';
import * as _ from 'lodash';
import { getTemplatePath, TEMPLATES_DIR_PATH } from '../config';


export async function useTemplate(templateName: string, options: OptionValues) {
   const template = parseTemplate(templateName)

   const templateContent = template.content
      .map(a => typeof a === 'string' ? chalk.green(a) : chalk.bold.green.inverse((a as VariableAtom).var))
      .join('');
   console.log(templateContent + '\n');

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

   const templates = fs.readdirSync(TEMPLATES_DIR_PATH);
   const existingTemplate = _.find(templates, t => t === templateName);
   if (existingTemplate && !options.override) {
      console.log(chalk.bold.red(`Template ${templateName} already exists! Please use other name or use ${chalk.white.italic('--override')} option`));
      return;
   }
   if (!existingTemplate && options.override) {
      console.log(chalk.bold.red(`Template ${templateName} not found! Please use other name or run without ${chalk.white.italic('--override')} option`));
      return;
   }

   fs.writeFileSync(getTemplatePath(templateName), fs.readFileSync(fileName));
}

export function listTemplates(options: OptionValues) {
   fs.readdirSync(TEMPLATES_DIR_PATH)
      .forEach(templateName => console.log(chalk.bold.yellow(templateName)));
}

export function inspectTemplate(templateName: string) {
   const template = parseTemplate(templateName)

   const templateContent = template.content
      .map(a => typeof a === 'string' ? chalk.green(a) : chalk.bold.red.inverse((a as VariableAtom).original))
      .join('');
   console.log(templateContent + '\n');
}

export async function deleteTemplate(templateName: string, options: OptionValues) {
   const templatePath = getTemplatePath(templateName);
   if (!fs.existsSync(templatePath)) {
      console.log(chalk.bold.red('File not found! Please, provide a path to a valid file.'))
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