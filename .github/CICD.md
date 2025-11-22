# GitHub Actions CI/CD Documentation

## Overview

This repository includes a comprehensive CI/CD pipeline using GitHub Actions that handles:
- Code quality checks (ESLint, TypeScript)
- Automated testing with coverage reports
- Docker image building and publishing
- Security scanning
- Automated PR labeling
- Deployment workflows

## Workflows

### 1. Main CI/CD Pipeline (`ci-cd.yml`)

**Triggers:** Push to `main` or `develop` branches, Pull Requests

**Jobs:**
- **Quality**: Runs ESLint and TypeScript type checking
- **Test**: Executes test suite with coverage reporting
- **Build**: Builds the Next.js application
- **Docker**: Builds and pushes Docker image to GitHub Container Registry (main/develop only)
- **Security**: Runs Trivy vulnerability scanner
- **Dependency Review**: Reviews dependencies in PRs

### 2. Pull Request Checks (`pr-checks.yml`)

**Triggers:** PR opened, synchronized, or reopened

**Jobs:**
- **PR Info**: Displays PR metadata and size warnings
- **Validate PR**: Runs lint, type check, tests, and build
- **Auto Label**: Automatically labels PRs by size and modified files

### 3. Code Review (`code-review.yml`)

**Triggers:** Pull Request events

**Jobs:**
- **ReviewDog**: Inline ESLint comments on PR
- **Comment Test Results**: Posts test coverage table on PR

### 4. Deployment (`deploy.yml`)

**Triggers:** Manual workflow dispatch or release publication

**Jobs:**
- **Deploy**: Deploys to production or staging environment

### 5. Nightly Tests (`nightly.yml`)

**Triggers:** Daily at 2 AM UTC (cron), Manual trigger

**Jobs:**
- **Full Test Suite**: Runs tests on multiple Node versions (18, 20)
- **Dependency Audit**: Checks for vulnerabilities and outdated packages
- **Notify**: Sends notifications if tests fail

## Setup Instructions

### 1. Enable GitHub Actions

GitHub Actions should be enabled by default. Verify in: **Settings → Actions → General**

### 2. Required Secrets

Add these secrets in **Settings → Secrets and variables → Actions**:

| Secret Name | Description | Required For |
|-------------|-------------|--------------|
| `NEXT_PUBLIC_BACKEND_API_URL` | Backend API URL | Build & Deploy |
| `CODECOV_TOKEN` | Codecov upload token | Coverage reporting (optional) |

### 3. GitHub Container Registry (GHCR)

Docker images are automatically pushed to GHCR. No additional setup needed - uses `GITHUB_TOKEN` automatically.

To pull images:
```bash
docker pull ghcr.io/better-organization/better-monopoly-web:latest
```

### 4. Branch Protection Rules

Recommended settings for `main` branch (**Settings → Branches → Add rule**):

- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
  - Select: `Code Quality`, `Run Tests`, `Build Application`
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ✅ Do not allow bypassing the above settings

### 5. Environments

Create environments for deployment (**Settings → Environments**):

1. **production**
   - Add protection rules (required reviewers)
   - Add environment secrets if different from global

2. **staging** (optional)
   - Less restrictive for testing

## Workflow Details

### Running Workflows Manually

Some workflows can be triggered manually:

1. Go to **Actions** tab
2. Select workflow (e.g., "Deploy to Production")
3. Click **Run workflow**
4. Select options and confirm

### Docker Image Tags

Images are tagged with:
- `latest` - Latest build from main branch
- `main-<sha>` - Specific commit from main
- `develop-<sha>` - Specific commit from develop
- `<branch-name>` - Latest from that branch

### Test Coverage

Coverage reports are:
- Uploaded to Codecov (if token configured)
- Stored as artifacts (7 days retention)
- Commented on PRs

### Security Scanning

Trivy scans for:
- Known vulnerabilities (CVEs)
- Misconfigurations
- Secrets in code

Results are uploaded to **Security → Code scanning alerts**

## Badge Setup

Add these badges to your README:

```markdown
![CI/CD](https://github.com/better-organization/better-monopoly-web/workflows/CI%2FCD%20Pipeline/badge.svg)
![Tests](https://github.com/better-organization/better-monopoly-web/workflows/Pull%20Request%20Checks/badge.svg)
[![codecov](https://codecov.io/gh/better-organization/better-monopoly-web/branch/main/graph/badge.svg)](https://codecov.io/gh/better-organization/better-monopoly-web)
```

## Local Testing

Test workflows locally using [act](https://github.com/nektos/act):

```bash
# Install act
brew install act

# Run CI workflow
act -j quality

# Run specific job
act -j test
```

## Troubleshooting

### Workflow Fails on Dependencies

```bash
# Update lockfile
yarn install
git add yarn.lock
git commit -m "Update yarn.lock"
```

### Docker Build Fails

- Check Dockerfile syntax
- Ensure all dependencies are in package.json
- Verify build context in docker-compose.yml

### Permission Errors

- Ensure `GITHUB_TOKEN` has required permissions
- Check workflow `permissions:` section
- Verify organization/repo settings

## Customization

### Adding New Jobs

Edit `.github/workflows/ci-cd.yml`:

```yaml
new-job:
  name: New Job Name
  runs-on: ubuntu-latest
  needs: [previous-job]  # Optional dependency
  steps:
    - uses: actions/checkout@v4
    - name: Step name
      run: echo "Your command"
```

### Modifying Test Thresholds

Update coverage thresholds in `jest.config.ts`:

```typescript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  }
}
```

### Changing Deploy Target

Edit `.github/workflows/deploy.yml` and add your deployment commands:

```yaml
- name: Deploy to server
  run: |
    # AWS example
    aws s3 sync .next s3://your-bucket
    
    # SSH example
    scp -r .next user@server:/var/www/app
```

## Best Practices

1. **Always run tests locally** before pushing
2. **Keep workflows fast** - parallel jobs when possible
3. **Use caching** - Node modules, Docker layers
4. **Fail fast** - Stop on first error
5. **Monitor costs** - GitHub Actions has usage limits
6. **Review security alerts** regularly
7. **Keep actions up to date** - Dependabot for actions

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

## Support

For issues with CI/CD:
1. Check workflow logs in Actions tab
2. Review this documentation
3. Check GitHub Actions status page
4. Open an issue in the repository
