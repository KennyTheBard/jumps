import { Bundle, Template, VariableAtom } from './types';


export function renderTemplate(template: Template, response: { [key: string]: string }): string {
   return template.content
      .map(a => typeof a === 'string' ? a : replaceVariableAtom(a as VariableAtom, response))
      .join('');
}

export function renderBundle(bundle: Bundle, response: { [key: string]: string }): { [key: string]: string } {
   const pageRenders = {};
   for (const page of bundle.pages) {
      pageRenders[page.path] = page.content
         .map(a => typeof a === 'string' ? a : replaceVariableAtom(a as VariableAtom, response))
         .join('');
   }
   return pageRenders;
}

function replaceVariableAtom(atom: VariableAtom, dict: { [key: string]: string }): string {
   let value = dict[atom.var];
   return value;
}