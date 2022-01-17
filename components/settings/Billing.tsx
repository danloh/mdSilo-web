import PricingFaq from 'components/PricingFaq';

export default function Billing() {
  return (
    <div className="flex-1 w-full h-full p-6 overflow-y-auto bg-white dark:bg-gray-800 dark:text-gray-100">
      <PricingFaq className="py-12 sm:py-16" />
    </div>
  );
}
