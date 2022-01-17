
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
        <div className="grid gap-8 md:grid-cols-2"></div>
      </div>
    </div>
  );
}
