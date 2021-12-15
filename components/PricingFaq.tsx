
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
        </div>
      </div>
    </div>
  );
}
