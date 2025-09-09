import { Accordion } from '@mantine/core';
import type { JSX } from 'react';

interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

interface FaqAccordionProps {
  activeCategoryData: Category | undefined;
}

export const FaqAccordion = ({ activeCategoryData }: FaqAccordionProps): JSX.Element | null => {
  if (!activeCategoryData) {
    return null;
  }

  return (
    <Accordion
      key={activeCategoryData.id}
      chevronIconSize="36"
      chevronPosition="right"
      variant="separated"
      classNames={{
        item: 'border border-gray-200 rounded-lg mb-3 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white',
        control: 'text-left font-semibold hover:bg-gray-50 p-3 text-lg pl-6',
        panel: 'text-gray-700 leading-relaxed p-3 pt-4 text-md'
      }}
    >
      {activeCategoryData.questions.map((faq, index) => (
        <Accordion.Item key={index} value={`question-${index}`}>
          <Accordion.Control>{faq.question}</Accordion.Control>
          <Accordion.Panel>{faq.answer}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};
