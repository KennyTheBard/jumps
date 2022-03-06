import { Command } from 'commander';
import { addTemplate, inspectTemplate, listTemplates, useTemplate } from './cli';

(async () => {
   const program = new Command();

   program
      .name('jumps')
      .version('0.1.0')
      .description('Boilerplate code generator using templates');

   // `template` command
   const templateCommand = program.command('template').alias('t')
      .description('Operations on template files');
   templateCommand.command('use').alias('u')
      .argument('<template_name>')
      .action(useTemplate);
   templateCommand.command('add').alias('a')
      .argument('<filepath>', 'path to the file to be added as a template')
      .option('-o, --override', 'override existing template')
      .action(addTemplate);
   templateCommand.command('list').alias('l')
      .action(listTemplates);
   templateCommand.command('inspect').alias('i')
      .argument('<template_name>')
      .action(inspectTemplate);

   program.parse();
})();
