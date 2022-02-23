import _ from 'lodash';
import { StringValueTransformer } from './types';


export const functions: {[key: string]: StringValueTransformer} = {
   camelCase: (v: string) => _.camelCase(v),
   upperCase: (v: string) => _.upperCase(v),
   lowerCase: (v: string) => _.lowerCase(v),
   capitalize: (v: string) => _.capitalize(v)
};
