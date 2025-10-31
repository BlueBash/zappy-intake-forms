/**
 * Logo Component
 * 
 * Centralized Zappy logo component used throughout the application.
 * Single source of truth for logo styling, color, and sizing.
 */

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = '', size = 'xl' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-xl'
  };

  return (
    <span className={`text-black ${sizeClasses[size]} ${className}`}>
      Zappy
    </span>
  );
}
