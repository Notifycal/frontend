import { get } from 'radashi';

export type DepthCounter = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type KeyPath<T, Include, Exclude, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in Extract<keyof T, string>]: NonNullable<T[K]> extends object
          ? `${K}` | `${K}.${KeyPath<NonNullable<T[K]>, Include, Exclude, DepthCounter[D]>}`
          : T[K] extends Exclude
            ? never
            : T[K] extends Include
              ? `${K}`
              : never;
      }[Extract<keyof T, string>]
    : never;

export type LeafKeyOf<T> = KeyPath<T, string | number | boolean, object>;
export type NodeKeyOf<T> = KeyPath<T, object, string | number | boolean>;
export type AllKeyOf<T> = LeafKeyOf<T> | NodeKeyOf<T>;

type IsFlatPrimitiveObject<T> = T extends Record<string, string | number | boolean> ? true : false;

export type NodeKeyWithOnlyLeafChildrenOf<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in Extract<keyof T, string>]: IsFlatPrimitiveObject<NonNullable<T[K]>> extends true
          ? `${K}`
          : NodeKeyWithOnlyLeafChildrenOf<NonNullable<T[K]>, DepthCounter[D]> extends infer ChildPath
            ? ChildPath extends string
              ? `${K}.${ChildPath}`
              : never
            : never;
      }[Extract<keyof T, string>]
    : never;

export type ObjectKeyTypes<T> = {
  LeafKeys: LeafKeyOf<T>;
  NodeKeys: NodeKeyOf<T>;
  NodeKeysParentsOfLeaf: NodeKeyWithOnlyLeafChildrenOf<T>;
  AllKeys: AllKeyOf<T>;
};

type PathValue<T, P extends string> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? PathValue<NonNullable<T[Key]>, Rest>
    : undefined
  : P extends keyof T
    ? T[P]
    : undefined;

type ExtractLastKey<P extends string> = P extends `${string}.${infer Last}` ? Last : P;

export type ExtractFromPaths<T, Paths extends ReadonlyArray<string>> = {
  [K in Paths[number] as ExtractLastKey<K>]: PathValue<T, K>;
};

export function extractFromPaths<T, P extends ReadonlyArray<AllKeyOf<T>>>(source: T, paths: P): ExtractFromPaths<T, P> {
  return paths
    .map((path) => {
      const value = get(source, path);
      const lastKey = path.split('.').at(-1);
      return { [lastKey!]: value };
    })
    .reduce((accumulator, current) => ({ ...accumulator, ...current }), {}) as ExtractFromPaths<T, P>;
}
