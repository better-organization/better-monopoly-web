import { Trophy, Zap, Gift, Heart, DollarSign, Ban } from 'lucide-react';
import Image from 'next/image'
import type { BoardSpace } from '@/types/game';

interface GetIconOptions {
  space: BoardSpace;
  logos?: { [key: string]: string };
  subTypeColors?: { [key: string]: { primary: string; secondary: string; gradient: string; logo: string | null } };
  size?: number;
  className?: string;
  invertColor?: boolean;
}

export function getSpaceIcon({
  space,
  logos = {},
  size = 32,
  className,
  invertColor = false
}: GetIconOptions): JSX.Element | null {
  // Check if we have a custom logo for this space by name (from logos object)
  const customLogo = logos?.[space.name];

  if (customLogo && customLogo.startsWith('http')) {
    return (
      <Image
        src={customLogo}
        alt={space.name}
        width={size}
        height={size}
        className={className}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: 'contain',
          filter: invertColor ? 'brightness(0) invert(1)' : undefined
        }}
      />
    );
  }

  // Fallback to lucide icons
  const iconClass = className || "w-8 h-8";

  switch (space.cell_type) {
    case 'transport':
      return <Trophy className={iconClass} />;
    case 'utility':
      return <Zap className={iconClass} />;
    case 'special':
      if (space.cell_sub_type === 'Community Chest') {
        return <Gift className={iconClass} />;
      }
      if (space.cell_sub_type === 'Chance') {
        return <Heart className={iconClass} />;
      }
      if (space.action_keyword === 'tax') {
        return <DollarSign className={iconClass} />;
      }
      return <Ban className={iconClass} />;
    default:
      return null;
  }
}

