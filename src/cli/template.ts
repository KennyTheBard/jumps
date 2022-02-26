import chalk from 'chalk';
import prompts from 'prompts';
import clipboard from 'clipboardy';
import { parseTemplate, VariableAtom } from '../lib';


export async function useTemplate(templateName: string) {
   const template = parseTemplate(templateName)
   
   const templateContent = template.content
      .map(a => typeof a === 'string' ? chalk.green(a) : chalk.bold.green.inverse((a as VariableAtom).var))
      .join('');
   console.log(templateContent);
   console.log();

   const response = await prompts(
      template.vars.map(varName => {
         return {
            type: 'text',
            name: varName,
            message: `Value for ${varName}`
         };
      })
   );

   const finalResult = template.content
      .map(a => typeof a === 'string' ? a : replaceVariableAtom(a as VariableAtom, response))
      .join('');
   clipboard.writeSync(finalResult);
   console.log();

   console.log(chalk.white(finalResult));
   console.log();
   
   console.log(chalk.bold.green('Copied to clipboard!'));
   console.log();
}

export function addTemplate(fileName: string) {
   
}

export function listTemplates() {
   
}

export function inspectTemplate(templateName: string) {
   const template = parseTemplate(templateName)
   
   const templateContent = template.content
      .map(a => typeof a === 'string' ? chalk.green(a) : chalk.bold.red.inverse((a as VariableAtom).original))
      .join('');
   console.log(templateContent);
   console.log();
}

function replaceVariableAtom(atom: VariableAtom, dict: { [key: string]: string }): string {
   let value = dict[atom.var];
   atom.transformers.forEach(t => value = t(value));
   return value;
}