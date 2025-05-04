import { IconCheck } from '@tabler/icons-react';
import clsx from 'clsx';
import React from 'react';

interface ReminderTypeCardRadioGroupOptionProps {
  value: string;
  selectedValue?: string;
  onSelect?: (value: string) => void;
  text: string;
}

export const ReminderTypeCardRadioGroupOption: React.FC<ReminderTypeCardRadioGroupOptionProps> = ({
  value,
  selectedValue,
  onSelect,
  text
}) => {
  const isSelected = value === selectedValue;
  const nowWithoutSeconds = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 mb-1 ml-2">{nowWithoutSeconds}</span>
      <button
        type="button"
        className={clsx(
          'relative p-4 rounded-2xl max-w-full',
          'transition-all duration-200 ease-in-out',
          'text-left text-sm sm:text-base',
          'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none',
          'border-2',
          'shadow-sm hover:shadow',
          isSelected
            ? 'bg-blue-100 border-blue-500 shadow-md scale-[1.02]'
            : 'bg-white border-transparent hover:bg-gray-50'
        )}
        onClick={() => {
          if (onSelect) {
            onSelect(isSelected ? '' : value);
          }
        }}
      >
        <div className="text-gray-600">{text}</div>

        {isSelected && (
          <div className="absolute -bottom-2 -right-2 text-white">
            <div className="flex items-center justify-center p-1 rounded-full bg-blue-500">
              <IconCheck size={14} />
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

type ReminderTypeCardRadioGroupProps = {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
};

export const ReminderTypeCardRadioGroup: React.FC<ReminderTypeCardRadioGroupProps> = ({
  value,
  onChange,
  children
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return child;
        } else {
          return React.cloneElement(child as React.ReactElement<ReminderTypeCardRadioGroupOptionProps>, {
            selectedValue: value,
            onSelect: onChange
          });
        }
      })}
    </div>
  );
};
