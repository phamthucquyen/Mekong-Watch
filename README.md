# Mekong Watch - HackDuke Code for Good 2026 Submission

Mekong Watch is a web application that helps local authorities and communities in Vietnam's Mekong Delta visualize and understand flood vulnerability using satellite imagery and AI analysis. It transforms abstract flood risk data into clear, visual evidence that officials can act on.

---

## The Problem

Local authorities in Vietnam's Mekong Delta know floods are coming — but they systematically underestimate severity and lack the visual evidence needed to justify resource allocation. Mekong Watch closes that gap by delivering precise, location-specific flood risk assessments with satellite-backed analysis.

---

## Features

### 🛰️ Satellite-Based Risk Analysis
- Search any location in Vietnam and receive an instant risk assessment
- Real-time Google Static Maps satellite imagery fetch
- AI-powered visual analysis of land composition and water proximity

### 🤖 AI-Powered Analysis (Gemini Vision)
- Multimodal image understanding (satellite image + location context)
- Detects built/impervious surfaces, water bodies, vegetation cover, and high-exposure zones
- Structured JSON responses with confidence scoring

### 🗺️ Interactive Risk Visualization
- Color-coded overlays on satellite imagery:
  - 🔵 Water zones
  - 🟢 Vegetation coverage
  - 🟠 Built-up areas
  - 🔴 High-exposure zones
- Toggle overlay layers for exploration

### 📊 At-Risk Asset Identification
- Pinpoints hospitals, schools, roads, and communities within flood zones
- Prioritized recommendations (Urgent / High / Monitor)

### 📍 Pre-Analyzed Regional Benchmarks
- 6 key flood-prone locations pre-loaded: Can Tho, Hoi An, Long Xuyen, My Tho, Vung Tau, Da Lat
- Comparative risk scores across regions

---

## Tech Stack

**Frontend**
- Next.js 16 + React 19
- TypeScript
- Tailwind CSS 4

**Backend**
- Next.js API Routes (serverless)
- Google Gemini Vision — satellite image analysis
- Google Maps API — geocoding and static satellite imagery

**Deployment**
- Vercel

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  
│   ├── analyze/page.tsx          
│   ├── regions/page.tsx          
│   ├── about/page.tsx            
│   └── api/
│       ├── analyze/               
│       ├── satellite/             
│       ├── geocode/               
│       └── places/              
├── components/
│   ├── analyze-dashboard.tsx     
│   ├── analysis-preview.tsx       
│   ├── live-satellite-map.tsx   
│   └── location-autocomplete-form.tsx
└── lib/
    ├── analysis.ts               
    ├── gemini.ts                 
    ├── google-maps.ts             
    └── types.ts                   
```

---

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd Mekong-Watch
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set environment variables

Create a `.env.local` file:

```env
GOOGLE_MAPS_API_KEY=your_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
GEMINI_API_KEY=your_key
APP_BASE_URL=http://localhost:3000
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## How It Works

1. **Search** — Enter a city, district, or address in Vietnam
2. **Fetch** — Satellite image is pulled from Google Maps
3. **Analyze** — Gemini Vision scans the image for land composition and water risk
4. **Visualize** — Risk overlays, asset pins, and recommendations appear on the dashboard
5. **Act** — Authorities receive prioritized, evidence-backed action steps

---

## Demo

[https://mekong-watch.vercel.app/](https://mekong-watch.vercel.app/)
