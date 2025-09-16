import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import FooterLinksGroup from './FooterLinksGroup';

interface FooterLinkData {
  title: string;
  to: string;
}

interface CollapsibleFooterLinksProps {
  links: Array<FooterLinkData>;
}

const CollapsibleFooterLinks: React.FC<CollapsibleFooterLinksProps> = ({ links }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  if (links.length === 0) {
    return null;
  }

  return (
    <>
      <button
        aria-expanded={isExpanded}
        aria-label={isExpanded ? t('footer.hideLinks') : t('footer.showMoreLinks')}
        className="flex items-center gap-1 hover:text-gray-700 transition-colors text-gray-500 font-semibold"
        type="button"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        {isExpanded ? t('footer.less') : t('footer.more')}
        {isExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            animate={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <FooterLinksGroup className="flex flex-col items-center gap-3" links={links} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CollapsibleFooterLinks;
