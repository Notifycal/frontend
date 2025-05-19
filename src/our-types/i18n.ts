import type { AllKeyOf, LeafKeyOf, NodeKeyOf, DepthCounter } from '@common/types';
import type { I18NJSON } from '@i18next';

type IsFlatStringObject<T> = T extends Record<string, string> ? true : false;

export type NodeKeyWithOnlyLeafChildrenOf<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in Extract<keyof T, string>]: IsFlatStringObject<T[K]> extends true
          ? `${K}`
          : NodeKeyWithOnlyLeafChildrenOf<T[K], DepthCounter[D]> extends infer ChildPath
            ? ChildPath extends string
              ? `${K}.${ChildPath}`
              : never
            : never;
      }[Extract<keyof T, string>]
    : never;

type KeyTypes<T> = {
  LeafKeys: LeafKeyOf<T>;
  NodeKeys: NodeKeyOf<T>;
  NodeKeysParentsOfLeaf: NodeKeyWithOnlyLeafChildrenOf<T>;
  AllKeys: AllKeyOf<T>;
};

export type I18NKeyTypes<K extends keyof I18NJSON> = KeyTypes<I18NJSON[K]>;
export type I18NKeys<K extends keyof I18NJSON> = I18NKeyTypes<K>['AllKeys'];
