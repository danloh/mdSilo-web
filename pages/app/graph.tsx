// import { useEffect } from 'react';
// import { useStore } from 'lib/store';
import ErrorBoundary from 'components/misc/ErrorBoundary';
import ForceGraph from './ForceGraph';

export default function Graph() {
  // const isLoaded = useStore((state) => state.isLoaded);
  // const setIsLoaded = useStore((state) => state.setIsLoaded);
  // const initDir = useStore((state) => state.initDir);
  // // console.log("g loaded?", isLoaded);
  // useEffect(() => {
  //   if (!isLoaded && initDir) {
  //     loadDir(initDir).then(() => setIsLoaded(true));
  //   }
  // }, [initDir, isLoaded, setIsLoaded]);

  return (
    <ErrorBoundary>
      <ForceGraph className="flex-1" />
    </ErrorBoundary>
  );
}
