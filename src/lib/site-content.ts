export const homeFeatures = [
  {
    icon: "📍",
    title: "Show exactly where risk concentrates",
    description:
      "Gemini Vision reads real satellite imagery to pinpoint which neighborhoods, roads, and districts face the highest exposure, not just the city as a whole.",
    href: "/analyze"
  },
  {
    icon: "📢",
    title: "Make the invisible visible",
    description:
      "A color-coded overlay turns abstract risk data into something any official can see and act on, with no GIS expertise or technical background needed.",
    href: "/analyze"
  },
  {
    icon: "⚖️",
    title: "Quantify what’s at stake",
    description:
      "Every analysis surfaces which hospitals, schools, roads, and communities sit in high-risk zones, giving authorities a concrete picture of what they are protecting.",
    href: "/analyze"
  },
  {
    icon: "📋",
    title: "Turn awareness into action",
    description:
      "Mekong Watch does not just flag risk. It generates specific, prioritized recommendations on where to improve drainage, restrict development, and prepare evacuation resources.",
    href: "/analyze"
  },
  {
    icon: "🔁",
    title: "Challenge the “it’s normal” mindset",
    description:
      "Side-by-side regional comparisons show officials how their district stacks up, making it harder to dismiss high scores as just part of life in the delta.",
    href: "/regions"
  },
  {
    icon: "🤖",
    title: "Powered by Gemini Vision AI",
    description:
      "Google Gemini reads satellite imagery like a trained analyst would, then explains its findings in plain language that is ready for planning meetings and briefings.",
    href: "/how"
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
