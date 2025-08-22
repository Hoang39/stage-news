# CMS News

A modern news content management system built with Next.js 15, React 19, and TypeScript.

## Features

- 🚀 Built with Next.js 15 and React 19
- 📝 Rich text editor with TipTap
- 🌐 Internationalization support with next-intl
- 🔐 Authentication with JWT
- 📊 Database integration with Prisma
- 🎨 Modern UI with Ant Design
- 📱 Responsive design
- 🎭 Animations with GSAP and AOS
- 📦 Image handling and optimization
- 📝 Form handling with React Hook Form and Zod validation
- 📅 Date handling with Day.js
- 📊 Logging with Winston
- 🔄 Environment configuration with dotenv-cli

## Tech Stack

- **Framework:** Next.js 15.1.3
- **Language:** TypeScript
- **UI Library:** React 19
- **UI Components:** Ant Design
- **Database ORM:** Prisma
- **Rich Text Editor:** TipTap
- **Form Handling:** React Hook Form + Zod
- **State Management:** React Query
- **Authentication:** JWT
- **Internationalization:** next-intl
- **Animations:** GSAP, AOS
- **Date Handling:** Day.js
- **Logging:** Winston
- **Styling:** CSS Modules
- **Code Quality:** ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd cms-news
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

- Copy `.env` to `.env.local` for local development
- Copy `.env.production` to `.env.local` for production build
- Copy `.env.clever` to `.env.local` for Clever deployment
- Update the environment variables with your configuration

4. Run database migrations:

```bash
npx prisma generate
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

This will:

1. Copy `.env` to `.env.local`
2. Generate Prisma client
3. Start the development server with Turbopack

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
# For local build
npm run build:local

# For production
npm run build

# For Clever deployment
npm run build:clever
```

Each build command will:

1. Copy the appropriate environment file to `.env.local`
2. Build the application with the correct environment variables

### Starting Production Server

```bash
npm run start
```

## Available Scripts

- `npm run use` - Use dotenv with .env.local file
- `npm run dev` - Start development server with environment setup and Prisma generation
- `npm run build:local` - Build for local environment
- `npm run build` - Build for production environment
- `npm run build:clever` - Build for Clever deployment
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Check code formatting
- `npm run format:fix` - Fix code formatting issues
- `npm run lint-staged` - Run lint-staged for pre-commit hooks

## Code Quality

This project uses:

- ESLint for code linting
- Prettier for code formatting with import sorting
- TypeScript for type safety
- Pre-commit hooks with lint-staged
- Import sorting with @trivago/prettier-plugin-sort-imports

## License

This project is private and proprietary.

## Support

For support, please contact the development team.
