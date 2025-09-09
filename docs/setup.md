# Setup Guide

## Prerequisites
- Node.js (version 18 or higher)
- npm or Bun (for package management)
- A Supabase account for backend services
- Google Gemini API key (for AI features)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/HVVSATHWIK/AstraVerse.git
   cd AstraVerse
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`.
   - Add your Supabase URL, API key, and Gemini API key.

4. Run the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open your browser to `http://localhost:5173` to access AstraAI.

## Configuration
- Configure integrations in the [DeveloperPanel.tsx](src/components/DeveloperPanel.tsx) component.
- Set up AI playground settings in [GeminiPlayground.tsx](src/components/GeminiPlayground.tsx).
- Customize tutorials and steps in [tutorialSteps.ts](src/config/tutorialSteps.ts).

## Usage
1. **Onboarding**: Start with the Quick Start Guide in the dashboard to connect your first app and create a workflow.
2. **Building Workflows**: Use the visual builder to design workflows, incorporating AI steps and integrations.
3. **Monitoring**: Check the Overview tab for KPIs, system health, and live operations.
4. **Experimenting**: Use Pilot Mode to test new features and provide feedback.
5. **Analytics**: Review performance data in the Analytics section to optimize your setup.

For detailed tutorials, refer to the in-app tutorial system or check [TutorialOverlay.tsx](src/components/tutorial/TutorialOverlay.tsx).
