import { useState } from "react";
import { api } from "../api/axios.js";
import RatingStars from "./RatingStars.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const CommentSection = ({ ratings }) => {
  const { user } = useAuth() ;
  const [rating, setRating] = useState(5);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xl">What families are saying</h3>
      </div>


   {/* Display the reviews-----> */}
      {ratings?.length ? (
        <ul className="flex flex-col gap-4">

          {ratings.map((r) => (
            <li key={r._id} className="card p-4">

              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">{r.reviewer?.name}</span>
                <RatingStars value={r.rating} />
              </div>

              {r.comment && <p className="text-sm text-muted">{r.comment}</p>}

            </li>
          ))}

        </ul>
      ) : (
        <p className="text-sm text-muted">
          No reviews yet — reviews appear here once a booked family shares
          feedback.
        </p>
      )}
    </div>
  );
};

export default CommentSection;
