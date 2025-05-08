export type FunctionComponent = React.ReactElement | null;

export type KebabCase<S> = S extends `${infer C}${infer T}`
  ? T extends Uncapitalize<T>
    ? `${Uncapitalize<C>}${KebabCase<T>}`
    : `${Uncapitalize<C>}-${KebabCase<T>}`
  : S;

type Previous = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Helper: Depth counter array
// Recursive key path type with depth limit. Otherwise: Type instantiation is excessively deep and possibly infinite.
export type NestedKeyOf<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in Extract<keyof T, string>]: T[K] extends object
          ? `${K}` | `${K}.${NestedKeyOf<T[K], Previous[D]>}`
          : `${K}`;
      }[Extract<keyof T, string>]
    : never;
