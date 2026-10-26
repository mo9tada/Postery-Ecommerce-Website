# Postery — Car Poster Store

[![CI](https://github.com/mo9tada/Postery-Ecommerce-Website/actions/workflows/ci.yml/badge.svg)](https://github.com/mo9tada/Postery-Ecommerce-Website/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js_15-000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232a?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)

An e-commerce storefront for **Postery**, a Tunisian brand selling premium car posters. Customers browse the catalogue, manage a cart and check out; the shop owner tracks and updates orders from an admin dashboard.

## Features

- **Catalogue** — product grid and detail pages with brand, category and stock
- **Cart** — persisted in `localStorage`, survives reloads, quantity controls
- **Checkout** — shipping details and payment method selection, order saved to the database
- **Accounts** — sign-up and login with Supabase Auth
- **Admin dashboard** — order list with search, status filter, revenue and order stats, status updates
- **Guided setup** — without Supabase keys the home page shows a setup guide and the admin page falls back to sample orders

## Tech

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 App Router, React 19, TypeScript |
| UI | Tailwind CSS, shadcn/ui (Radix primitives), lucide icons |
| State | React Context + `localStorage` for the cart |
| Backend | Supabase (PostgreSQL + Auth): `products`, `orders`, `order_items` |

## Getting started

```bash
git clone https://github.com/mo9tada/Postery-Ecommerce-Website.git
cd Postery-Ecommerce-Website
npm install
cp .env.example .env.local   # add your Supabase project URL and anon key
npm run dev
```

Open http://localhost:3000.

## Roadmap

- Server-side admin authorisation (role check + Row Level Security) instead of a client-side page
- Online payment integration
- Image optimisation and product search

## Author

Built by **Moktada Zaidi** — [GitHub](https://github.com/mo9tada)
