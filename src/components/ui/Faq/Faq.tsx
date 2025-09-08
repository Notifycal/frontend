import { Accordion, Container } from '@mantine/core';
import { useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';

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

export const Faq = (): JSX.Element | null => {
  const { t } = useTranslation('faq');
  const categories = t('categories', { returnObjects: true }) as Array<Category>;

  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || '');

  const handleCategoryClick = (categoryId: string): void => {
    setActiveCategory(categoryId);
  };

  const activeCategoryData = categories.find((cat) => cat.id === activeCategory);

  return (
    <Container className="py-4" size="xl">
      <h1 className="text-2xl font-bold text-secondary-500 mb-8">{t('title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              className={`
                  flex flex-col items-center text-center text-gray-700 p-6 rounded-2xl border transition-all duration-200
                  ${
                    isActive
                      ? 'border-primary-500 bg-primary-50 shadow-md'
                      : 'border-gray-300  hover:bg-accent1-50 hover:border-accent1-300 hover:shadow-sm'
                  }
                `}
              onClick={() => {
                handleCategoryClick(category.id);
              }}
            >
              <div className="text-3xl mb-3">{category.icon}</div>
              <div className="font-semibold text-md mb-1">{category.title}</div>
              <div className="text-xs text-gray-500">{t('questionsCount', { count: category.questions.length })}</div>
            </button>
          );
        })}
      </div>

      {activeCategoryData && (
        <Accordion
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
      )}
    </Container>
  );
};
