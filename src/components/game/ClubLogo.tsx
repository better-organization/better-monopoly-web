import { Shield } from 'lucide-react';
import Image from 'next/image'
import { CSSProperties } from 'react';

interface ClubLogoProps {
  clubName: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  style?: CSSProperties;
  logos?: { [key: string]: string };
  size?: number; // Add size parameter for responsive scaling
}

// Get initials for fallback
const getClubInitials = (clubName: string): string => {
  const words = clubName.split(' ').filter(w => w.length > 0);
  if (words.length === 1) {
    return clubName.substring(0, 2).toUpperCase();
  }
  return words.map(w => w[0]).join('').substring(0, 3).toUpperCase();
};

export function ClubLogo({
  clubName,
  className = '',
  style,
  logos = {},
  size = 100, // Default size
}: ClubLogoProps) {
  const logoUrl = logos[clubName];
  const initials = getClubInitials(clubName);

  // Calculate responsive sizes for fallback elements
  const shieldSize = Math.max(12, size * 0.16); // ~16% of size, min 12px
  const textSize = Math.max(8, size * 0.1); // ~10% of size, min 8px
  const borderWidth = Math.max(1, size * 0.02); // ~2% of size, min 1px

  // If we have a logo URL, use it
  if (logoUrl) {
    return (
      <div className={`${className} relative flex items-center justify-center w-full h-full`} style={style}>
        <Image
          src={logoUrl}
          alt={`${clubName} logo`}
          width={size}
          height={size}
          style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
          onError={(e) => {
            // Fallback to initials badge on error
            const target = e.currentTarget;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && parent.parentElement) {
              const fallback = document.createElement('div');
              fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 rounded-full shadow-inner';
              fallback.style.borderWidth = `${borderWidth}px`;
              fallback.style.borderStyle = 'solid';
              fallback.style.borderColor = 'rgb(107, 114, 128)';
              fallback.innerHTML = `<span style="font-size: ${textSize}px; font-weight: 700; color: white; font-family: system-ui, -apple-system, sans-serif;">${initials}</span>`;
              parent.parentElement.appendChild(fallback);
            }
          }}
        />
      </div>
    );
  }

  // Fallback badge with initials
  return (
    <div className={`${className} w-full h-full flex items-center justify-center`} style={style}>
      <div
        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 rounded-full border-gray-500 shadow-inner relative"
        style={{ borderWidth: `${borderWidth}px`, borderStyle: 'solid' }}
      >
        <Shield
          className="text-gray-400 absolute opacity-30"
          style={{ width: `${shieldSize}px`, height: `${shieldSize}px` }}
        />
        <span
          className="z-10 text-white"
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '700',
            fontSize: `${textSize}px`
          }}
        >
          {initials}
        </span>
      </div>
    </div>
  );
}
