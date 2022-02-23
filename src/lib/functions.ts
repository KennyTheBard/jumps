import _ from 'lodash';


export const functions = {
   camelCase: (v: string) => _.camelCase(v),
   upperCase: (v: string) => _.upperCase(v),
   lowerCase: (v: string) => _.lowerCase(v),
   capitalize: (v: string) => _.capitalize(v)
}