import * as fs from 'fs';
import { Template } from './types';

const REGEX = /%%([a-zA-Z][a-zA-Z0-9_]*)(\|[a-zA-Z][a-zA-Z0-9_]*)*%%/g;

export function parseTemplate(filepath: string): Template | null {
   if (!fs.existsSync(filepath)) {
      console.error('Template does not exist');
      return null;
   }


   const buf = fs.readFileSync(filepath, 'utf8');
   const content = buf.toString();

   const matches = content.matchAll(REGEX);
   const vars = new Set<string>();
   for (const match of matches) {
      vars.add(match[1]);
      console.log(`Found ${match[0]} start=${match.index} end=${match.index + match[0].length}.`);
   }

   // return {
   //    name: path.basename(filepath),
   //    vars:
   // }
}