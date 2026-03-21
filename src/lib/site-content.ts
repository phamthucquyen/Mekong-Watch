export const homeFeatures = [
  {
    icon: "🛰",
    title: "Satellite analysis",
    description:
      "Gemini Vision reads real aerial imagery and classifies land cover into water, vegetation, built-up, and risk zones.",
    href: "/analyze"
  },
  {
    icon: "🎨",
    title: "Visual overlay",
    description:
      "A color-coded overlay maps flood vulnerability onto the actual terrain so the results stay intuitive and judge-friendly.",
    href: "/analyze"
  },
  {
    icon: "📊",
    title: "Vulnerability score",
    description:
      "Each location gets a plain-language score: Low, Medium, High, or Critical, with the reasoning explained.",
    href: "/analyze"
  },
  {
    icon: "🏥",
    title: "Asset exposure",
    description:
      "Hospitals, schools, roads, and communities near risk zones are surfaced and prioritized for planning.",
    href: "/analyze"
  },
  {
    icon: "🤖",
    title: "Gemini-powered insight",
    description:
      "AI generates plain-language explanations and tailored recommendations for planners, responders, and local authorities.",
    href: "/how"
  },
  {
    icon: "🗺",
    title: "Regional comparison",
    description:
      "Browse pre-analyzed Vietnamese locations side-by-side to understand relative flood vulnerability across regions.",
    href: "/regions"
  }
];

export const regions = [
  {
    name: "Can Tho",
    location: "Mekong Delta · Urban core",
    score: 8.5,
    tier: "Critical",
    facts: ["Dense riverfront development", "Land subsidence: -2.3cm/yr", "28% water coverage detected"]
  },
  {
    name: "Hoi An",
    location: "Quang Nam · Coastal heritage",
    score: 7.1,
    tier: "High",
    facts: ["Thu Bon River proximity", "Historic low-lying old town", "Limited drainage infrastructure"]
  },
  {
    name: "Long Xuyen",
    location: "An Giang · Delta province",
    score: 6.8,
    tier: "High",
    facts: ["Mekong floodplain exposure", "Seasonal inundation history", "Agricultural land at risk"]
  },
  {
    name: "My Tho",
    location: "Tien Giang · River town",
    score: 5.4,
    tier: "Medium",
    facts: ["Tien River flood buffer exists", "Moderate built-up density", "Some vegetation cover remaining"]
  },
  {
    name: "Vung Tau",
    location: "Ba Ria-Vung Tau · Coastal",
    score: 4.9,
    tier: "Medium",
    facts: ["Coastal surge risk present", "Elevated terrain provides buffer", "Storm drainage largely adequate"]
  },
  {
    name: "Da Lat",
    location: "Lam Dong · Highland city",
    score: 2.1,
    tier: "Low",
    facts: ["1,500m elevation, minimal flood risk", "High forest coverage (62%)", "Natural drainage via terrain"]
  }
];

export const howSteps = [
  {
    title: "Location search",
    description:
      "User types a city, district, or address in Vietnam. The frontend calls the geocoding flow to resolve it into a coordinate pair.",
    code: [
      '// GET /api/geocode?q=Can+Tho',
      'const { lat, lng } = await geocode("Can Tho");',
      '// -> { lat: 10.0452, lng: 105.7469 }'
    ]
  },
  {
    title: "Satellite tile fetch",
    description:
      "The backend fetches a high-resolution satellite tile centered on those coordinates and prepares it for Gemini analysis.",
    code: [
      "// GET /api/tile?lat=10.0452&lng=105.7469",
      "const imageBase64 = await fetchTile(lat, lng, 14);",
      "// Returns base64-encoded satellite image"
    ]
  },
  {
    title: "Gemini Vision analysis",
    description:
      "The satellite image is sent to Gemini with a structured flood analysis prompt. Gemini returns JSON with score, explanation, and recommendation fields.",
    code: [
      "// POST /api/analyze",
      "const result = await gemini.generateContent({",
      "  contents: [{ image: imageBase64, text: prompt }]",
      "});"
    ]
  },
  {
    title: "Overlay rendering",
    description:
      "The frontend renders a color-coded overlay on top of the satellite tile: blue for water, green for vegetation, gray for built-up, and amber for risk zones.",
    code: [
      "// Canvas overlay from JSON percentages",
      "drawZone(canvas, '#2d8fdd', waterPct);",
      "drawZone(canvas, '#3bba6a', vegPct);",
      "drawZone(canvas, '#7a8a9a', builtPct);"
    ]
  },
  {
    title: "Report display",
    description:
      "The UI presents the flood score, plain-language explanation, exposed assets, and recommended actions alongside the visual map.",
    code: [
      "// React state drives the report panels",
      "setFloodData({ score, tier, explanation,",
      "  riskFactors, assets, recommendations });"
    ]
  }
];

export const techItems = [
  {
    name: "Gemini API",
    description: "Core AI engine for flood-analysis prompts, structured JSON output, and plain-language insight.",
    color: "#60b4f8",
    prize: true
  },
  {
    name: "Next.js App Router",
    description: "Website shell, route-based navigation, and server API endpoints in one repo.",
    color: "#61dafb"
  },
  {
    name: "Tailwind CSS",
    description: "Utility-first styling support for rapid UI iteration while matching the mockup direction.",
    color: "#38bdf8"
  },
  {
    name: "Next API Routes",
    description: "Secure backend endpoints for geocoding, tile fetches, and Gemini requests.",
    color: "#68a063"
  },
  {
    name: "Google Maps APIs",
    description: "Geocoding and imagery services for location search and satellite tiles.",
    color: "#4285f4"
  },
  {
    name: "Canvas Overlay",
    description: "Interactive split-view rendering for satellite imagery and flood-risk highlights.",
    color: "#e8a020"
  }
];
