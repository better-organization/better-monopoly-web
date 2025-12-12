import { Shield } from 'lucide-react';
import Image from 'next/image'
import { CSSProperties } from 'react';

interface ClubLogoProps {
  clubName: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  style?: CSSProperties;
  logos?: { [key: string]: string };
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
  logos = {}
}: ClubLogoProps) {
  const logoUrl = logos[clubName];
  const initials = getClubInitials(clubName);

  // If we have a logo URL, use it
  if (logoUrl) {
    return (
      <div className={`${className} relative flex items-center justify-center w-full h-full`} style={style}>
        <Image
          src={logoUrl}
          alt={`${clubName} logo`}
          width={100}
          height={100}
          style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
          onError={(e) => {
            // Fallback to initials badge on error
            const target = e.currentTarget;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && parent.parentElement) {
              const fallback = document.createElement('div');
              fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 rounded-full border-2 border-gray-500 shadow-inner';
              fallback.innerHTML = `<span class="text-[10px] font-bold text-white">${initials}</span>`;
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
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 rounded-full border-2 border-gray-500 shadow-inner relative">
        <Shield className="w-4 h-4 text-gray-400 absolute opacity-30" />
        <span className="text-[10px] z-10 text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '700' }}>
          {initials}
        </span>
      </div>
    </div>
  );
}
