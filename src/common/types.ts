export type FunctionComponent = React.ReactElement | null;

export type KebabCase<S> = S extends `${infer C}${infer T}`
  ? T extends Uncapitalize<T>
    ? `${Uncapitalize<C>}${KebabCase<T>}`
    : `${Uncapitalize<C>}-${KebabCase<T>}`
  : S;

export type CamelCase<S> = S extends `${infer C}_${infer T}` ? `${C}${Capitalize<CamelCase<T>>}` : S;

export type SnakeToCamelObject<T> = {
  [K in keyof T as K extends string ? CamelCase<K> : never]: T[K];
};
