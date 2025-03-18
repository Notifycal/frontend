import type { FunctionComponent } from '@common/types';
import { Group, Image, Menu, UnstyledButton } from '@mantine/core';
import type { InternationalizationData } from '@notifycal/shared/types';
import { IconChevronDown } from '@tabler/icons-react';
import clsx from 'clsx';
import { useState } from 'react';
import classes from './LanguagePicker.module.css';

interface InternationalizationPickerProps<
  TCode extends string,
  TLabel extends string,
  TData extends InternationalizationData<TCode, TLabel>
> {
  onSelected: (item: TData) => void;
  data: Record<TCode, TData>;
  value: TCode;
  displayFlagOnly?: boolean;
}

// Inspiration from https://ui.mantine.dev/component/language-picker/
export default function InternationalizationPicker<
  TCode extends string,
  TLabel extends string,
  TData extends InternationalizationData<TCode, TLabel>
>({
  onSelected: onSelected,
  data: data,
  value: value,
  displayFlagOnly = false
}: InternationalizationPickerProps<TCode, TLabel, TData>): FunctionComponent {
  const [opened, setOpened] = useState(false);

  const items = Object.values<TData>(data).map((item) => (
    <Menu.Item
      key={item.label}
      leftSection={<Image alt="" className="h-4 w-4" src={item.image} />}
      onClick={() => {
        onSelected(item);
      }}
    >
      {item.label}
    </Menu.Item>
  ));

  return (
    <Menu
      position="bottom-start"
      onClose={() => {
        setOpened(false);
      }}
      onOpen={() => {
        setOpened(true);
      }}
    >
      <Menu.Target>
        <UnstyledButton
          data-expanded={opened}
          style={{ padding: 'var(--mantine-spacing-xs)' }}
          className={clsx(
            classes['control'],
            displayFlagOnly ? classes['control_no_labels'] : classes['control_with_labels']
          )}
        >
          {displayFlagOnly ? (
            <Image alt="" className="w-4 h-4" src={data[value].image} />
          ) : (
            <Group gap="xs">
              <Image alt="" className="w-4 h-4" src={data[value].image} />
              <span className={classes['label']}>{data[value].label}</span>
            </Group>
          )}
          <IconChevronDown className={classes['icon']} size={16} stroke={2} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}
