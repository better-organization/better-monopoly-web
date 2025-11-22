# Developer Quick Reference

## Daily Commands

```bash
# Start development server
yarn dev

# Run tests in watch mode
yarn test:watch

# Check code quality before commit
yarn lint && yarn type-check
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Test updates
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes

**Examples:**
```
feat: add player management component
fix: resolve game state synchronization issue
docs: update API integration guide
test: add unit tests for Button component
```

## Testing

```bash
# Run all tests once
yarn test

# Watch mode (for development)
yarn test:watch

# Generate coverage report
yarn test:coverage

# Run specific test file
yarn test Button.test.tsx
```

## Building

```bash
# Development build
yarn build

# Production build with optimizations
NODE_ENV=production yarn build

# Start production server
yarn start
```

## Docker

```bash
# Build image
docker build -t better-monopoly-web .

# Run container
docker run -p 8081:8081 better-monopoly-web

# Use docker-compose
docker-compose up -d
docker-compose logs -f
docker-compose down
```

## Code Quality

```bash
# Lint check
yarn lint

# Lint and auto-fix
yarn lint --fix

# Type check
yarn type-check

# Run all checks
yarn lint && yarn type-check && yarn test
```

## Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit variables
vim .env.local  # or use your preferred editor
```

**Required variables:**
```env
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8080
BACKEND_API_URL=http://localhost:8080
NODE_ENV=development
```

## Project Structure

```
src/
├── app/              # Next.js pages (App Router)
│   ├── layout.tsx   # Root layout
│   ├── page.tsx     # Home page
│   └── globals.css  # Global styles
├── components/       # Reusable components
├── services/         # API services
├── types/           # TypeScript types
└── utils/           # Utility functions
```

## Adding New Components

```tsx
// src/components/YourComponent.tsx
export interface YourComponentProps {
  // props here
}

export default function YourComponent({ }: YourComponentProps) {
  return <div>Your component</div>;
}

// src/components/__tests__/YourComponent.test.tsx
import { render, screen } from '@testing-library/react';
import YourComponent from '../YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    // assertions
  });
});
```

## API Integration

```typescript
// Add new service method in src/services/gameService.ts
export const gameService = {
  // ... existing methods
  
  newMethod: async (param: string): Promise<Response> => {
    return apiClient.get<Response>(`/endpoint/${param}`);
  },
};

// Use in component
import { gameService } from '@/services/gameService';

const data = await gameService.newMethod('value');
```

## Troubleshooting

### Port 8081 in use
```bash
lsof -ti:8081 | xargs kill -9
```

### Clear cache
```bash
rm -rf .next node_modules
yarn install
```

### Test failures
```bash
yarn test --clearCache
yarn test
```

### Type errors
```bash
yarn install
yarn type-check
```

## GitHub Actions

### View workflow runs
Go to: **Actions** tab in GitHub

### Manually trigger workflow
1. Actions → Select workflow → Run workflow
2. Choose branch and options
3. Run workflow

### Check failed workflow
1. Click on failed workflow
2. Review job logs
3. Fix issues locally
4. Push fixes

## Pre-commit Checklist

- [ ] Code formatted correctly
- [ ] Tests passing (`yarn test`)
- [ ] Lint passing (`yarn lint`)
- [ ] Types valid (`yarn type-check`)
- [ ] Build successful (`yarn build`)
- [ ] Environment variables documented
- [ ] Tests added for new features
- [ ] Documentation updated if needed

## Useful Links

- [Project README](../README.md)
- [CI/CD Documentation](.github/CICD.md)
- [Getting Started Guide](../GETTING_STARTED.md)
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

## Need Help?

1. Check documentation files
2. Search existing issues
3. Ask in team chat
4. Create new issue with details

---

**Happy coding! 🚀**
