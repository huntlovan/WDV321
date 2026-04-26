import { useState } from 'react';

const MovieCard = ({ movie }) => {
  const [rating, setRating] = useState(0);
  const [watched, setWatched] = useState(false);

  return (
    <div className="movie-container">
      <h2>{movie.name}</h2>
      <p>Rating: {rating} ⭐</p>
      <p>Status: {watched ? '✅ Watched' : '🎬 Unwatched'}</p>

      <button onClick={() => setRating(rating + 1)}>Add Star</button>
      <button onClick={() => setRating(rating - 1)}>Remove Star</button>
      <button onClick={() => setRating(0)}>Reset Ratings</button>
      <button onClick={() => setWatched(!watched)}>
        {watched ? 'Mark Unwatched' : 'Mark Watched'}
      </button>
    </div>
  );
};

export default MovieCard;
