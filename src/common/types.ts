export type FunctionComponent = React.ReactElement | null;

export type KebabCase<S> = S extends `${infer C}${infer T}`
  ? T extends Uncapitalize<T>
    ? `${Uncapitalize<C>}${KebabCase<T>}`
    : `${Uncapitalize<C>}-${KebabCase<T>}`
  : S;

export type DepthCounter = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Helper: Depth counter array

type KeyPath<T, Include, Exclude, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in Extract<keyof T, string>]: T[K] extends object
          ? `${K}` | `${K}.${KeyPath<T[K], Include, Exclude, DepthCounter[D]>}`
          : T[K] extends Exclude
            ? never
            : T[K] extends Include
              ? `${K}`
              : never;
      }[Extract<keyof T, string>]
    : never;

export type LeafKeyOf<T> = KeyPath<T, string, object>;
export type NodeKeyOf<T> = KeyPath<T, object, string>;
export type AllKeyOf<T> = LeafKeyOf<T> | NodeKeyOf<T>;
