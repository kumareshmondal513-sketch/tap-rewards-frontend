Tap Rewards — Frontend

Telegram Tap-to-Earn Mini App.

Files

- "index.html" — Main page
- "style.css" — Page design
- "app.js" — Demo tapping logic
- "telegram.js" — Telegram WebApp helper
- "api.js" — Backend API helper
- "config.js" — Frontend configuration
- "package.json" — Frontend dependencies
- "vite.config.js" — Vite configuration
- "manifest.json" — App metadata

Important

The current tapping feature is a demo.

Real coin balances and rewards must be validated by the backend and saved in Firebase. Never trust coin values supplied by the browser.

Deployment

Build the frontend with Vite in an environment where Node.js and npm are available. Deploy the generated "dist" folder to a static web host, then configure the Telegram bot's Mini App URL to use the deployed HTTPS address.