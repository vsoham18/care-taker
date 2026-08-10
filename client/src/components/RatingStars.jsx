const Star = ({ filled }) => (
  <svg
    viewBox="0 0 20 20"
    className={`h-4 w-4 ${filled ? "fill-honey-400" : "fill-line"}`}
  >
    <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
  </svg>
);
      
// interactive={true} lets a user click to pick a value (used in the review form)
const RatingStars = ({ value = 0, onChange, interactive = false, count }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <Star filled={n <= Math.round(value)} />
        </button>
      ))}
      {typeof count === "number" && (
        <span className="ml-1 text-xs text-muted">
          {value ? value.toFixed(1) : "New"} {count > 0 && `(${count})`}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
