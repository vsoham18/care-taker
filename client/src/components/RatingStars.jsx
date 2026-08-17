const STAR_PATH =
  "M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7z";


const Star = ({ type, id }) => {
  // Empty star
  if (type === "empty") {
    return (
      <svg
        viewBox="0 0 20 20"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path
          d={STAR_PATH}
          className="fill-line"
        />
      </svg>
    );
  }

  // Full star
  if (type === "full") {
    return (
      <svg
        viewBox="0 0 20 20"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path
          d={STAR_PATH}
          className="fill-honey-400"
        />
      </svg>
    );
  }

  // Half star
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={id}>
          <rect
            x="0"
            y="0"
            width="10"
            height="20"
          />
        </clipPath>
      </defs>

      {/* Empty star background */}
      <path
        d={STAR_PATH}
        className="fill-line"
      />

      {/* Left half filled */}
      <path
        d={STAR_PATH}
        className="fill-honey-400"
        clipPath={`url(#${id})`}
      />
    </svg>
  );
};


const RatingStars = ({ value = 0, onChange, interactive = false, count}) => {
  const rating = Math.max(
    0,
    Math.min(5, Number(value) || 0)
  );

  const getStarType = (starNumber) => {
    const difference = rating - starNumber;

    if (difference >= 0) {
      return "full";
    }

    if (difference >= -0.7) {
      return "half";
    }

    return "empty";
  };


  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const type = getStarType(n);

        if (interactive) {
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange?.(n)}
              className="cursor-pointer"
              aria-label={`Rate ${n} out of 5`}
            >
              <Star
                type={type}
                id={`half-star-${n}`}
              />
            </button>
          );
        }

        return (
          <Star
            key={n}
            type={type}
            id={`half-star-${n}`}
          />
        );
      })}

      {typeof count === "number" && (
        <span className="ml-1 text-xs text-muted">
          {rating > 0 ? rating.toFixed(1) : "New"}
          {count > 0 && ` (${count})`}
        </span>
      )}
      
    </div>
  );
};


export default RatingStars;