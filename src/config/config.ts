import * as fs from 'fs';
import chalk from 'chalk';
import { SETTINGS_PATH, CONFIG_DIR_PATH, TEMPLATES_DIR_PATH, BUNDLES_DIR_PATH } from './constants';


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
      fs.writeFileSync(SETTINGS_PATH, JSON.stringify(this.settings));
   }

   private configExists(): boolean {
      return fs.existsSync(CONFIG_DIR_PATH);
   }

   private initConfig() {
      fs.mkdirSync(CONFIG_DIR_PATH);
      fs.mkdirSync(TEMPLATES_DIR_PATH);
      fs.mkdirSync(BUNDLES_DIR_PATH);
      fs.writeFileSync(SETTINGS_PATH, '{}');
   }

   private loadConfig() {
      this.settings = JSON.parse(fs.readFileSync(SETTINGS_PATH).toString());
   }
}

export interface Settings {

}

export const config = new Config();