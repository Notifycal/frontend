import { useTranslation } from 'react-i18next';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

interface FooterToggleButtonProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const FooterToggleButton: React.FC<FooterToggleButtonProps> = ({ isExpanded, onToggle }) => {
  const { t } = useTranslation();

  return (
    <button
      aria-expanded={isExpanded}
      aria-label={isExpanded ? t('footer.hideLinks') : t('footer.showMoreLinks')}
      className="flex items-center gap-1 hover:text-gray-700 transition-colors text-gray-500 font-semibold"
      type="button"
      onClick={onToggle}
    >
      {isExpanded ? t('footer.less') : t('footer.more')}
      {isExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
    </button>
  );
};

export default FooterToggleButton;
