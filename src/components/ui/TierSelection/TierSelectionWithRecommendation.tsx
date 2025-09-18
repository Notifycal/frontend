import { type TierInfoWithIcon, TierCard } from '@notifycal/shared/components';
import type { LanguageCode, TierId } from '@notifycal/shared/types';
import type { FC } from 'react';

interface TierSelectionWithRecommendationProps {
  orderedTierInfoWithIcons: Array<TierInfoWithIcon>;
  onTierSelection: (tierId: TierId) => Promise<void>;
  isCardButtonDisabled: (tierId: TierId) => boolean;
  isCardButtonLoading: (tierId: TierId) => boolean;
  lang: LanguageCode;
  recommendedTier?: string | null;
  showContactUs?: boolean;
}

const translations = {
  en: {
    confidenceBooster: 'Cancel your subscription at any time from your control panel.',
    recommended: 'Recommended'
  },
  es: {
    confidenceBooster: 'Prueba gratuita de 30 días. Cancela cuando quieras.',
    recommended: 'Recomendado'
  },
  ca: {
    confidenceBooster: 'Prova gratuïta de 30 dies. Cancel·la quan vulguis.',
    recommended: 'Recomanat'
  }
};

export const TierSelectionWithRecommendation: FC<TierSelectionWithRecommendationProps> = ({
  orderedTierInfoWithIcons,
  onTierSelection,
  isCardButtonDisabled,
  isCardButtonLoading,
  lang,
  recommendedTier,
  showContactUs
}: TierSelectionWithRecommendationProps) => {
  const translation = translations[lang];
  console.log(translation);

  const modifyTierForRecommendation = (tier: TierInfoWithIcon): TierInfoWithIcon => {
    if (recommendedTier && tier.id === recommendedTier) {
      return {
        ...tier,
        recommended: true
      };
    }
    return {
      ...tier,
      recommended: Boolean(tier.recommended && !recommendedTier)
    };
  };

  return (
    <>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-6 lg:gap-12">
        {orderedTierInfoWithIcons.map((tier) => {
          const modifiedTier = modifyTierForRecommendation(tier);
          return (
            <TierCard
              key={tier.id}
              isDisabled={isCardButtonDisabled(tier.id)}
              isLoading={isCardButtonLoading(tier.id)}
              lang={lang}
              tier={modifiedTier}
              onSelect={onTierSelection}
            />
          );
        })}
      </div>

      {showContactUs && (
        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">¿Necesitas más mensajes?</h3>
            <p className="text-blue-600 text-sm mb-4">
              Tu estimación supera nuestros planes estándar. Contáctanos para una solución personalizada.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              Contactar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TierSelectionWithRecommendation;