import { Badge, Table } from '@mantine/core';
import clsx from 'clsx';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

interface PricingInfoProps {
  countryToSmsCostMap: Record<'ES', number>;
}

const PricingInfo = ({ countryToSmsCostMap }: PricingInfoProps): JSX.Element => {
  const { t } = useTranslation();

  const pricingData = [
    { country: `${String(t('generic.countries.spain'))} (+34)`, price: countryToSmsCostMap['ES'] },
    { country: t('pricing.comingSoon'), price: null }
  ];

  return (
    <>
      <h1 className="text-4xl font-bold">{t('pricing.title')}</h1>
      <span className="mt-2 font-medium">{t('pricing.description')}</span>
      <Table highlightOnHover className="mt-3" horizontalSpacing="xs">
        <Table.Tbody>
          {pricingData.map((row, index) => (
            <Table.Tr key={index}>
              <Table.Td className={clsx({ 'font-light text-gray-400': !row.price })}>{row.country}</Table.Td>
              <Table.Td>
                {row.price ? (
                  <Badge color="primary" size="sm" variant="light">
                    {row.price} <span className="normal-case">{t('pricing.credits')}</span>
                  </Badge>
                ) : (
                  <span className="text-gray-400 pl-6">—</span>
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
};

export default PricingInfo;
