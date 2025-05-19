import type { ComboboxItem } from '@mantine/core';

export const flatObjectToDropdownData = (object: Record<string, string>): Array<ComboboxItem> => {
  return Object.entries(object).map(([key, value]) => ({
    value: key,
    label: value
  }));
};

export const labeledObjectToDropdownData = (object: Record<string, { label: string }>): Array<ComboboxItem> => {
  return Object.entries(object).map(([key, { label }]) => ({
    value: key,
    label
  }));
};
