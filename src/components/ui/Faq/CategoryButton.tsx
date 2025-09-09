import type { JSX } from 'react';
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

interface CategoryButtonProps {
  category: Category;
  isActive: boolean;
  onClick: (categoryId: string) => void;
}

export const CategoryButton = ({ category, isActive, onClick }: CategoryButtonProps): JSX.Element => {
  const { t } = useTranslation('faq');

  return (
    <button
      className={`
        flex flex-col items-center text-center text-gray-700 p-6 rounded-2xl border transition-all duration-200
        ${
          isActive
            ? 'border-primary-500 bg-primary-50 shadow-md'
            : 'border-gray-300  hover:bg-accent1-50 hover:border-accent1-300 hover:shadow-sm'
        }
      `}
      onClick={() => {
        onClick(category.id);
      }}
    >
      <div className="text-3xl mb-3">{category.icon}</div>
      <div className="font-semibold text-md mb-1">{category.title}</div>
      <div className="text-xs text-gray-500">{t('questionsCount', { count: category.questions.length })}</div>
    </button>
  );
};
