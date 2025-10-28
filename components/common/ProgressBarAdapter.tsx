import ExistingProgressBar from '../ui/ProgressBar';

interface ProgressBarProps {
  percentage: number;
  className?: string;
}

/**
 * ProgressBar Adapter Component
 * 
 * Adapter that wraps the existing ProgressBar component.
 * Translates the new design's "percentage" prop to the existing "progress" prop.
 * 
 * This allows ScreenHeader to use the new interface while keeping
 * the existing ProgressBar implementation intact.
 */
export default function ProgressBar({
  percentage,
  className = ''
}: ProgressBarProps) {
  return (
    <div className={className}>
      <ExistingProgressBar progress={percentage} />
    </div>
  );
}
