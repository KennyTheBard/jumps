import chalk from 'chalk';
import prompts from 'prompts';
import clipboard from 'clipboardy';
import { parseTemplate, VariableAtom } from '../lib';
import { config, CONFIG_DIR_PATH, TEMPLATES_DIR_PATH } from '../local/config';
import * as fs from 'fs';
import path from 'path';
import { OptionValues } from 'commander';
import * as _ from 'lodash';


export async function useTemplate(templateName: string) {
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

   // TODO: move this to lib
   const finalResult = template.content
      .map(a => typeof a === 'string' ? a : replaceVariableAtom(a as VariableAtom, response))
      .join('');
   clipboard.writeSync(finalResult);
   console.log(chalk.white(finalResult) + '\n');
   console.log(chalk.bold.green('Copied to clipboard!') + '\n');
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

   fs.writeFileSync(path.join(TEMPLATES_DIR_PATH, templateName), fs.readFileSync(fileName));
}

export function listTemplates() {
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

function replaceVariableAtom(atom: VariableAtom, dict: { [key: string]: string }): string {
   let value = dict[atom.var];
   atom.transformers.forEach(t => value = t(value));
   return value;
}