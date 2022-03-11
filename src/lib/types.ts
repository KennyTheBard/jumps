export type Base = {
   name: string;
   vars: string[];
}

export type Template = Base & {
   content: ContentAtom[];
}

export type Bundle = Base & {
   pages: BundlePage[];
}

export type BundlePage = {
   path: string;
   content: ContentAtom[];
}

export type ContentAtom = string | VariableAtom;

export type VariableAtom = {
   var: string;
   original: string;
}
