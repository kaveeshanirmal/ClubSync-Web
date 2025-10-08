# ClubSync Web Platform

ClubSync is a Next.js web application along with a mobile app designed to streamline club management, event organization, and volunteer tracking for university clubs and organizations.

## 🚀 Recent Updates (July 2025)

### New Pages and Features

#### 1. Club Verification Form
- **Path**: `/club-verify`
- **Tech Stack**: Next.js, TypeScript, Formik, Yup, Tailwind CSS
- **Features**:
  - Comprehensive club registration form with validation
  - Multi-section layout (Club Details, Primary Contact, Documentation, etc.)
  - File upload components for club documentation
  - Status indicators (Pending/Approved/Rejected)
  - Form validation with detailed error messages
  - Responsive design that adapts to all screen sizes

#### 2. Volunteer Profile Page
- **Path**: `/volunteer/profile`
- **Tech Stack**: Next.js, TypeScript, Tailwind CSS
- **Features**:
  - Redesigned profile interface with modern UI
  - Personal information display section
  - Reward points and achievements tracking
  - Certificate management and download options
  - Event history and participation tracking
  - Service letter request functionality

### Design Improvements

- Implemented consistent design patterns following the ClubSync landing page theme
- Used gradient backgrounds (`from-blue-50 via-white to-purple-50`) for page containers
- Added proper spacing with top margin (`pt-24`) to prevent navbar overlap
- Created modern card components with shadows and rounded corners
- Used the ClubSync color palette (orange/red gradient for buttons and accents)
- Ensured responsive layouts for all new pages

### Technical Enhancements

- Added form validation with Yup schemas
- Integrated Formik for form state management
- Created type definitions for data structures
- Implemented proper loading and error states
- Added responsive design using Tailwind's grid system

## 📋 Project Structure

The project follows Next.js App Router conventions:

```
ClubSync-Web/
├── app/                          # Next.js App Router directory
│   ├── admin/                    # Admin pages
│   │   └── verify-clubs/         # Club verification admin interface
│   ├── club-admin/               # Club administrator dashboard
│   ├── club-verify/              # Club verification form
│   ├── volunteer/                # Volunteer section
│   │   └── profile/              # Volunteer profile page
│   └── api/                      # API routes
├── components/                   # Reusable components
├── prisma/                       # Database schema and migrations
└── public/                       # Static assets
```

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
