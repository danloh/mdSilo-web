import { useEffect } from 'react';

type Props = {
  children: JSX.Element;
};

export default function ServiceWorker(props: Props) {
  const { children } = props;

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;
      // Register service worker
      wb.register();
    }
  }, []);

  return children;
}
