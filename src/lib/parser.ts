import * as fs from 'fs';
import _ from 'lodash';
import path from 'path';
import { functions } from './functions';
import { ContentAtom, Template, VariableAtom } from './types';

const REGEX = /%%([a-zA-Z][a-zA-Z0-9_]*)([ ]*\|[ ]*[a-zA-Z][a-zA-Z0-9_]*[ ]*)*%%/g;

export function parseTemplate(filepath: string): Template | null {
   if (!fs.existsSync(filepath)) {
      console.error('Template does not exist');
      return null;
   }

   const buf = fs.readFileSync(filepath, 'utf8');
   const content = buf.toString();
   const matches = content.matchAll(REGEX);

   const contentAtoms: ContentAtom[] = [];
   const vars = new Set<string>();
   let contentLeft = content;
   let indexOffset = 0;
   for (const match of matches) {
      const varName = match[1];
      const ops = _.tail(match[0].replace(/%/g, '').split('|').map(s => s.trim()));
      const varAtom: VariableAtom = {
         var: varName,
         transformers: ops.map((op: string) => functions[op])
      };

      vars.add(varName);
      contentAtoms.push(contentLeft.substring(0, match.index - indexOffset));
      contentAtoms.push(varAtom);
      contentLeft = contentLeft.substring(match.index + match[0].length - indexOffset);
      indexOffset = match.index + match[0].length;
   }

   // if there were at least one match
   if (indexOffset > 0) {
      contentAtoms.push(content.substring(indexOffset));
   }

   return {
      name: path.basename(filepath),
      vars: Array.from(vars),
      content: contentAtoms
   };
}
