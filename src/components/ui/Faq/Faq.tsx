import { Container } from '@mantine/core';
import type { JSX } from 'react';

import { useFaqCategories } from '@hooks/useFaqCategories';
import { CategoryButton } from './CategoryButton';
import { FaqAccordion } from './FaqAccordion';

export const Faq = (): JSX.Element | null => {
  const { categories, activeCategory, activeCategoryData, handleCategoryClick } = useFaqCategories();

  return (
    <Container className="py-4" size="xl">
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
