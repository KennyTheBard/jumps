import path from 'path';
import os from 'os';


export const CONFIG_DIR_PATH = path.join(os.homedir(), '.jumps');
export const TEMPLATES_DIR_PATH = path.join(CONFIG_DIR_PATH, 'templates');
export const BUNDLES_DIR_PATH = path.join(CONFIG_DIR_PATH, 'bundles');
export const SETIINGS_PATH = path.join(CONFIG_DIR_PATH, 'settings.json');

export function getTemplatePath(templateName: string): string {
   return path.join(TEMPLATES_DIR_PATH, templateName);
}

export function getBundlePath(templateName: string): string {
   return path.join(BUNDLES_DIR_PATH, templateName);
}