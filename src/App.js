import { useState } from 'react';
import './App.css';

function RestaurantCard({ restaurant }) {
  return (
    <article className="result-card restaurant-card">
      <div className="card-image-wrap">
        {restaurant.imageUrl ? (
          <img className="card-image" src={restaurant.imageUrl} alt={restaurant.name} />
        ) : (
          <div className="image-fallback restaurant-fallback" aria-hidden="true">🍜</div>
        )}
        <span className="image-label">TONIGHT'S TABLE</span>
        {restaurant.price && <span className="price-tag">{restaurant.price}</span>}
      </div>
      <div className="card-content">
        <div className="card-eyebrow"><span className="rating-star">★</span> {restaurant.rating} <span className="muted">({restaurant.reviewCount} reviews)</span></div>
        <h3>{restaurant.name}</h3>
        <p className="card-description">{restaurant.categories.join(' · ') || 'Local favorite'}</p>
        <p className="card-location">{restaurant.address.join(', ')}</p>
        <a className="card-link" href={restaurant.url} target="_blank" rel="noreferrer">
          Find it on Yelp <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}

function MovieCard({ movie }) {
  return (
    <article className="result-card movie-card">
      <div className="card-image-wrap">
        {movie.posterUrl ? (
          <img className="card-image" src={movie.posterUrl} alt={`${movie.title} poster`} />
        ) : (
          <div className="image-fallback movie-fallback" aria-hidden="true">🎬</div>
        )}
        <span className="image-label">TONIGHT'S FEATURE</span>
        <span className="rating-tag">★ {movie.rating.toFixed(1)}</span>
      </div>
      <div className="card-content">
        <div className="card-eyebrow">{movie.releaseYear || 'A new favorite'} <span className="muted">· Movie</span></div>
        <h3>{movie.title}</h3>
        <p className="movie-overview">{movie.overview || 'A little mystery makes movie night better.'}</p>
        <a className="card-link" href={movie.url} target="_blank" rel="noreferrer">
          More on TMDB <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}

function App() {
  const [location, setLocation] = useState('');
  const [matchup, setMatchup] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function findMatch(event) {
    event?.preventDefault();
    const searchLocation = location.trim();
    if (!searchLocation || status === 'loading') return;

    setStatus('loading');
    setError('');
    try {
      const response = await fetch(`/api/matchup?location=${encodeURIComponent(searchLocation)}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'We could not find a dinner-and-a-movie match. Try again.');
      }
      setMatchup(data);
      setStatus('success');
    } catch (requestError) {
      setError(requestError.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  return (
    <main className="app-shell">
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="/" aria-label="Meal2Movie home">
          <span className="brand-mark" aria-hidden="true"><span>m</span><span>2</span></span>
          <span>meal<span className="brand-accent">2</span>movie</span>
        </a>
        <span className="topbar-note"><span className="live-dot" /> YOUR NIGHT, SORTED</span>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="sparkle">✳</span> THE PERFECT PAIRING, EVERY TIME</div>
          <h1>Dinner plans.<br /><span>Roll credits.</span></h1>
          <p className="hero-description">One great local spot. One movie worth staying in for. Your next night out starts right here.</p>

          <form className="search-form" onSubmit={findMatch}>
            <label htmlFor="location">WHERE ARE YOU HUNGRY?</label>
            <div className="search-controls">
              <div className="location-input-wrap">
                <span className="pin-icon" aria-hidden="true">⌖</span>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Enter a city or ZIP code"
                  autoComplete="address-level2"
                  required
                />
              </div>
              <button className="submit-button" type="submit" disabled={status === 'loading' || !location.trim()}>
                {status === 'loading' ? <><span className="spinner" /> Finding...</> : <>Find my night <span aria-hidden="true">↗</span></>}
              </button>
            </div>
          </form>
          <div className="hero-footnote"><span aria-hidden="true">✦</span> A fresh pairing, picked just for you</div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="art-glow" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="art-card art-card-food"><span className="art-card-emoji">🍝</span><span>something delicious</span></div>
          <div className="art-plus">+</div>
          <div className="art-card art-card-movie"><span className="movie-reel">◉</span><span>something unforgettable</span></div>
          <div className="art-spark art-spark-one">✳</div>
          <div className="art-spark art-spark-two">✦</div>
          <div className="art-caption">MADE FOR<br />YOUR KIND OF NIGHT</div>
        </div>
      </section>

      <section className="results-section" aria-live="polite">
        <div className="section-heading">
          <div>
            <div className="eyebrow">THE LINEUP</div>
            <h2>{matchup ? 'Your night, paired.' : 'A night worth remembering.'}</h2>
          </div>
          {matchup && (
            <button className="refresh-button" type="button" onClick={findMatch} disabled={status === 'loading'}>
              <span aria-hidden="true">↻</span> Spin again
            </button>
          )}
        </div>

        {error && <div className="error-message" role="alert">{error}</div>}

        {matchup ? (
          <div className="cards-grid">
            <RestaurantCard restaurant={matchup.restaurant} />
            <MovieCard movie={matchup.movie} />
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-symbols"><span>🍽</span><i>+</i><span>🎞</span></div>
            <p>{status === 'loading' ? 'Finding something delicious and something worth watching...' : 'Tell us where you are and we’ll take it from there.'}</p>
          </div>
        )}
      </section>

      <footer className="footer">
        <a className="brand footer-brand" href="/" aria-label="Meal2Movie home">
          <span className="brand-mark" aria-hidden="true"><span>m</span><span>2</span></span>
          <span>meal<span className="brand-accent">2</span>movie</span>
        </a>
        <p>A little dinner. A little cinema. A lot less scrolling.</p>
        <span className="footer-credit">RESTAURANTS VIA YELP · MOVIES VIA TMDB</span>
      </footer>
    </main>
  );
}

export default App;
