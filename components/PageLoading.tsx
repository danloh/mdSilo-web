import Spinner from './Spinner';
import Logo from './Logo';

export default function PageLoading() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen space-y-4 dark:bg-gray-900">
      <Logo width={64} height={64} />
      <Spinner className={"w-20 h-20"} />
    </div>
  );
}
