# YeaNah-Synthesizer MKII 🎛️

A retro-styled decision support tool that uses rule-based logic to help you make binary (YES/NO) decisions quickly. Built with React, TypeScript, and styled with a nostalgic Windows 95 aesthetic featuring both classic and cyber modes.

![Version](https://img.shields.io/badge/version-1.0-blue)

## What It Does

Paralyzed by choice? The YeaNah-Synthesizer cuts through analysis paralysis using a weighted scoring heuristic. Input your decision constraints, get a binary recommendation in under 2 minutes. Logic-based. Emotion-free.

### Key Features

- **Retro Windows 95 Interface** - Authentic 90s computing experience with CRT effects
- **Dual Mode UI** - Toggle between classic 1995 mode and cyber night mode
- **5-Factor Analysis** - Evaluate decisions across Time, Money, Risk, Energy, and Upside
- **Gut Feeling Integration** - Your intuition is data, not noise
- **Session History** - Track your last 3 decisions
- **Export Results** - Copy decision reports to clipboard
- **Fast Analysis** - Get recommendations in seconds

## The Algorithm

The YeaNah-Synthesizer uses a transparent, weighted scoring system:

```
Benefit Score = (Long-term Upside × 2) + Money + (Gut_Yes ? 2 : 0)
Cost Score    = Time + Energy + Risk + (Gut_No ? 2 : 0)

Recommendation = Benefit Score >= Cost Score ? YES : NO
```

**Why it works:**
- **Double-weighted Upside** - Humans naturally undervalue future gains vs. immediate pain
- **Gut Feeling** - Explicitly calculates your intuition into the final score
- **Transparent Logic** - No black box; you see exactly how the decision was made

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the repository**
   ```powershell
   cd c:\Users\rohit\Downloads\YeaNah-Synthesizer-MKII
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

   This will install:
   - React 19.2.1
   - React DOM 19.2.1
   - TypeScript ~5.8.2
   - Vite 6.2.0
   - Lucide React (icons)
   - Tailwind CSS (via CDN)

### Running the Application

**Development Mode:**
```powershell
npm run dev
```

The app will start at `http://localhost:3000`

**Build for Production:**
```powershell
npm run build
```

**Preview Production Build:**
```powershell
npm run preview
```

## Project Structure

```
YeaNah-Synthesizer-MKII/
├── App.tsx                 # Main application component with routing
├── index.tsx              # React entry point
├── index.html             # HTML template with inline styles
├── types.ts               # TypeScript interfaces and types
├── components/
│   ├── RetroUI.tsx        # Reusable Win95-styled UI components
│   └── CRTOverlay.tsx     # CRT monitor visual effects
├── services/
│   └── decisionLogic.ts   # Core decision algorithm
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite bundler configuration
├── metadata.json          # Project metadata
└── README.md              # This file
```

## How to Use

1. **Start the System** - Click "START SYSTEM" from the home screen
2. **Enter Your Decision** - Type your question (e.g., "Should I change jobs?")
3. **Add Context** - Optional background information
4. **Rate Factors** - Adjust 5 sliders (1=Low, 5=High):
   - **Time** - Effort required
   - **Money** - Financial impact
   - **Risk** - Uncertainty level
   - **Energy** - Stress/burnout potential
   - **Upside** - Long-term value/benefit
5. **Set Initial Inclination** - Choose YES, NO, or Neutral
6. **Run Analysis** - Get your recommendation with detailed reasoning
7. **Review History** - Check your last 3 decisions in the session

## UI Modes

- **Classic Mode (1995)** - Teal background, white panels, blue title bars
- **Cyber Mode (Night)** - Dark theme with neon green terminal aesthetics

Toggle between modes using the sun/moon button.

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling (CDN)
- **Lucide React** - Icon library
- **Custom CSS** - Win95 3D borders, CRT effects, retro cursors

## Decision Output

Each analysis provides:
- **Binary Recommendation** - YES or NO
- **Primary Driver** - Most critical factor
- **Upside Snapshot** - Key benefits
- **Downside Snapshot** - Major risks
- **2nd Order Effect** - What grows if you choose YES
- **Scoring Breakdown** - Transparent benefit vs. cost calculation
- **Reasoning** - Plain English explanation

## Configuration

### Port Configuration
Default port is `3000`. To change, edit `vite.config.ts`:
```typescript
server: {
  port: 3000, // Change this
  host: '0.0.0.0',
}
```

## Troubleshooting

**Issue: Port already in use**
```powershell
# Kill process on port 3000
npx kill-port 3000
```

**Issue: Dependencies not installing**
```powershell
# Clear cache and reinstall
rm -r node_modules
npm cache clean --force
npm install
```

**Issue: TypeScript errors**
```powershell
# Check TypeScript version
npx tsc --version
# Should be ~5.8.2
```

**Made by a dev tired of overthinking simple decisions**
