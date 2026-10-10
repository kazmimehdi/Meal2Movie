require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

async function fetchJson(url, options, serviceName) {
  const response = await fetch(url, options);
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error(`${serviceName} rejected its API key. Check your key in the root .env file.`);
    }
    if (response.status === 429) {
      throw new Error(`${serviceName} rate limit reached. Please wait a little and try again.`);
    }
    throw new Error(`${serviceName} request failed with status ${response.status}. Please try again.`);
  }
  return response.json();
}

app.get('/api/matchup', async (request, response) => {
  const location = typeof request.query.location === 'string' ? request.query.location.trim() : '';
  if (!location) {
    return response.status(400).json({ error: 'Enter a city or ZIP code to find a pairing.' });
  }

  if (!process.env.YELP_API_KEY || !process.env.TMDB_API_KEY) {
    return response.status(503).json({
      error: 'Add your Yelp and TMDB API keys to a root .env file first. See README.md for setup instructions.',
    });
  }

  const yelpUrl = new URL('https://api.yelp.com/v3/businesses/search');
  yelpUrl.search = new URLSearchParams({
    location,
    categories: 'restaurants',
    limit: '50',
    sort_by: 'best_match',
  }).toString();

  const tmdbUrl = new URL('https://api.themoviedb.org/3/movie/popular');
  tmdbUrl.search = new URLSearchParams({
    api_key: process.env.TMDB_API_KEY,
    language: 'en-US',
    page: '1',
  }).toString();

  try {
    const [yelpData, tmdbData] = await Promise.all([
      fetchJson(yelpUrl, {
        headers: { Authorization: `Bearer ${process.env.YELP_API_KEY}` },
      }, 'Yelp'),
      fetchJson(tmdbUrl, {}, 'TMDB'),
    ]);

    if (!yelpData.businesses?.length) {
      return response.status(404).json({ error: `No restaurants found near ${location}. Try a nearby city or ZIP code.` });
    }
    if (!tmdbData.results?.length) {
      return response.status(502).json({ error: 'TMDB did not return any movies. Please try again.' });
    }

    const restaurant = yelpData.businesses[Math.floor(Math.random() * yelpData.businesses.length)];
    const movie = tmdbData.results[Math.floor(Math.random() * tmdbData.results.length)];

    return response.json({
      restaurant: {
        name: restaurant.name,
        imageUrl: restaurant.image_url,
        rating: restaurant.rating,
        reviewCount: restaurant.review_count,
        price: restaurant.price,
        categories: restaurant.categories.map((category) => category.title),
        address: restaurant.location.display_address,
        url: restaurant.url,
      },
      movie: {
        title: movie.title,
        posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w780${movie.poster_path}` : null,
        overview: movie.overview,
        rating: movie.vote_average,
        releaseYear: movie.release_date ? movie.release_date.slice(0, 4) : '',
        url: `https://www.themoviedb.org/movie/${movie.id}`,
      },
    });
  } catch (error) {
    console.error('Unable to generate matchup:', error.message);
    return response.status(502).json({ error: error.message });
  }
});

if (process.env.NODE_ENV === 'production' || process.argv.includes('--production')) {
  const buildPath = path.join(__dirname, 'build');
  app.use(express.static(buildPath));
  app.get(/.*/, (request, response) => {
    response.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Meal2Movie API server listening on http://localhost:${port}`);
});
