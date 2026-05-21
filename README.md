# 🏟️ SportNest

A premium, next-generation sports venue booking and management platform designed to connect sports enthusiasts with premium venue owners. SportNest makes listing, editing, exploring, and booking sports facilities (football turfs, cricket grounds, badminton courts, etc.) beautiful, smooth, and effortless.

---

## 🚀 Live URL
Experience the live application here: **[https://sportnest-client-one.vercel.app/](https://sportnest-client-one.vercel.app/)**

---

## 🎯 Purpose
The main purpose of **SportNest** is to eliminate the friction in finding and renting sports venues. It offers a dual-experience panel:
- **For Players**: Easily browse available local venues, filter by sport categories, view open slots, and instantly secure bookings.
- **For Venue Owners**: Seamlessly list new facilities with real-time interactive previews and efficiently manage existing venues using an advanced, high-performance table dashboard.

---

## ✨ Features

- **📺 Premium Visual Aesthetics**: Built with high-end glassmorphism, harmonious HSL color palettes, modern typography (Outfit/Inter), and smooth micro-animations.
- **⚡ Interactive Add Facility Wizard**: A two-column interface featuring:
  - Visual drag-and-drop image upload zone.
  - Live Preview Card that updates instantly as you type.
  - Tactile available time slot badge selection.
- **📊 Advanced Management Panel**: A professional, responsive glassmorphic table layout replacing standard card lists:
  - Clear columns for Venue Details, Location, Capacity, and Hourly Rates.
  - Inline responsive Edit and Delete action controls.
- **🔧 Premium Edit Modal**: In-place edit popup complete with image URL adjustments and a real-time image preview container.
- **🔐 Google OAuth Integration**: Secure single sign-on with automatic persistent session recovery on browser refresh.
- **🌓 Responsive Theme Toggle**: Seamless transition between sleek dark mode and polished light mode layouts.

---

## 📦 NPM Packages Used

### Core Stack
- **`next`** (`v16.2.6`) - Modern React framework supporting SSR and App Router conventions.
- **`react`** & **`react-dom`** (`v19.2.4`) - High-performance UI rendering core.

### Authentication & State
- **`@react-oauth/google`** (`v0.13.5`) - Seamless integration for Google Sign-In and profile retrieval.

### Aesthetics & Polish
- **`framer-motion`** (`v12.40.0`) - Powering fluid layouts, modal animations, and dynamic transitions.
- **`tailwindcss`** & **`@tailwindcss/postcss`** (`v4.0.0`) - Utility-first styling framework driving the premium theme.
- **`lucide-react`** (`v1.16.0`) - Premium icon pack integrated across forms, tables, and buttons.
- **`next-themes`** (`v0.4.6`) - Driving dark/light theme switching with zero layout shift.
- **`react-hot-toast`** (`v2.6.0`) - Interactive, elegant non-blocking system notification alerts.

---

## 🛠️ Getting Started

To run the client project locally:

1. **Clone the repository** and navigate to the project directory:
   ```bash
   cd sportnest-client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.
