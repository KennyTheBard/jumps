#!/usr/bin/env node

import { Command } from 'commander';
import * as cli from './cli';

(async () => {
   const program = new Command();

   program
      .name('jumps')
      .version('0.1.10')
      .description('Boilerplate code generator using templates');

   // `template` command
   const templateCommand = program.command('template').alias('t')
      .description('Operations on template files');
   templateCommand.command('use').alias('u')
      .argument('<template_name>')
      .action(cli.useTemplate);
   templateCommand.command('add').alias('a')
      .argument('<filepath>', 'path to the file to be added as a template')
      .option('-o, --override', 'override existing template')
      .option('-n, --name <template_name>', 'pass the template name in the command')
      .option('--no-name-prompt', 'skip the naming prompt for the new template')
      .action(cli.addTemplate);
   templateCommand.command('delete').alias('d')
      .argument('<template_name>')
      .option('--skip-confirmation')
      .action(cli.deleteTemplate);
   templateCommand.command('list').alias('l')
      .action(cli.listTemplates);
   templateCommand.command('inspect').alias('i')
      .argument('<template_name>')
      .action(cli.inspectTemplate);

   // `bundle` command
   const bundleCommand = program.command('bundle').alias('b')
      .description('Operations on bundle files');
   bundleCommand.command('use').alias('u')
      .argument('<bundle_name>')
      .action(cli.useBundle);
   bundleCommand.command('add').alias('a')
      .argument('<filepath>', 'path to the file to be added as a budnle')
      .option('-o, --override', 'override existing template')
      .option('-n, --name <bundle_name>', 'pass the template name in the command')
      .option('--no-name-prompt', 'skip the naming prompt for the new template')
      .action(cli.addBundle);
   bundleCommand.command('delete').alias('d')
      .argument('<bundle_name>')
      .option('--skip-confirmation')
      .action(cli.deleteBundle);
   bundleCommand.command('list').alias('l')
      .action(cli.listBundles);
   bundleCommand.command('inspect').alias('i')
      .argument('<bundle_name>')
      .action(cli.inspectBundle);

   program.parse();
})();
