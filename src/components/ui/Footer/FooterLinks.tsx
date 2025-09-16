import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import FooterToggleButton from './FooterToggleButton';
import CookieSettingsLink from './CookieSettingsLink';
import FooterLinksGroup from './FooterLinksGroup';

interface FooterLinkData {
  title: string;
  to: string;
}

interface FooterLinksProps {
  links: Array<FooterLinkData>;
}

const FooterLinks: React.FC<FooterLinksProps> = ({ links }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center gap-3 md:hidden">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <CookieSettingsLink />
          {links.length > 0 && (
            <>
              <span>|</span>
              <FooterToggleButton
                isExpanded={isExpanded}
                onToggle={() => {
                  setIsExpanded(!isExpanded);
                }}
              />
            </>
          )}
        </div>

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
      </div>

      <div className="hidden md:flex items-center gap-8">
        <CookieSettingsLink />
        <FooterLinksGroup className="flex items-center gap-8" links={links} />
      </div>
    </>
  );
};

export default FooterLinks;
