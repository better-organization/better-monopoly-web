# Getting Started with Better Monopoly Web

## Quick Setup Guide

### Step 1: Install Dependencies
```bash
yarn install
```

This will install all the required dependencies listed in `package.json`.

### Step 2: Set Up Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` if you need to change the backend URL (default is `http://localhost:8080`).

### Step 3: Start Development Server
```bash
yarn dev
```

Your app will be running at: **http://localhost:8081**

### Step 4: Run Tests (Optional)
```bash
yarn test
```

---

## First-Time Setup Checklist

- [ ] Install Node.js 18+ and Yarn
- [ ] Clone the repository
- [ ] Run `yarn install`
- [ ] Copy `.env.example` to `.env.local`
- [ ] Run `yarn dev` to start the development server
- [ ] Visit http://localhost:8081 in your browser
- [ ] Run `yarn test` to verify tests are working

---

## Common Commands

```bash
# Development
yarn dev                # Start dev server on port 8081
yarn build              # Build for production
yarn start              # Run production build

# Testing
yarn test               # Run all tests
yarn test:watch         # Run tests in watch mode
yarn test:coverage      # Generate coverage report

# Code Quality
yarn lint               # Run ESLint
yarn type-check         # Check TypeScript types
```

---

## Docker Setup

### Build and Run
```bash
# Build the Docker image
docker build -t better-monopoly-web .

# Run the container
docker run -p 8081:8081 better-monopoly-web
```

### Using Docker Compose
```bash
# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down
```

---

## Project Structure Overview

```
better-monopoly-web/
├── src/
│   ├── app/              # Next.js pages (App Router)
│   ├── components/       # Reusable React components
│   ├── services/         # API services & HTTP client
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── public/               # Static assets
├── __tests__/            # Test files
└── Config files          # Various config files
```

---

## Connecting to Backend

The frontend expects a backend service at `http://localhost:8080` by default.

### Local Development
Make sure your backend is running before starting the frontend:
```bash
# In your backend directory
docker-compose up
```

### Environment Configuration
Update `.env.local` to point to your backend:
```bash
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8080
BACKEND_API_URL=http://localhost:8080
```

---

## Next Steps

1. **Explore the Code**: Start with `src/app/page.tsx` to see the home page
2. **Review Services**: Check `src/services/gameService.ts` for API integration
3. **Add Components**: Create new components in `src/components/`
4. **Write Tests**: Add tests in `__tests__` directories
5. **Read PROGRESS.md**: See detailed setup information and roadmap

---

## Troubleshooting

### Port 8081 Already in Use
```bash
# Kill the process using port 8081
lsof -ti:8081 | xargs kill -9
```

### TypeScript Errors
```bash
# Reinstall dependencies
rm -rf node_modules
yarn install
```

### Test Failures
```bash
# Clear Jest cache
yarn test --clearCache
```

---

## Need Help?

- Check `README.md` for full documentation
- Review `PROGRESS.md` for implementation details
- Check the [Next.js Documentation](https://nextjs.org/docs)

---

**Ready to code? Run `yarn dev` and start building! 🚀**
