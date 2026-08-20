import { useState } from "react";
import { api } from "../api/axios.js";
import RatingStars from "./RatingStars.jsx";
import { useAuth } from "../context/AuthContext.jsx" ;
import { toast } from "react-toastify" ;
import { formatDistanceToNow } from "date-fns" ;
import ReportModal from "./reportModal.jsx" ; 
 
const FIFTEEN_MINUTES = 15 * 60 * 1000;

const CommentSection = ({ ratings, caretakerUserId }) => {
  const { user } = useAuth();

  const [reviews, setReviews] = useState(ratings || []);

  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
   
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  
  const [reportReviewId, setReportReviewId] = useState(null) 

  const isOwner = (review) => {
    return review?.user === user?._id;
  };

  const isCaretakerOwner = user?._id === caretakerUserId;

  const canEdit = (review) => {

    if (!isOwner(review)) return false;

    const age = Date.now() - new Date(review.createdAt).getTime();

    return age <= FIFTEEN_MINUTES;
  };

  const handleEdit = (review) => {
    if (!canEdit(review)) {
      toast.error("This review can no longer be edited.");
      return;
    }

    setEditingId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRating(0);
    setEditComment("");
  };

  const saveEdit = async (reviewId) => {
    if (!editRating) {
      toast.error("Please select a rating.");
      return;
    }

    setBusy(true);

    try {
      const { data } = await api.patch(
        `/review/update/${reviewId}`,
        {
          rating: editRating,
          comment: editComment,
        }
      );

      const updatedReview = data.data.review;

      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                ...updatedReview,
              }
            : review
        )
      );

      setEditingId(null);
      setEditRating(0);
      setEditComment("");

      toast.success("Review updated successfully.");
    } 
    catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Couldn't update the review."
      );
    } 
    finally {
      setBusy(false);
    }
  };

  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) return;

    setDeletingId(reviewId);

    try {
      await api.delete(`/review/delete/${reviewId}`);

      setReviews((prev) =>
        prev.filter((review) => review._id !== reviewId)
      );

      toast.success("Review deleted successfully.");
    } 
    catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Couldn't delete the review."
      );
    } 
    finally {
      setDeletingId(null);
    }
  }; 

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xl">
          What families are saying
        </h3>
      </div>

     {reviews?.length ? (
        <ul className="flex flex-col gap-4">
        
          {/* comment-card --->  */}
          {reviews.map((r) => (
            <li
              key={r._id}
              className="card p-4"
            >
                 
                 {/* name and rating */}
              <div className="mb-1 flex items-center justify-between gap-3">

                 <div className="flex items-center gap-2">

                    <span className="text-sm font-semibold text-ink">
                      {r.reviewer?.name}
                    </span>
                    
                      {/* timeStamp and edited mark --->  */}
                   <span className="text-xs text-muted">
                      {formatDistanceToNow(new Date(r.createdAt), {
                        addSuffix: true,
                      })}
                    
                    {new Date(r.updatedAt).getTime() > new Date(r.createdAt).getTime() && (
                            <>
                            <span className="mx-1 text-sm">•</span>
                            edited
                            </>
                    )}
                   </span>

                </div>

                {editingId !== r._id && (
                  <RatingStars value={r.rating} />
                )}

              </div>
                
                {/* edit and delete option---> */}
             {editingId !== r._id ? (
                <>
                  {r.comment && (
                    <p className="text-sm text-muted">
                      {r.comment}
                    </p>
                  )}
                     
               {/* check the owner of the comments to show their individual edit and delete option --->*/}
                  {isOwner(r) && (
                    <div className="mt-3 flex items-center gap-3">

                      {canEdit(r) && (
                        <button
                          type="button"
                          onClick={() => handleEdit(r)}
                          className="text-xs font-medium text-teal-600 hover:text-teal-700"
                        >
                          Edit
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(r._id)}
                        disabled={deletingId === r._id}
                        className="text-xs font-medium text-rose-500 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === r._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>
                  )}
                      
                {isCaretakerOwner && (
                      <button
                      type="button"
                      onClick={() => setReportReviewId(r._id)}
                      className="
                        rounded-md border border-line
                        px-1 py-1 my-3 
                        text-[11px] text-muted
                        transition
                        hover:border-rose-200
                        hover:bg-rose-50
                        hover:text-rose-500
                      "
                    >
                     
                      <svg
                        viewBox="0 0 20 20"
                        className="h-3.5 w-3"
                        fill="currentColor"
                      >
                        <path d="M10 2a8 8 0 1 0 8 8 8 8 0 0 0-8-8Zm0 11.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm1-2.5H9V5h2v6Z" />
                      </svg>

                      </button>
                    )}

                </>
              ) : (
                /* edit form in the place of orginal review sectio */
                <div className="mt-3 flex flex-col gap-3">

                  <RatingStars
                    value={editRating}
                    onChange={setEditRating}
                    interactive
                  />

                  <textarea
                    className="input min-h-20 text-sm"
                    value={editComment}
                    onChange={(e) =>
                      setEditComment(e.target.value)
                    }
                    maxLength={1000}
                  />

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(r._id)}
                      disabled={busy}
                      className="btn btn-primary text-sm"
                    >
                      {busy ? "Saving..." : "Save"}
                    </button>

                    <button
                      type="button"
                      onClick={cancelEdit}
                      disabled={busy}
                      className="btn btn-ghost text-sm"
                    >
                      Cancel
                    </button>
                  </div>

                </div>
              )}

            </li>

          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">
          No reviews yet — reviews appear here once a booked
          family shares feedback.
        </p>
      )}

          {reportReviewId && (
            <ReportModal
              targetType="review"
              targetId={reportReviewId}
              onClose={() => setReportReviewId(null)}
            />
        )}

    </div>
  );
};

export default CommentSection;