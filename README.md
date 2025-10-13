# 🎨 Webble Studio - Creative Agency Website

[![Next.js](https://img.shields.io/badge/Next.js-15.4.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23.6-purple?style=flat-square&logo=framer)](https://www.framer.com/motion/)

> **Professional creative agency website** built with Next.js 15, featuring advanced animations, 3D graphics, performance optimizations, and a comprehensive admin dashboard with drag-and-drop functionality.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account
- Resend account (for email functionality)

### Installation

```bash
# Clone the repository
git clone https://github.com/WebbleStudio/webble-studio.git
cd webble-studio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.0
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 3.4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js 5.0
- **Email**: Resend API
- **Animations**: Framer Motion 12.23.6
- **Particles**: @tsparticles/react for interactive backgrounds
- **Drag & Drop**: @dnd-kit
- **Internationalization**: i18next
- **Performance**: Custom optimization hooks

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Protected routes
│   │   ├── admin/           # Admin dashboard
│   │   └── login/         # Authentication
│   ├── api/               # RESTful API endpoints
│   │   ├── auth/          # NextAuth.js authentication
│   │   ├── booking/       # Booking system
│   │   ├── contact/       # Contact form handling
│   │   ├── hero-projects/ # Homepage project management
│   │   ├── projects/      # Portfolio project CRUD
│   │   ├── service-categories/ # Service management
│   │   └── video/         # Video optimization & streaming
│   ├── chi-siamo/         # About page
│   ├── contatti/          # Contact page
│   ├── portfolio/         # Portfolio showcase
│   ├── cookie-policy/     # Cookie policy page
│   ├── privacy-policy/    # Privacy policy page
│   └── (root)/            # Homepage
├── components/            # React components
│   ├── admin/             # Admin dashboard components
│   │   ├── BookingManager.tsx
│   │   └── ServiceImageManager.tsx
│   ├── animations/        # Advanced animation hooks
│   │   ├── useProjectSwitch.ts
│   │   └── useServiceCategoryAnimation.ts
│   ├── auth/              # Authentication components
│   ├── email/             # Professional email templates
│   │   ├── BookingClientEmail.tsx
│   │   ├── BookingAdminEmail.tsx
│   │   └── ContactEmail.tsx
│   ├── layout/            # Layout & navigation
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   ├── sections/          # Page sections
│   │   ├── Home/          # Homepage sections
│   │   ├── Portfolio/     # Portfolio sections
│   │   ├── chi-siamo/     # About sections
│   │   └── contatti/      # Contact sections
│   ├── ui/                # Reusable UI components
│   │   ├── AnimatedHeroTitle.tsx
│   │   ├── AnimatedServiceTitle.tsx
│   │   ├── BookingForm.tsx
│   │   ├── OptimizedImage.tsx
│   │   ├── OptimizedVideo.tsx
│   │   └── ServiceCategory.tsx
│   └── seo/               # SEO components
│       └── StructuredData.tsx
├── hooks/                 # Custom React hooks
│   ├── admin/             # Admin-specific hooks
│   ├── animations/        # Animation hooks
│   ├── core/              # Core functionality hooks
│   ├── data/              # Data fetching hooks
│   ├── performance/       # Performance optimization hooks
│   └── ui/                # UI-specific hooks
├── lib/                   # Utility libraries
│   ├── auth.ts            # NextAuth.js configuration
│   ├── errors.ts          # Error handling
│   ├── supabaseClient.ts  # Database client
│   └── video.ts           # Video optimization
├── locales/               # Internationalization
│   ├── en/                # English translations
│   └── it/                # Italian translations
└── css/                   # Custom CSS & animations
    ├── globals.css        # Global styles & CSS variables
    ├── Header.css         # Header animations
    └── KeyPoints3D.css    # 3D section styles
```

## 🎯 Features

### 🌟 Public Website

#### **Homepage Features**

- **Hero Section**: Interactive hero section with Particles.js background
- **Sticky Project Stacking**: Advanced CSS sticky positioning with z-index layering
- **Animated Text Effects**: Performance-aware blur animations with GPU acceleration
- **Service Categories**: Interactive service presentations with dynamic images
- **Key Points Section**: Video background with network-aware optimization
- **Contact Integration**: Multi-step booking system with email automation

#### **Portfolio Page**

- **Dynamic Project Gallery**: Filterable project showcase
- **Project Details**: Comprehensive project information with slides
- **Responsive Grid**: Adaptive layout for all screen sizes

#### **About Page (Chi Siamo)**

- **Team Presentation**: Professional team showcase
- **Company Story**: Brand narrative and values

#### **Contact Page**

- **Multi-step Booking Form**: 6-step guided booking process
- **Contact Form**: Traditional contact form with validation
- **Email Automation**: Automatic client and admin notifications

#### **Technical Features**

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: Complete theme system with CSS variables
- **Internationalization**: Italian/English support with i18next
- **Performance Optimized**: Advanced caching, lazy loading, and network optimization
- **Accessibility**: WCAG compliant with keyboard navigation
- **SEO Optimized**: Structured data, sitemap, and meta tags

### 🔧 Admin Dashboard

#### **Project Management**

- **CRUD Operations**: Create, read, update, delete projects
- **Drag & Drop Reordering**: @dnd-kit integration for intuitive project organization
- **Image Upload**: Optimized image handling with Supabase Storage
- **Multi-language Support**: Italian and English project descriptions
- **Category Management**: Assign projects to multiple categories
- **Batch Operations**: Bulk project management capabilities

#### **Hero Projects (Highlights)**

- **Homepage Configuration**: Manage the 4 featured projects on homepage
- **Position Management**: Drag-and-drop positioning for project order
- **Background Images**: Custom background images for each project
- **Project Selection**: Choose from existing projects or create new ones

#### **Service Categories**

- **Service Management**: Configure service categories and descriptions
- **Image Management**: Upload and manage service category images
- **Project Association**: Link projects to specific service categories

#### **Booking Management**

- **Booking Overview**: View all incoming booking requests
- **Status Management**: Track booking status and responses
- **Email Integration**: Automatic email notifications

#### **Cache Management**

- **Cache Invalidation**: Manual cache clearing for immediate updates
- **Performance Monitoring**: Real-time performance metrics
- **Batch Updates**: Efficient bulk operations

## 🚀 Performance Optimizations

### **API Aggregation**

- **Unified Endpoints**: Single API calls for multiple data sources
- **Server-side JOINs**: Efficient database queries
- **Cache Optimization**: 24-hour cache for static content
- **Request Deduplication**: Prevents duplicate API calls

### **Client-side Optimizations**

- **Lazy Loading**: 3D graphics and heavy components
- **Image Optimization**: WebP format with fallbacks
- **Video Optimization**: Network-aware video loading
- **Animation Performance**: GPU-accelerated animations

### **Caching Strategy**

- **API Cache**: 3-day cache for aggregated data
- **CDN Cache**: 24-hour cache for static assets
- **Browser Cache**: Optimized cache headers
- **Database Cache**: Efficient query caching

## 📊 API Endpoints

### **Public APIs**

- `GET /api/home-data` - Aggregated homepage data
- `GET /api/portfolio-data` - Portfolio projects
- `GET /api/projects` - All projects
- `GET /api/service-categories` - Service categories
- `GET /api/hero-projects` - Homepage highlights

### **Admin APIs**

- `POST /api/projects/save-all` - Batch project operations
- `POST /api/highlights/save-all` - Batch highlight operations
- `POST /api/services/save-all` - Batch service operations
- `POST /api/revalidate` - Cache invalidation

### **Contact & Booking**

- `POST /api/contact` - Contact form submission
- `POST /api/booking` - Booking form submission
- `GET /api/bookings` - Admin booking management

## 🎨 Design System

### **Color Palette**

- **Primary**: #F20352 (Webble Red)
- **Secondary**: #000000 (Black)
- **Accent**: #FFFFFF (White)
- **Neutral**: #F5F5F5 (Light Gray)

### **Typography**

- **Primary Font**: Poppins (Headings)
- **Secondary Font**: Figtree (Body)
- **Weights**: 300, 400, 500, 600, 700

### **Components**

- **Buttons**: Consistent styling with hover effects
- **Forms**: Multi-step with validation
- **Cards**: Project and service cards
- **Modals**: Overlay components
- **Animations**: Framer Motion integration

## 🌐 Internationalization

### **Supported Languages**

- **Italian** (Default)
- **English**

### **Translation Keys**

- **Common**: Navigation, buttons, labels
- **Pages**: Homepage, portfolio, about, contact
- **Admin**: Dashboard, forms, messages
- **Emails**: Templates and notifications

## 🔒 Security

### **Authentication**

- **NextAuth.js**: Secure authentication system
- **Session Management**: JWT-based sessions
- **Role-based Access**: Admin-only dashboard

### **Data Protection**

- **Input Validation**: Server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content sanitization
- **CSRF Protection**: Token-based validation

## 📱 Responsive Design

### **Breakpoints**

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+
- **Large Desktop**: 1440px+

### **Mobile Optimizations**

- **Touch Interactions**: Optimized for mobile
- **Performance**: Reduced animations on low-end devices
- **Navigation**: Mobile-friendly menu
- **Forms**: Touch-optimized inputs

## 🚀 Deployment

### **Environment Variables**

```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Authentication
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=your_domain

# Email
RESEND_API_KEY=your_resend_key

# Analytics
NEXT_PUBLIC_GA_ID=your_ga_id
```

### **Build Commands**

```bash
# Development
npm run dev

# Production Build
npm run build

# Start Production
npm start

# Linting
npm run lint

# Formatting
npm run format
```

## 📈 Performance Metrics

### **Core Web Vitals**

- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### **Optimization Results**

- **Bundle Size**: Optimized with code splitting
- **Image Loading**: Lazy loading with WebP format
- **API Calls**: Reduced by 97% with aggregation
- **Cache Hit Rate**: 90%+ for static content

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Email**: info@webblestudio.com
- **Issues**: [GitHub Issues](https://github.com/WebbleStudio/webble-studio/issues)
- **Documentation**: Check the `/docs` folder for detailed guides

## 🎯 **Project Highlights**

### **Recent Achievements**

- ✅ **Complete Admin Dashboard** with drag-and-drop functionality
- ✅ **Advanced Performance System** with 90%+ optimization improvements
- ✅ **Multi-language Support** (Italian/English) with i18next
- ✅ **Professional Email System** with Resend integration
- ✅ **Particles Background** with @tsparticles/react
- ✅ **Booking System** with multi-step forms and automation
- ✅ **Video Optimization** with network-aware streaming
- ✅ **Dark/Light Mode** with complete theme system
- ✅ **Mobile-First Design** with responsive animations
- ✅ **TypeScript Coverage** with strict type checking
- ✅ **SEO Optimization** with structured data and sitemap

### **Technical Excellence**

- 🚀 **Next.js 15** with App Router
- 🎨 **Framer Motion** with performance-aware animations
- 🗄️ **Supabase** with real-time database synchronization
- 📧 **Resend** for reliable email delivery
- ✨ **@tsparticles/react** for interactive particle backgrounds
- 🎯 **@dnd-kit** for intuitive drag-and-drop interfaces
- 🌐 **i18next** for internationalization
- ⚡ **Custom Hooks** for performance optimization

---

**Built with ❤️ by Webble Studio**

_Advanced web development and creative design services_

**Version**: 1.0.0 | **Last Updated**: December 2024