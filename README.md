# Law Park Educational Trust - Website

A modern, beautiful website showcasing the 10-year journey of Law Park Educational Trust, an NGO dedicated to helping children from rural areas across India get their right to education through funded scholarships.

## Mission

Law Park Educational Trust helps children from rural areas across India get their right to education through funded scholarships.

## What We Offer

- **Funded Scholarships**: Making quality education accessible to rural children
- **Travel & Community Engagement**: Our team travels to meet the kids and build meaningful connections
- **Essential Supplies**: Distribution of school bags, notebooks, pens, stationery, sanitary pads, drawing kits, and more
- **Educational Activities**: Fun educational games, interactive learning sessions, and talent showcases
- **Cultural Awareness**: Programs explaining language origins (like Kannada Varnamala) and cultural heritage
- **Career Counselling**: Guidance for 9th and 10th standard students
- **Library Setup**: Establishing libraries in rural schools with donated books

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Router** - File-based routing
- **Tailwind CSS** - Utility-first CSS framework

## Getting Started

### Prerequisites

- Node.js 20.19.0 or higher (or 22.12.0+)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
law-park-educational-trust/
├── public/
│   └── images/          # Gallery images from the journey
├── src/
│   ├── components/
│   │   ├── layout/     # Header, Footer
│   │   ├── sections/   # Hero, Timeline, Gallery, etc.
│   │   └── ui/         # Reusable UI components
│   ├── data/           # Data files (milestones, activities, stats)
│   ├── routes/         # TanStack Router routes
│   ├── types/          # TypeScript type definitions
│   └── main.tsx        # Application entry point
└── package.json
```

## Features

- **Interactive Timeline**: Explore the 10-year journey with expandable milestones
- **Impact Statistics**: Animated counters showing our reach and impact
- **Activities Showcase**: Comprehensive view of all our programs
- **Image Gallery**: Beautiful gallery with lightbox functionality
- **Responsive Design**: Works seamlessly on all devices
- **Accessibility**: Built with WCAG guidelines in mind
- **Performance**: Optimized for fast loading and smooth interactions

## Key Sections

1. **Hero**: Mission statement and call-to-action
2. **Impact Overview**: Statistics and metrics
3. **Activities**: What we do and how we help
4. **Timeline**: 10-year journey with milestones
5. **Gallery**: Visual moments from our work
6. **Get Involved**: Ways to support our mission

## Development

The project uses:
- **TanStack Router** for file-based routing (routes are in `src/routes/`)
- **Tailwind CSS** for styling (configured in `tailwind.config.js`)
- **TypeScript** for type safety throughout

## License

This project is private and proprietary.

## Contact

For inquiries about the website or the trust, please reach out through the contact information provided on the website.
