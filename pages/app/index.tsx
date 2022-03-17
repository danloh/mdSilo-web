import Link from 'next/link';

export default function AppHome() {
  return (
    <div className="flex items-center justify-center flex-1 w-full p-12">
      <p className="text-center text-gray-500">
        Get started <Link href="/app/chronicle"><a>Here</a></Link>
      </p>
    </div>
  );
}
