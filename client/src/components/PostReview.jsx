import { useEffect, useState } from "react";
import { api } from "../api/axios.js"; 
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, useParams } from "react-router-dom";
import RatingStars from "./RatingStars.jsx";
import { toast } from "react-toastify";

const PostReview = ({}) => {
   const navigate = useNavigate();
   const { bookingId } = useParams()
   const { user } = useAuth();
   const [error, setError] = useState("");
   const [ busy, setBusy ] = useState(false);
   const [ comment, setComment ] = useState("")
   const [ rating, setRating] = useState(0)
     
const submit = async (e) =>{
     e.preventDefault();

    if (!rating) {
      setError("Please select a rating.");
      return;
    }
    setBusy(true);
    setError("");

    try {     
      await api.post(`/review/create/${bookingId}`, 
        { 
        rating, 
        comment: comment.trim() 
        });
        
      toast.success("Review posted successfully!");

       navigate("/my-bookings");
    } 
    catch (err) {
      toast.error(
       err.response?.data?.message ||
          "Couldn't post your review."
       );
    }
     finally {
      setBusy(false);
    }
}

  return (
    <div>

    {  
        <form onSubmit={submit} className="card mb-6 flex flex-col gap-3 p-4">

          <p className="text-sm font-medium text-teal-600">
            Your service is complete — let others know how it went.
          </p>

          <RatingStars 
            value={rating} 
            interactive 
            onChange={setRating} 
          />

          <textarea
            className="input min-h-20"
            placeholder="Share how the care went…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {error && <p className="text-sm text-rose-500">{error}</p>}
          <button type="submit" disabled={busy} className="btn btn-primary w-fit">
            {busy ? "Posting…" : "Post review"}
          </button>

        </form>
    }

    </div>
  )
}

export default PostReview

      