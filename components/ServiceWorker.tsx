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

      const showUpdateBanner = () => {
        const updateBanner = document.getElementById('update-banner');
        if (updateBanner) {
          updateBanner.classList.replace('hidden', 'block');
        }
      };
      wb.addEventListener('waiting', showUpdateBanner);

      // Register service worker
      wb.register();
    }
  }, []);

  return children;
}
