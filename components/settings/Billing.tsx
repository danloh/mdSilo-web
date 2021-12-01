import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from 'utils/useAuth';
import PricingPlans from 'components/PricingPlans';
import PricingFaq from 'components/PricingFaq';

export default function Billing() {
  const { user } = useAuthContext();
  const router = useRouter();

  const onSubscribe = useCallback(
    async (planId: string, price: number, isYearly: boolean) => {
      if (!price || !user) {
        return;
      }
      // TODO: to checkout page
      router.replace(`/${price}/${planId}/${isYearly}`);
    },
    [router, user]
  );

  const pricingButtons = useCallback(
    (planId: string, isYearly: boolean) => {
      const currentPlanIds: string[] = []; // PlanId[], TODO: per user
      const n = isYearly ? 12 : 1;
      const price = planId ? 1 * n : 0; // TODO: calc per planId and bill frequency
      const subPlanButton = (
        <button 
          className="block w-full px-4 py-2 btn" 
          onClick={() => onSubscribe(planId, price, isYearly)}
        >
          Subscribe
        </button>
      );

      const currentPlanBlock = (
        <div className="block w-full px-4 py-2 text-center text-gray-600 border rounded dark:text-gray-400">
          Subscribed
        </div>
      );

      const btn = currentPlanIds.includes(planId) 
        ? currentPlanBlock 
        : subPlanButton;

      return btn;
    },
    [onSubscribe]
  );

  return (
    <div className="flex-1 w-full h-full p-6 overflow-y-auto bg-white dark:bg-gray-800 dark:text-gray-100">
      <PricingPlans btn={pricingButtons} />
      <PricingFaq className="py-12 sm:py-16" />
    </div>
  );
}
