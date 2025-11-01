# Behzod Musurmonkulov - Portfolio

A professional, accessible, and beautifully designed portfolio website built with Next.js 16, Tailwind CSS, and Framer Motion.

## Features

- **Modern Design**: Clean, sophisticated interface with thoughtful typography and spacing
- **Fully Responsive**: Mobile-first design that works seamlessly across all devices
- **Accessibility First**: WCAG AA compliant with keyboard navigation, screen reader support, and focus management
- **Dark Mode**: Automatic theme switching with manual override and high-contrast mode
- **Smooth Animations**: Tasteful micro-interactions using Framer Motion, respecting reduced-motion preferences
- **Performance Optimized**: Image optimization, efficient rendering, and optimized bundle
- **SEO Ready**: Dynamic meta tags, semantic HTML, and proper heading hierarchy
- **File-Based Routing**: Next.js App Router for clean, maintainable routing

## Pages

- **Home** (`/`): Hero section, featured projects, skills, about teaser, and blog preview
- **Portfolio** (`/portfolio`): Filterable project grid with detailed modal views
- **Gallery** (`/gallery`): Masonry layout with lightbox and keyboard navigation
- **Blog** (`/blog`): Searchable articles with tag filtering and individual post pages
- **About** (`/about`): Full biography, timeline, skills, and downloadable CV
- **Contact** (`/contact`): Validated form with Formspree integration and social links
- **404**: Custom error page with helpful navigation

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 with CSS variables
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to view the site.

### Build

\`\`\`bash
npm run build
\`\`\`

### Production

\`\`\`bash
npm start
\`\`\`

## Customization

### Theme Colors

Edit `app/globals.css` to customize the color palette using CSS variables:

\`\`\`css
:root {
  --primary: oklch(0.205 0 0);
  --accent: oklch(0.97 0 0);
  /* ... other colors ... */
}
\`\`\`

### Content

All content is centralized in `lib/data.ts`:

- **Projects**: Update the `projects` array
- **Blog Posts**: Update the `blogPosts` array
- **Gallery Images**: Update the `galleryImages` array
- **Skills**: Update the `skills` object
- **Timeline**: Update the `timeline` array

### Contact Form

The contact form is ready to be integrated with Formspree or your preferred email service. Update the form submission handler in `app/contact/page.tsx`.

## Accessibility Features

- Semantic HTML landmarks
- ARIA labels and roles
- Keyboard navigation support (arrow keys in gallery, Escape to close modals)
- Focus visible indicators
- Skip to content link
- Screen reader announcements
- Color contrast AA+ compliance
- Reduced motion support

## Performance

- Optimized images with blur-up placeholders
- Efficient component rendering
- GPU-accelerated animations
- Responsive image sizing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Project Structure

\`\`\`
app/
├── layout.tsx              # Root layout with theme provider
├── globals.css             # Global styles and theme variables
├── page.tsx                # Home page
├── portfolio/
│   └── page.tsx            # Portfolio page
├── gallery/
│   └── page.tsx            # Gallery page
├── blog/
│   ├── page.tsx            # Blog listing
│   └── [slug]/
│       └── page.tsx        # Individual blog post
├── about/
│   └── page.tsx            # About page
├── contact/
│   └── page.tsx            # Contact page
└── not-found.tsx           # 404 page

components/
├── layout/
│   ├── header.tsx          # Navigation header
│   └── footer.tsx          # Footer
├── providers/
│   └── theme-provider.tsx  # Theme context and provider
└── ui/
    ├── animated-section.tsx
    ├── image-with-placeholder.tsx
    ├── skip-to-content.tsx
    ├── button.tsx
    ├── card.tsx
    └── badge.tsx

lib/
├── utils.ts                # Utility functions (cn)
└── data.ts                 # All content data

public/
└── [images]                # Static assets
\`\`\`

## License

MIT License - feel free to use this template for your own portfolio!

## Contact

Behzod Musurmonkulov
- Email: behzodmusurmonqulov@gmail.com
- GitHub: [@behzod](https://github.com/behzodk)
- LinkedIn: [/in/behzod](https://linkedin.com/in/behzodmusurmonqulov)
