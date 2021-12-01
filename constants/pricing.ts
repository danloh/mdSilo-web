
// TODO:
// add-on services
// pro: 
// publish:
// promised: custom price, roll over, need to process refund as reward, 
// cannot be refund in law.
export enum PlanId {
  Pro = 'pro',  // sync
  Publish = 'publish',
  Promised = 'promised',
}

export enum Feature {
  NumOfNotes = 'num-of-notes',
  Sync = 'sync',
  VersionControl = 'version-control',
  Publish = 'publish',
  IOTracker = 'io-tracker', // sync metadata only
  PromiseKeeper = 'promise-keeper',
}

export enum BillingFrequency {
  Monthly = 'monthly',
  Annual = 'annual',
  OneTime = 'one_time',
}

export type Price = {
  amount: number;
  frequency: BillingFrequency;
  priceId?: string;
};

type SubscriptionPrices = {
  [BillingFrequency.Monthly]: Price;
  [BillingFrequency.Annual]: Price;
};
type OneTimePrices = { [BillingFrequency.OneTime]: Price };
type PlanPrices = SubscriptionPrices | OneTimePrices;

export type Plan<Prices extends PlanPrices> = {
  id: PlanId;
  name: string;
  productId: string | null;
  prices: Prices;
  features: readonly { name: Feature; amount?: number }[];
};

const PRO_FEATURES = [
  { name: Feature.NumOfNotes, amount: Number.POSITIVE_INFINITY },
  { name: Feature.Sync, amount: Number.POSITIVE_INFINITY },
  { name: Feature.VersionControl, amount: Number.POSITIVE_INFINITY },
];
const PUBLISH_FEATURES = [
  { name: Feature.NumOfNotes, amount: Number.POSITIVE_INFINITY },
  { name: Feature.Sync, amount: Number.POSITIVE_INFINITY },
  { name: Feature.Publish, amount: Number.POSITIVE_INFINITY },
];
const PROMISED_FEATURES = [
  { name: Feature.NumOfNotes, amount: Number.POSITIVE_INFINITY },
  { name: Feature.IOTracker, amount: Number.POSITIVE_INFINITY },
  { name: Feature.PromiseKeeper, amount: Number.POSITIVE_INFINITY },
];

type Plans = {
  [PlanId.Pro]: Plan<SubscriptionPrices>;
  [PlanId.Publish]: Plan<SubscriptionPrices>;
  [PlanId.Promised]: Plan<SubscriptionPrices>;
};

export const PRICING_PLANS: Plans = {
  [PlanId.Pro]: {
    id: PlanId.Pro,
    name: 'Pro',
    productId: 'pro',
    prices: {
      [BillingFrequency.Monthly]: {
        frequency: BillingFrequency.Monthly,
        amount: 500,
        priceId: 'pro-month',
      },
      [BillingFrequency.Annual]: {
        frequency: BillingFrequency.Annual,
        amount: 5000,
        priceId: 'pro-annual',
      },
    },
    features: PRO_FEATURES,
  },
  [PlanId.Publish]: {
    id: PlanId.Pro,
    name: 'Publish',
    productId: 'publish',
    prices: {
      [BillingFrequency.Monthly]: {
        frequency: BillingFrequency.Monthly,
        amount: 1500,
        priceId: 'publish-month',
      },
      [BillingFrequency.Annual]: {
        frequency: BillingFrequency.Annual,
        amount: 15000,
        priceId: 'publish-annual',
      },
    },
    features: PUBLISH_FEATURES,
  },
  [PlanId.Promised]: {
    id: PlanId.Promised,
    name: 'Promised',
    productId: 'promised',
    prices: {
      [BillingFrequency.Monthly]: {
        frequency: BillingFrequency.Monthly,
        amount: 1500,
        priceId: 'promised-month',
      },
      [BillingFrequency.Annual]: {
        frequency: BillingFrequency.Annual,
        amount: 15000,
        priceId: 'promised-annual',
      },
    },
    features: PROMISED_FEATURES,
  },
} as const;

export const getPlanIdByProductId = (productId: string | null) => {
  for (const plan of Object.values(PRICING_PLANS)) {
    if (plan.productId === productId) {
      return plan.id;
    }
  }
};

export const getFrequencyByPriceId = (priceId: string): BillingFrequency => {
  for (const plan of Object.values(PRICING_PLANS)) {
    for (const price of Object.values(plan.prices)) {
      if (price.priceId === priceId) {
        return price.frequency;
      }
    }
  }
  return BillingFrequency.Monthly;
};

export const isSubscription = (
  prices: PlanPrices
): prices is SubscriptionPrices => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!(prices as any).monthly && !!(prices as any).annual;
};
