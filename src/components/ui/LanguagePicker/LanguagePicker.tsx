import type { CountryData, LanguageCode, LanguageData } from '@common/i18n';
import type { FunctionComponent } from '@common/types';
import { Group, Image, Menu, UnstyledButton } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import clsx from 'clsx';
import { useState } from 'react';
import classes from './LanguagePicker.module.css';

interface LanguagePickerProps {
  displayFlagOnly?: boolean;
  onLanguageSelected: (item: LanguageData | CountryData) => void;
  languageData: Record<LanguageCode, LanguageData | CountryData>;
  value: LanguageCode;
}

// Inspiration from https://ui.mantine.dev/component/language-picker/
export default function LanguagePicker({
  onLanguageSelected,
  languageData,
  value,
  displayFlagOnly = false
}: LanguagePickerProps): FunctionComponent {
  const [opened, setOpened] = useState(false);

  const items = Object.values(languageData).map((item) => (
    <Menu.Item
      key={item.label}
      leftSection={<Image alt="" className="h-4 w-4" src={item.image} />}
      onClick={() => {
        onLanguageSelected(item);
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
            <Image alt="" className="w-4 h-4" src={languageData[value].image} />
          ) : (
            <Group gap="xs">
              <Image alt="" className="w-4 h-4" src={languageData[value].image} />
              <span className={classes['label']}>{languageData[value].label}</span>
            </Group>
          )}
          <IconChevronDown className={classes['icon']} size={16} stroke={2} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}
