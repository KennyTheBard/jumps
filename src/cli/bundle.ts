import chalk from 'chalk';
import prompts from 'prompts';
import clipboard from 'clipboardy';
import * as fs from 'fs';
import * as os from 'os';
import path from 'path';
import { OptionValues } from 'commander';
import * as _ from 'lodash';
import { BUNDLES_DIR_PATH, getBundlePath } from '../config';
import { Bundle, parseBundle, renderBundle, VariableAtom } from '../lib';


export async function useBundle(bundleName: string, options: OptionValues) {
   const bundle = parseBundle(bundleName);
   printBundle(bundle);

   const response = await prompts(
      bundle.vars.map(varName => {
         return {
            type: 'text',
            name: varName,
            message: `Value for ${varName}`
         };
      })
   );
   console.log();

   const contents = renderBundle(bundle, response);
   for (const renderPath of Object.keys(contents)) {
      const destinationPath = path.join(process.cwd(), renderPath);
      const dirname = path.dirname(renderPath);
      if (!fs.statSync(dirname)) {
         fs.mkdirSync(dirname, { recursive: true });
      }
      fs.writeFileSync(destinationPath, contents[renderPath]);

      console.log(chalk.yellow(`Rendered bundle page at ${chalk.italic.bold(destinationPath)}!`));
   }
   console.log(chalk.bold.green('Bundle completely rendered!'));
}

export async function addBundle(fileName: string, options: OptionValues): Promise<void> {
   if (!fs.existsSync(fileName)) {
      console.log(chalk.bold.red('File not found! Please, provide a path to a valid file.'))
      return;
   }

   let bundleName = path.basename(fileName);
   if (options.name) {
      bundleName = options.name;
   } else if (options.noNamePrompt) {
      const response = await prompts({
         type: 'text',
         name: 'templateName',
         message: `Name for the template ${chalk.dim('(empty if the same as the filename')}`
      });
      bundleName = response.templateName ?? bundleName;
   }

   const existingBundles = fs.readdirSync(BUNDLES_DIR_PATH);
   const bundleWithSameName = _.find(existingBundles, t => t === bundleName);
   if (bundleWithSameName && !options.override) {
      console.log(chalk.bold.red(`Bundle ${bundleName} already exists! Please use other name or use ${chalk.white.italic('--override')} option`));
      return;
   }

   fs.writeFileSync(getBundlePath(bundleName), fs.readFileSync(fileName));
}

export function listBundles(options: OptionValues) {
   fs.readdirSync(BUNDLES_DIR_PATH)
      .forEach(bundleName => console.log(chalk.bold.yellow(bundleName)));
}

export function inspectBundle(bundleName: string, options: OptionValues) {
   const bundle = parseBundle(bundleName);
   printBundle(bundle);
}

export async function deleteBundle(bundleName: string, options: OptionValues) {
   const bundlePath = getBundlePath(bundleName);
   if (!fs.existsSync(bundlePath)) {
      console.log(chalk.bold.red('File not found! Please, provide a path to a valid file.'))
      return;
   }

   if (!options.skipConfirmation) {
      const response = await prompts({
         type: 'confirm',
         name: 'value',
         initial: false,
         message: `Do you want to delete ${chalk.bold(bundleName)} from bundles?`
      });

      if (!response.value) {
         return;
      }
   }

   fs.rmSync(bundlePath);
}


function printBundle(bundle: Bundle) {
   const bundleContent = bundle.pages
      .map(page => page.content)
      .map(content => content
         .map(a => typeof a === 'string' ? chalk.green(a) : chalk.bold.red.inverse((a as VariableAtom).original))
         .join(''))
      .join(os.EOL);
   console.log(bundleContent + os.EOL);
}