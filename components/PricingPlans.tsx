import { ReactNode, useCallback, useState } from 'react';
import {
  BillingFrequency,
  isSubscription,
  PlanId,
  PRICING_PLANS,
} from 'constants/pricing';
import PricingPlan from './PricingPlan';
import Toggle from './Toggle';

const PRO_BULLET_POINTS = [
  'Sync writings to the clould',
  'Built-in version history',
];

const PUBLISH_BULLET_POINTS = [
  'Sync writings to the clould',
  'Publish writing',
];

const PROMISED_BULLET_POINTS = [
  'Help to keep promise',
  'Only sync the metadata',
];

type Props = {
  btn?: (planId: string, isYearly: boolean) => ReactNode;
};

export default function PricingPlans(props: Props) {
  const { btn } = props;
  const [showAnnual, setShowAnnual] = useState(true);

  const getBillingPeriodPrice = useCallback(
    (planId: PlanId, showAnnual: boolean) => {
      const plan = PRICING_PLANS[planId];
      let price;
      if (isSubscription(plan.prices)) {
        price = showAnnual
          ? plan.prices[BillingFrequency.Annual]
          : plan.prices[BillingFrequency.Monthly];
      } else {
        price = plan.prices[BillingFrequency.OneTime];
      }
      return +(price.amount / 100).toFixed(2);
    },
    []
  );

  return (
    <>
      <h1 className="mt-4 text-4xl text-center text-gray-800 dark:text-gray-200">
        Add-on Services 
      </h1>
      <h3 className="mt-4 text-2xl text-center text-gray-500">
        How often do you want to pay?
      </h3>
      <div className="flex items-center justify-center py-8 md:py-10">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Monthly
        </span>
        <Toggle
          id="billing-freq"
          className="mx-2"
          isChecked={showAnnual}
          setIsChecked={setShowAnnual}
        />
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Yearly{' '}
          <span className="px-3 py-1 ml-1 font-semibold rounded-full text-primary-900 bg-yellow-200 whitespace-nowrap">
            Huge Off!
          </span>
        </span>
      </div>
      <div className="grid gap-4 mx-auto lg:grid-cols-3">
        <PricingPlan
          className="w-full mx-auto md:w-96 lg:w-full"
          name={PRICING_PLANS[PlanId.Pro].name}
          price={getBillingPeriodPrice(PlanId.Pro, showAnnual)}
          period={showAnnual ? '/ yr' : '/ mo'}
          discount={showAnnual ? '108' : '12'}
          bulletPoints={PRO_BULLET_POINTS}
          button={btn?.(PRICING_PLANS[PlanId.Pro].name, showAnnual)}
        />
        <PricingPlan
          className="w-full mx-auto md:w-96 lg:w-full"
          name={PRICING_PLANS[PlanId.Publish].name}
          price={getBillingPeriodPrice(PlanId.Publish, showAnnual)}
          period={showAnnual ? '/ yr' : '/ mo'}
          bulletPoints={PUBLISH_BULLET_POINTS}
          button={btn?.(PRICING_PLANS[PlanId.Publish].name, showAnnual)}
        />
        <PricingPlan
          className="w-full mx-auto md:w-96 lg:w-full"
          name={PRICING_PLANS[PlanId.Promised].name}
          price={getBillingPeriodPrice(PlanId.Promised, showAnnual)}
          period={showAnnual ? '/ yr' : '/ mo'}
          bulletPoints={PROMISED_BULLET_POINTS}
          button={btn?.(PRICING_PLANS[PlanId.Promised].name, showAnnual)}
        />
      </div>
    </>
  );
}
