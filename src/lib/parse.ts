import * as fs from 'fs';
import _ from 'lodash';
import path from 'path';
import { getBundlePath, getTemplatePath } from '../config';
import { functions } from './functions';
import { ContentAtom, Template, VariableAtom, Bundle, BundlePage } from './types';
import * as os from 'os';


export function parseTemplate(templateName: string): Template | null {
   const templatePath = getTemplatePath(templateName);
   if (!fs.existsSync(templatePath)) {
      console.error('Template does not exist');
      return null;
   }

   const buf = fs.readFileSync(templatePath, 'utf8');
   const content = buf.toString();
   const vars = new Set<string>();

   const contentAtoms = extractContentAtoms(content, vars);

   return {
      name: path.basename(templatePath),
      vars: Array.from(vars),
      content: contentAtoms
   };
}


export function parseBundle(bundleName: string): Bundle | null {
   const bundlePath = getBundlePath(bundleName);
   if (!fs.existsSync(bundlePath)) {
      console.error('Bundle does not exist');
      return null;
   }

   const buf = fs.readFileSync(bundlePath, 'utf8');
   const content = buf.toString()
   const pages: BundlePage[] = [];
   const vars = new Set<string>();

   for (const page of content.split('%%%')) {
      if (!page.includes(os.EOL)) {
         continue;
      }

      const [path, ...pageContent] = page.split(os.EOL);
      const contentAtoms = extractContentAtoms(pageContent.join(os.EOL), vars);

      pages.push({
         path: path.trim(),
         content: contentAtoms
      });
   }

   return {
      name: path.basename(bundlePath),
      vars: Array.from(vars),
      pages
   };
}


const VARIABLE_REGEX = /%%([a-zA-Z][a-zA-Z0-9_]*)%%/g;


function extractContentAtoms(content: string, vars: Set<string>): ContentAtom[] {
   const matches = content.matchAll(VARIABLE_REGEX);
   const contentAtoms: ContentAtom[] = [];
   let contentLeft = content;
   let indexOffset = 0;

   for (const match of matches) {
      const varName = match[1];
      const varAtom: VariableAtom = {
         var: varName,
         original: match[0],
      };

      vars.add(varName);
      contentAtoms.push(contentLeft.substring(0, match.index - indexOffset));
      contentAtoms.push(varAtom);
      contentLeft = contentLeft.substring(match.index + match[0].length - indexOffset);
      indexOffset = match.index + match[0].length;
   }

   if (indexOffset > 0) {
      contentAtoms.push(content.substring(indexOffset));
   } else {
      contentAtoms.push(content);
   }

   return contentAtoms;
}