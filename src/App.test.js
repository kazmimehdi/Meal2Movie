import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('renders the Meal2Movie search form', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /dinner plans\./i })).toBeInTheDocument();
  expect(screen.getByLabelText(/where are you hungry/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /find my night/i })).toBeDisabled();
});

test('shows a restaurant and movie from the matchup API', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      restaurant: {
        name: 'Little Olive',
        imageUrl: '',
        rating: 4.5,
        reviewCount: 120,
        price: '$$',
        categories: ['Italian'],
        address: ['1 Main St', 'Brooklyn, NY'],
        url: 'https://www.yelp.com/',
      },
      movie: {
        title: 'A Great Movie',
        posterUrl: '',
        overview: 'A lovely movie night.',
        rating: 8.2,
        releaseYear: '2024',
        url: 'https://www.themoviedb.org/',
      },
    }),
  });

  render(<App />);
  fireEvent.change(screen.getByLabelText(/where are you hungry/i), { target: { value: 'Brooklyn, NY' } });
  fireEvent.click(screen.getByRole('button', { name: /find my night/i }));

  expect(await screen.findByRole('heading', { name: 'Little Olive' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'A Great Movie' })).toBeInTheDocument();
  await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/matchup?location=Brooklyn%2C%20NY'));
});
