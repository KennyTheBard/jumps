import { Template, VariableAtom } from './types';


export function renderTemplate(template: Template, response: {[key: string]: string}): string {
   return template.content
      .map(a => typeof a === 'string' ? a : replaceVariableAtom(a as VariableAtom, response))
      .join('');
}

function replaceVariableAtom(atom: VariableAtom, dict: { [key: string]: string }): string {
   let value = dict[atom.var];
   atom.transformers.forEach(t => value = t(value));
   return value;
}