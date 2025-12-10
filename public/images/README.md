# Image Resources Structure

This document outlines the image folder structure for the Better Monopoly frontend application.

## Folder Structure

### `/public/images/`

Static images served directly by Next.js. These can be referenced using `/images/...` in your code.

#### `/public/images/icons/`

- App icons, favicons
- UI icons (login, logout, settings, etc.)
- Social media icons
- Example usage: `<img src="/images/icons/logo.png" alt="Logo" />`

#### `/public/images/game/`

- Monopoly game board images
- Property cards
- Game pieces/tokens
- Dice images
- Money/currency images
- Example usage: `<img src="/images/game/board.jpg" alt="Game Board" />`

#### `/public/images/ui/`

- Background images
- Buttons and UI elements
- Patterns and textures
- Avatar placeholders
- Example usage: `<img src="/images/ui/background.jpg" alt="Background" />`

### `/src/assets/images/`

Images that need to be processed by webpack (imported in components). Use this for images that might need optimization or are used in CSS.

- Example usage: `import logoImage from '@/assets/images/logo.png'`

## Usage Guidelines

### For Static Images (use `/public/images/`)

```jsx
// Direct reference in JSX
<img src="/images/icons/logo.png" alt="Logo" />

// In CSS
background-image: url('/images/ui/background.jpg');

// Next.js Image component
import Image from 'next/image'
<Image src="/images/game/board.jpg" alt="Game Board" width={500} height={300} />
```

### For Imported Images (use `/src/assets/images/`)

```jsx
import logoImage from "@/assets/images/logo.png";

// In JSX
<img src={logoImage} alt="Logo" />;

// With Next.js Image component
import Image from "next/image";
<Image src={logoImage} alt="Logo" width={200} height={100} />;
```

## Recommended File Formats

- **Icons**: SVG (preferred), PNG with transparency
- **Game Assets**: PNG for detailed graphics, SVG for simple shapes
- **Backgrounds**: JPG for photos, PNG for graphics with transparency
- **UI Elements**: SVG (preferred), PNG

## File Naming Convention

- Use kebab-case: `game-board.jpg`, `player-token-1.png`
- Be descriptive: `monopoly-logo-white.svg`, `dice-animation-sprite.png`
- Include size if multiple versions: `logo-32x32.png`, `logo-64x64.png`

## Optimization Tips

1. Compress images before adding them
2. Use appropriate formats (WebP when possible)
3. Consider using Next.js Image component for automatic optimization
4. Use SVG for simple graphics and icons
5. Provide multiple sizes for different screen densities when needed
