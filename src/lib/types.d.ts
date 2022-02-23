

export type Base = {
   name: string;
   vars: string[];
}

export type Template = Base & {
   content: ContentAtom[];
}

export type ContentAtom = string | VariableAtom;

export type VariableAtom = {
   var: string;
   fn: (v: string) => string;
}
