import { Container } from '@mantine/core';
import type { JSX } from 'react';

import { useFaqCategories } from '@hooks/useFaqCategories';
import { useTranslation } from 'react-i18next';
import { CategoryButton } from './CategoryButton';
import { FaqAccordion } from './FaqAccordion';

interface FaqProps {
  showTitle?: boolean;
}

export const Faq = ({ showTitle = true }: FaqProps): JSX.Element | null => {
  const { t } = useTranslation('faq');
  const { categories, activeCategory, activeCategoryData, handleCategoryClick } = useFaqCategories();

  return (
    <Container className="py-4" size="xl">
      {showTitle && <h1 className="text-2xl font-bold text-secondary-500 mb-5">{t('title')}</h1>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <CategoryButton key={category.id} category={category} isActive={isActive} onClick={handleCategoryClick} />
          );
        })}
      </div>

      <FaqAccordion activeCategoryData={activeCategoryData} />
    </Container>
  );
};
