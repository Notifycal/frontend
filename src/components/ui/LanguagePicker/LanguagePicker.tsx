import { Group, Image, Menu, UnstyledButton } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useState } from 'react';

import clsx from 'clsx';

import type { FunctionComponent } from '@common/types';

import classes from './LanguagePicker.module.css';

import type { CountryData, LanguageCode, LanguageData } from '@common/i18n';
import { useTranslation } from 'react-i18next';

interface LanguagePickerProps {
  onLanguageSelected: (item: LanguageData | CountryData) => void;
  displayFlagOnly?: boolean;
  languageData: Record<LanguageCode, LanguageData | CountryData>;
}

// Inspiration from https://ui.mantine.dev/component/language-picker/
export default function LanguagePicker({
  onLanguageSelected,
  languageData,
  displayFlagOnly = false
}: LanguagePickerProps): FunctionComponent {
  const { i18n } = useTranslation();
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(i18n.language === 'es' ? languageData.es : languageData.en);

  const items = Object.values(languageData).map((item) => (
    <Menu.Item
      key={item.label}
      leftSection={<Image alt="" className="h-4 w-4" src={item.image} />}
      onClick={() => {
        setSelected(item);
        onLanguageSelected(item);
      }}
    >
      {item.label}
    </Menu.Item>
  ));

  return (
    <Menu
      // withinPortal
      // radius="md"
      // width="target"
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
            <Image alt="" className="w-4 h-4" src={selected.image} />
          ) : (
            <Group gap="xs">
              <Image alt="" className="w-4 h-4" src={selected.image} />
              <span className={classes['label']}>{selected.label}</span>
            </Group>
          )}
          <IconChevronDown className={classes['icon']} size={16} stroke={2} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}
