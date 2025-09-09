import { useState } from 'react';
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

interface UseFaqCategoriesResult {
  categories: Array<Category>;
  activeCategory: string;
  activeCategoryData: Category | undefined;
  handleCategoryClick: (categoryId: string) => void;
}

export const useFaqCategories = (): UseFaqCategoriesResult => {
  const { t } = useTranslation('faq');
  const categories = t('categories', { returnObjects: true }) as Array<Category>;

  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || '');

  const handleCategoryClick = (categoryId: string): void => {
    setActiveCategory(categoryId);
  };

  const activeCategoryData = categories.find((cat) => cat.id === activeCategory);

  return {
    categories,
    activeCategory,
    activeCategoryData,
    handleCategoryClick
  };
};
