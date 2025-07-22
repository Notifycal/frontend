import type { TierId } from '@notifycal/shared/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PurchaseOperation = 'topupPurchase' | 'tierPurchase';

interface BillingState {
  // State
  topupCreditBalance: number;
  tier: TierId | null; // Assuming tier is a string, or null if not set
  purchaseOperation: PurchaseOperation | null,
  // Actions
  setTopupCreditBalance: (balance: number) => void;
  setTier: (tier: TierId) => void;
  setPurchaseOperation: (operation: PurchaseOperation) => void;
}

const initialState = {
  topupCreditBalance: 0,
  tier: null,
  purchaseOperation: null,
};

export const useBillingStore = create<BillingState>()(
  persist(
    (set) => ({
      ...initialState,

      setTopupCreditBalance: (topupCreditBalance): void => {
        set({ topupCreditBalance });
      },
      setTier: (tier: TierId): void => {
        set({ tier });
      },
      setPurchaseOperation: (purchaseOperation): void => {
        set({ purchaseOperation });
      }
    }),
    { name: 'billingInfo' }
  )
);
