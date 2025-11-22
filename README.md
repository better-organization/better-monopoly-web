# Better Monopoly Web

A modern, React-based frontend for the Better Monopoly game built with Next.js, TypeScript, and Tailwind CSS.

## 🎮 About

Better Monopoly Web is the frontend interface for a multiplayer Monopoly game. It communicates with a separate backend service running in Docker to provide a complete gaming experience.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn 1.22+
- Docker (for containerized deployment)

### Installation

```bash
# Install dependencies
yarn install

# Copy environment variables
cp .env.example .env.local

# Start development server
yarn dev
```

The application will be available at `http://localhost:8081`

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server on port 8081 |
| `yarn build` | Build for production |
| `yarn start` | Start production server |
| `yarn test` | Run tests |
| `yarn test:watch` | Run tests in watch mode |
| `yarn test:coverage` | Generate test coverage report |
| `yarn lint` | Run ESLint |
| `yarn type-check` | Run TypeScript type checking |

## 🏗️ Project Structure

```
better-monopoly-web/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── __tests__/      # Page tests
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── __tests__/      # Component tests
│   │   └── Button.tsx      # Example component
│   ├── services/           # API services
│   │   ├── api.ts          # HTTP client
│   │   └── gameService.ts  # Game API calls
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   └── utils/              # Utility functions
│       └── helpers.ts
├── public/                 # Static assets
├── .env.example           # Environment variables template
├── .env.local             # Local environment (git-ignored)
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose setup
├── jest.config.ts         # Jest configuration
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── PROGRESS.md            # Development progress tracker
└── README.md              # This file
```

## 🐳 Docker Deployment

### Build and Run

```bash
# Build the image
docker build -t better-monopoly-web .

# Run the container
docker run -p 8081:8081 better-monopoly-web
```

### Using Docker Compose

```bash
# Start the service
docker-compose up -d

# Stop the service
docker-compose down
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Backend API URL (client-side)
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8080

# Backend API URL (server-side)
BACKEND_API_URL=http://localhost:8080

# Node environment
NODE_ENV=development
```

For Docker deployment, adjust the URLs:
```bash
NEXT_PUBLIC_BACKEND_API_URL=http://backend:8080
BACKEND_API_URL=http://backend:8080
```

## 🧪 Testing

The project uses Jest and React Testing Library for testing.

```bash
# Run all tests
yarn test

# Watch mode for development
yarn test:watch

# Generate coverage report
yarn test:coverage
```

Tests are located in `__tests__` directories alongside the code they test.

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Responsive design utilities
- Dark mode support (via `prefers-color-scheme`)
- Custom color variables
- JIT (Just-In-Time) compilation

## 📡 API Integration

The application includes a pre-configured API client (`src/services/api.ts`) with:

- Axios-based HTTP client
- Request/response interceptors
- Authentication token management
- Error handling
- Type-safe methods

Game-specific endpoints are defined in `src/services/gameService.ts`.

## 🔗 Backend Integration

This frontend is designed to work with a separate backend service. By default, it expects the backend to be running on:

- **Development:** `http://localhost:8080`
- **Docker:** `http://backend:8080`

Configure the backend URL via environment variables.

## 🛠️ Tech Stack

- **Framework:** Next.js 14.2.15
- **Language:** TypeScript 5.6.3
- **UI:** React 18.3.1
- **Styling:** Tailwind CSS 3.4.14
- **HTTP Client:** Axios 1.7.7
- **Testing:** Jest 29.7.0 + React Testing Library 16.0.1
- **Linting:** ESLint 8.57.1

## 📝 Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow ESLint rules
- Use functional components with hooks
- Prefer `const` over `let`
- Use meaningful variable and function names

### Testing Best Practices

- Write tests for all components
- Aim for >80% code coverage
- Test user behavior, not implementation details
- Use React Testing Library queries appropriately

### Git Workflow

- Write meaningful commit messages
- Create feature branches for new work
- Use pull requests for code review
- Keep commits atomic and focused

## 🚧 Roadmap

- [ ] Implement game board UI
- [ ] Add WebSocket support for real-time updates
- [ ] Create player management components
- [ ] Build property and transaction interfaces
- [ ] Implement state management (Context/Redux)
- [ ] Add authentication flow
- [ ] Set up E2E testing
- [ ] Configure CI/CD pipeline

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Jest Documentation](https://jestjs.io/)

## 📄 License

This project is part of the Better Monopoly suite.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

---

**Happy coding! 🎲🎮**