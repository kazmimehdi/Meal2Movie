# Meal2Movie

A dinner and a movie matching website that pairs a local restaurant from Yelp with a popular movie from TMDB. Search by city or ZIP code, get a random pairing, and spin again for a new one.

## Getting started

1. Install [Node.js LTS](https://nodejs.org/).
2. Sign up for API access and create keys:
   - [Yelp developer portal](https://www.yelp.com/developers/v3/manage_app) — create an app to get a Yelp Fusion API key.
   - [TMDB API settings](https://www.themoviedb.org/settings/api) — request an API key.
3. Copy `.env.example` to `.env` in this folder and replace the placeholders:

   ```text
   YELP_API_KEY=your_yelp_api_key
   TMDB_API_KEY=your_tmdb_api_key
   PORT=5000
   ```

   Keep `.env` private; it is ignored by Git. The API keys stay on the local server and are never bundled into the React app.

4. Install dependencies and start the frontend and API server:

   On Windows PowerShell, use the `.cmd` launcher (PowerShell may not find `npm`, or may block its `.ps1` launcher):

   ```powershell
   npm.cmd install
   npm.cmd run dev
   ```

   If `npm.cmd` is not found in the terminal, call the installed launcher by its full path:

   ```powershell
   & "E:\Program Files\npm.cmd" install
   & "E:\Program Files\npm.cmd" run dev
   ```

   Restart VS Code after changing your Windows `PATH` for the change to apply to newly opened terminals.

   On macOS, Linux, or shells where `npm` works, run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local address printed by Create React App (usually `http://localhost:3000`).

The app uses `fetch` through its Express API server to request restaurants from Yelp and popular movies from TMDB. In production, build the frontend with `npm run build`, then serve the build and API from the same server with `npm run start:production`.
