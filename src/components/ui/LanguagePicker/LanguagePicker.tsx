import { Group, Image, Menu, UnstyledButton } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useState } from 'react';

import clsx from 'clsx';

import type { FunctionComponent } from '@common/types';

import classes from './LanguagePicker.module.css';

import flagEn from '@assets/icons/lang/en.png';
import flagEs from '@assets/icons/lang/es.png';

const data = [
  { label: 'English', shorthand: 'EN', image: flagEn },
  { label: 'Spanish', shorthand: 'ES', image: flagEs }
];

export type LanguageData = {
  label: string;
  image: string;
  shorthand: string;
};

interface LanguagePickerProps {
  onLanguageSelected: (item: LanguageData) => void;
  displayFlagOnly?: boolean;
}

// Inspiration from https://ui.mantine.dev/component/language-picker/
export default function LanguagePicker({
  onLanguageSelected,
  displayFlagOnly = false
}: LanguagePickerProps): FunctionComponent {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(data[0]);

  const items = data.map((item) => (
    <Menu.Item
      key={item.label}
      leftSection={<Image alt="" className="h-4 w-4" src={item.image} />}
      onClick={() => {
        setSelected(item);
        onLanguageSelected(item);
      }}
    >
      {displayFlagOnly ? item.shorthand : item.label}
    </Menu.Item>
  ));

  return (
    <Menu
      withinPortal
      radius="md"
      width="target"
      onClose={() => {
        setOpened(false);
      }}
      onOpen={() => {
        setOpened(true);
      }}
    >
      <Menu.Target>
        <UnstyledButton
          data-expanded={opened || undefined}
          className={clsx(
            classes['control'],
            displayFlagOnly ? classes['control_no_labels'] : classes['control_with_labels']
          )}
        >
          {displayFlagOnly ? (
            <Image alt="" className="w-5 h-5" src={selected?.image} />
          ) : (
            <Group gap="xs">
              <Image alt="" className="w-5 h-5" src={selected?.image} />
              <span className={classes['label']}>{selected?.label}</span>
            </Group>
          )}
          <IconChevronDown className={classes['icon']} size={16} stroke={2} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}
