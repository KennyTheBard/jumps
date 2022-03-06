import os from 'os';
import path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';


export class Config {
   public static readonly dir = path.join(os.homedir(), '.jumps');
   public static readonly templatesDir = path.join(Config.dir, 'templates');
   public static readonly templatesRegistryPath = path.join(Config.dir, 'templates', 'registry.json');
   public static readonly settingsPath = path.join(Config.dir, 'settings.json');

   settings: Settings;
   templateHeaders: TemplateHeader[];

   constructor() {
      if (!this.configExists()) {
         console.log(chalk.bold('Configurations not found! Initializing...') + '\n');
         this.initConfig();
      }

      this.loadConfig();
   }

   public updateConfig() {
      fs.writeFileSync(Config.settingsPath, JSON.stringify(this.settings));
      fs.writeFileSync(Config.templatesRegistryPath, JSON.stringify(this.templateHeaders));
   }

   private configExists(): boolean {
      return fs.existsSync(Config.dir);
   }

   private initConfig() {
      fs.mkdirSync(Config.dir);
      fs.mkdirSync(Config.templatesDir);
      fs.writeFileSync(Config.templatesRegistryPath, '');
      fs.writeFileSync(Config.settingsPath, '');
   }

   private loadConfig() {
      this.settings = JSON.parse(fs.readFileSync(Config.settingsPath).toString());
      this.templateHeaders = JSON.parse(fs.readFileSync(Config.templatesRegistryPath).toString());
   }
}

export interface Settings {

}

export interface TemplateHeader {
   name: string;
   created: Date;
   updated: Date;
}

export const config = new Config();