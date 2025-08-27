# Decoration Store - Shopify Integrated E-commerce

A modern, responsive e-commerce website for home decoration items, built with Next.js 14 and integrated with Shopify as the backend content management system.

## Features

### 🛍️ E-commerce Functionality

- **Product Catalog**: Browse products with advanced filtering and search
- **Product Details**: Detailed product pages with image galleries
- **Categories**: Organized product collections (Carpets, Lamps, Mirrors, etc.)
- **Search**: Real-time product search functionality
- **Responsive Design**: Mobile-first design that works on all devices

### 🔗 Shopify Integration

- **Shopify Storefront API**: Public product data access
- **Shopify Admin API**: Private content management
- **Real-time Data**: Live product information from your Shopify store
- **Image Optimization**: Automatic image optimization via Shopify CDN
- **GraphQL**: Efficient data fetching with GraphQL queries

### 🎨 Modern UI/UX

- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality, accessible UI components
- **Dark/Light Mode**: Theme switching capability
- **Smooth Animations**: Framer Motion animations
- **Loading States**: Skeleton loaders and smooth transitions

### 📱 Communication

- **WhatsApp Integration**: Direct customer communication
- **Contact Forms**: Easy customer inquiry system
- **Social Media Links**: Connect with customers across platforms

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Shopify (Storefront & Admin APIs)
- **Data Fetching**: GraphQL with Shopify API clients
- **State Management**: React hooks (useState, useEffect)
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd decoration-store
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Shopify credentials in `.env.local`:

   ```env
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
   SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_token
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Shopify Setup

For detailed Shopify integration setup, see [SHOPIFY_SETUP.md](./SHOPIFY_SETUP.md).

### Quick Shopify Setup

1. Create a Shopify store or use existing one
2. Generate Storefront API access token
3. Generate Admin API access token
4. Add credentials to `.env.local`
5. Add products and collections to your Shopify store

## Project Structure

```
decoration-store/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── products/             # Product API endpoints
│   │   └── collections/          # Collection API endpoints
│   ├── contact/                  # Contact page
│   ├── shop/                     # Shop page
│   └── products/[handle]/        # Dynamic product pages
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── FeaturedProducts.tsx      # Featured products section
│   ├── ShopContent.tsx           # Shop page content
│   └── ...                       # Other components
├── lib/                          # Utility libraries
│   ├── hooks/                    # Custom React hooks
│   ├── shopify.ts                # Shopify client configuration
│   ├── shopify-api.ts            # API service functions
│   └── shopify-queries.ts        # GraphQL queries
└── public/                       # Static assets
```

## Key Components

### Shopify Integration

- `lib/shopify.ts` - Shopify client setup and configuration
- `lib/shopify-api.ts` - API service functions for products/collections
- `lib/shopify-queries.ts` - GraphQL queries for Shopify APIs
- `lib/hooks/useShopify.ts` - React hooks for data fetching

### UI Components

- `components/FeaturedProducts.tsx` - Homepage featured products
- `components/ShopContent.tsx` - Shop page with filtering/search
- `components/Navbar.tsx` - Navigation header
- `components/Footer.tsx` - Site footer

### API Routes

- `/api/products` - Get all products with pagination
- `/api/products/featured` - Get featured products
- `/api/products/[handle]` - Get single product
- `/api/collections` - Get all collections
- `/api/collections/[handle]` - Get collection with products

## Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript compiler

# Package management
pnpm install      # Install dependencies
pnpm add <pkg>    # Add new dependency
```

## Environment Variables

Create a `.env.local` file with these variables:

```env
# Required - Shopify Configuration
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_token

# Optional - API Configuration
NEXT_PUBLIC_SHOPIFY_API_VERSION=2025-01

# Optional - Shopify App Development
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_SCOPES=read_products,read_collections,read_orders
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway
- Render

## Customization

### Adding New Product Types

1. Create collections in Shopify admin
2. Update `components/CategoryGrid.tsx` with new categories
3. Add any specific filtering logic in `components/ShopContent.tsx`

### Styling

- Modify `tailwind.config.ts` for design system changes
- Update `app/globals.css` for global styles
- Customize shadcn/ui components in `components/ui/`

### WhatsApp Integration

- Update WhatsApp number in `lib/whatsapp-config.ts`
- Customize message templates in components

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- Check [SHOPIFY_SETUP.md](./SHOPIFY_SETUP.md) for Shopify-specific issues
- Review [Next.js documentation](https://nextjs.org/docs)
- Check [Shopify API documentation](https://shopify.dev/api)

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Shopify](https://shopify.dev/) - E-commerce platform
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Lucide](https://lucide.dev/) - Icon library
