import ErrorBoundary from 'components/misc/ErrorBoundary';
import ForceGraph from './ForceGraph';

export default function Graph() {
  
  return (
    <ErrorBoundary>
      <ForceGraph className="flex-1" />
    </ErrorBoundary>
  );
}
