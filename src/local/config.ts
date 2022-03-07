import os from 'os';
import path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';


export const CONFIG_DIR_PATH = path.join(os.homedir(), '.jumps');
export const TEMPLATES_DIR_PATH = path.join(CONFIG_DIR_PATH, 'templates');
export const SETIINGS_PATH = path.join(CONFIG_DIR_PATH, 'settings.json');

export class Config {

   public settings: Settings;

   constructor() {
      if (!this.configExists()) {
         console.log(chalk.bold('Configurations not found! Initializing...') + '\n');
         this.initConfig();
      }

      this.loadConfig();
   }

   public updateConfig() {
      fs.writeFileSync(SETIINGS_PATH, JSON.stringify(this.settings));
   }

   private configExists(): boolean {
      return fs.existsSync(CONFIG_DIR_PATH);
   }

   private initConfig() {
      fs.mkdirSync(CONFIG_DIR_PATH);
      fs.mkdirSync(TEMPLATES_DIR_PATH);
      fs.writeFileSync(SETIINGS_PATH, '{}');
   }

   private loadConfig() {
      this.settings = JSON.parse(fs.readFileSync(SETIINGS_PATH).toString());
   }
}

export interface Settings {

}

export const config = new Config();