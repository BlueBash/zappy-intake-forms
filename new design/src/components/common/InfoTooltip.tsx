import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface InfoTooltipProps {
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  asSpan?: boolean; // Use span instead of button when nested inside another button
}

/**
 * InfoTooltip - Elegant tooltip for explaining medical terms and jargon
 * 
 * Design Specs:
 * - Max width: 280px
 * - Background: rgba(0,0,0,0.9) with subtle gradient
 * - Border radius: 12px
 * - Drop shadow: Soft elevation
 * - Arrow pointer for visual connection
 * - Icon: 20x20px info icon
 * - Animation: 200ms fade in, 300ms delay
 * 
 * @example
 * <InfoTooltip content="Eye damage caused by diabetes. Your doctor screens for this regularly." />
 */
export function InfoTooltip({ content, side = 'top', className = '', asSpan = false }: InfoTooltipProps) {
  const iconContent = <Info className="w-3.5 h-3.5" strokeWidth={2.5} />;
  const sharedClassName = `inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#0D9488]/10 hover:bg-[#0D9488]/20 text-[#0D9488] hover:text-[#14B8A6] transition-all duration-200 ${className}`;
  
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        {asSpan ? (
          <span
            className={sharedClassName}
            role="img"
            aria-label="More information"
          >
            {iconContent}
          </span>
        ) : (
          <button
            type="button"
            className={`${sharedClassName} focus:outline-none focus:ring-2 focus:ring-[#1a7f72]/40 focus:ring-offset-1`}
            aria-label="More information"
          >
            {iconContent}
          </button>
        )}
      </TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={8}
        className="max-w-[280px] px-4 py-3 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white border border-neutral-700/50 rounded-xl shadow-2xl backdrop-blur-sm"
        style={{
          animation: 'tooltipFadeIn 0.2s ease-out',
        }}
      >
        <p className="text-xs leading-relaxed">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * InlineTooltip - Tooltip that appears inline with text (like a glossary term)
 * 
 * @example
 * <InlineTooltip term="GLP-1" content="Medications that help regulate blood sugar and reduce appetite." />
 */
export function InlineTooltip({ 
  term, 
  content, 
  side = 'top' 
}: { 
  term: string; 
  content: string; 
  side?: 'top' | 'right' | 'bottom' | 'left';
}) {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-[#1a7f72] hover:text-[#156b60] underline decoration-dotted underline-offset-2 decoration-[#1a7f72]/40 hover:decoration-[#156b60]/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1a7f72]/40 focus:ring-offset-1 rounded px-0.5"
        >
          {term}
          <Info className="w-3 h-3" strokeWidth={2.5} />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={8}
        className="max-w-[280px] px-4 py-3 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white border border-neutral-700/50 rounded-xl shadow-2xl backdrop-blur-sm"
      >
        <p className="text-xs leading-relaxed">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
