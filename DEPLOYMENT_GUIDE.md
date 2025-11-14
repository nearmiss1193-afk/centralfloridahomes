# Central Florida Homes - Vercel Deployment Guide

## Overview
This guide will help you deploy the Central Florida Homes website to Vercel with your custom domain `centralfloridashomes.com`.

## Prerequisites
- GitHub account (free)
- Vercel account (free)
- Domain: centralfloridashomes.com (already registered)
- API Keys:
  - RapidAPI Key (for Realtor.com data)
  - GoHighLevel API Key
  - Stripe Secret Key
  - JWT Secret (can generate any random string)

## Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Central Florida Homes website"

# Create a new repository on GitHub (https://github.com/new)
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/centralfloridahomes.git
git branch -M main
git push -u origin main
```

## Step 2: Create Vercel Project

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select "Other" as the framework
4. Keep these settings:
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

## Step 3: Add Environment Variables

In Vercel dashboard, go to **Settings → Environment Variables** and add:

```
DATABASE_URL=your_mysql_connection_string
RAPIDAPI_KEY=your_rapidapi_key
GOHIGHLEVEL_API_KEY=your_ghl_api_key
GOHIGHLEVEL_LOCATION_ID=your_ghl_location_id
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
JWT_SECRET=generate_any_random_string_here
NODE_ENV=production
```

## Step 4: Connect Custom Domain

1. In Vercel dashboard, go to **Settings → Domains**
2. Click "Add Domain"
3. Enter: `centralfloridashomes.com`
4. Vercel will show you DNS records to add
5. Go to your domain registrar (Squarespace or wherever it's registered)
6. Add the DNS records Vercel provides

## Step 5: Deploy

Once DNS is configured (can take 24-48 hours):
1. Vercel automatically deploys on every push to main
2. Your site will be live at https://centralfloridashomes.com

## Project Structure

```
centralfloridahomes/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── lib/trpc.ts    # tRPC client
│   │   └── main.tsx       # React entry point
│   └── index.html         # HTML template
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routers.ts        # tRPC procedures
│   ├── db.ts             # Database helpers
│   └── integrations/     # API integrations
├── drizzle/              # Database schema
├── dist/                 # Production build (generated)
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies
```

## Key Features Implemented

✅ **Property Listings** - Real data from Realtor.com API
✅ **Lead Capture** - Integrated with GoHighLevel CRM
✅ **Agent Subscriptions** - Stripe payment processing
✅ **Responsive Design** - Mobile-friendly UI
✅ **Type-Safe API** - tRPC with TypeScript
✅ **Database** - MySQL with Drizzle ORM

## API Endpoints

- `GET /api/trpc/properties.list` - Get properties
- `POST /api/trpc/leads.submit` - Submit lead
- `POST /api/trpc/subscriptions.create` - Create subscription

## Troubleshooting

### Build fails
- Check that all dependencies are installed: `pnpm install`
- Ensure TypeScript compiles: `pnpm type-check`

### Environment variables not working
- Make sure they're added in Vercel Settings (not in .env file)
- Redeploy after adding variables

### Domain not resolving
- DNS changes can take 24-48 hours
- Check Vercel's DNS configuration is correct
- Verify records in your domain registrar

### Database connection issues
- Ensure DATABASE_URL is correct
- Check MySQL server is accessible from Vercel
- Verify firewall allows Vercel IPs

## Local Development

```bash
# Install dependencies
pnpm install

# Start dev servers (frontend + backend)
pnpm dev

# Frontend: http://localhost:5173
# Backend: http://localhost:3001

# Build for production
pnpm build

# Start production server
pnpm start
```

## Support

For issues with:
- **Vercel deployment**: https://vercel.com/docs
- **GitHub**: https://github.com
- **Realtor.com API**: https://rapidapi.com/apidojo/api/realtor-com-real-estate
- **GoHighLevel**: https://gohighlevel.com/api
- **Stripe**: https://stripe.com/docs

## Next Steps

1. Push code to GitHub
2. Create Vercel project
3. Add environment variables
4. Connect custom domain
5. Deploy!

Your site will be live at https://centralfloridashomes.com 🚀
