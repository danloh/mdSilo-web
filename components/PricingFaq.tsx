
type Props = {
  className?: string;
};

export default function PricingFaq(props: Props) {
  const { className } = props;
  return (
    <div className={className}>
      <h2 className="text-4xl text-center font-semibold text-gray-900 dark:text-gray-100">
        Q & A
      </h2>
      <div className="pt-10 mt-6 border-t dark:border-gray-700">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              How do I subscribe?
            </h3>
            <div className="mt-2">
              <p className="text-gray-600 dark:text-gray-300">
                Sign up for an account and sign in. Click on
                &ldquo;mdSilo&rdquo; in the sidebar, then &ldquo;Billing&rdquo; 
                and choose the plan you want.
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Can I cancel at any time?
            </h3>
            <div className="mt-2">
              <p className="text-gray-600 dark:text-gray-300">
                Yes, you can cancel subscription at any time. You will
                continue to have access for the remainder of billing period.
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              What payment methods do you accept?
            </h3>
            <div className="mt-2">
              <p className="text-gray-600 dark:text-gray-300">
                We accept all major debit and credit cards from customers in every country 
                via Stripe, including Visa, Mastercard, American Express, JCB, and UnionPay, etc.
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              What happens if my subscription expires?
            </h3>
            <div className="mt-2">
              <p className="text-gray-600 dark:text-gray-300">
                You can renew or upgrade your subscription. We will keep your data active.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                If you are on Promised Plan, you can get reward or roll over to the next subscription 
                if you keep the promise in current subscription.
              </p>
            </div>
          </div>
          {/* <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Can I get a discount?
            </h3>
            <div className="mt-2">
              <p className="text-gray-600 dark:text-gray-300">
                If you subscribe now, you will get a lifetime
                discount on the full price. You will be locked in at this
                lower price as long as your subscription remains active. Prices
                will go up at any time.
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Can I refer friends?
            </h3>
            <div className="mt-2">
              <p className="text-gray-600 dark:text-gray-300">
                Yes, and you can benefit from it. When you refer friends to mdSilo using your referral link, when the referred customer has been an active user for 90 days, you’ll receive 1 month of subscription for free.
              </p>
            </div>
          </div> 
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              What happens if I switch between the monthly and yearly plans?
            </h3>
            <div className="mt-2">
              <p className="text-gray-600 dark:text-gray-300">
                You will receive a prorated credit for the time remaining on
                your current plan and be billed for the new plan.
              </p>
            </div>
          </div>*/}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Can I try mdSilo for free?
            </h3>
            <div className="mt-2">
              <p className="text-gray-600 dark:text-gray-300">
                Yes, you can always use mdSilo for free, no register required, 
                unless you subscribe any add-on services.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Actually, if you Choose Promised Plan and keep a main promise: writing 25 days in each 30 days, then you will get the reward, just as same as using mdSilo for free.
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Please explain more about Promised Plan?
            </h3>
            <div className="mt-2">
              <p className="text-gray-600 dark:text-gray-300">
                On Promised Plan: Try to keep a promise: writing 25 days in each 30 days, 
                no in row required. You pay only when you break the promise.
                As a promise keeper, mdSilo help you build habit via daily I/O(reading and writing).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
