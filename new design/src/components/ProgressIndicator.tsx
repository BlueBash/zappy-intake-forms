interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export function ProgressIndicator({ totalSteps, currentStep }: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="mb-12">
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#0D9488] to-[#14B8A6] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
