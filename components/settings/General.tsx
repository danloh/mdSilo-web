import { useStore } from 'lib/store';
import Toggle from 'components/misc/Toggle';

export default function General() {
  const darkMode = useStore((state) => state.darkMode);
  const setDarkMode = useStore((state) => state.setDarkMode);
  const offlineMode = useStore((state) => state.offlineMode);
  // const setOfflineMode = useStore((state) => state.setOfflineMode);

  return (
    <div className="flex-1 w-full h-full p-6 overflow-y-auto dark:bg-gray-800 dark:text-gray-100">
      <h1 className="mb-4 text-lg font-medium">Theme</h1>
      <div className="flex items-center">
        <span className="text-sm text-gray-600 dark:text-gray-300">Light</span>
        <Toggle
          id="theme-mode"
          className="mx-2"
          isChecked={darkMode}
          setIsChecked={setDarkMode}
        />
        <span className="text-sm text-gray-600 dark:text-gray-300">Dark</span>
      </div>
      <div className="py-2"></div>
      <div className="mb-4 border-t dark:border-gray-700">
        <h1 className="text-lg font-medium">Mode</h1>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          {offlineMode ? `Offline: Privacy first` : 'Online: Sync with cloud'}
        </p>
      </div>
     {/*  <div className="flex items-center">
        <span className="text-sm text-gray-600 dark:text-gray-300">Online</span>
        <Toggle
          id="offline-mode"
          className="mx-2"
          isChecked={offlineMode}
          setIsChecked={setOfflineMode}
        />
        <span className="text-sm text-gray-600 dark:text-gray-300">Offline</span>
      </div> */}
    </div>
  );
}
