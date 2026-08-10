import { Link } from "react-router-dom";
import RatingStars from "./RatingStars.jsx";

const careTypeLabel = {
  "elderly-care": "Elderly care",
  "baby-care": "Baby care",
  Both: "Elderly & baby care",
};

const CaretakerCard = ({ profile }) => {
  if (!profile) return null;

  const photoUrl = profile.photo?.url || profile.profilePhoto?.url;

  return (
    <Link
      to={`/caretaker/${profile._id}`}
      className="card group relative flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-teal-50">

        {photoUrl ? (
          <img
            src={photoUrl}
            alt={profile.user?.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-4xl text-teal-400">
              {profile.user?.name?.[0]}
            </span>
          </div>
        )}

        <span 
          className={
            profile.isCurrentlyAvailable ? "badge badge-available absolute left-3 top-3 bg-white/90" : "badge badge-unavailable absolute left-3 top-3 bg-white/90" 
          }
        >
          {profile.isCurrentlyAvailable && <span className="pulse-dot" />}
          {profile.isCurrentlyAvailable ? "Available" : "Booked up"}
        </span>

        {typeof profile.distanceKm === "number" && (
          <span className="badge absolute right-3 top-3 bg-white/90 text-teal-600">
            {profile.distanceKm < 1 ? "< 1 km away" : `${profile.distanceKm} km away`}
          </span>
          
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg leading-tight text-ink">
            {profile.user?.name}
          </h3>
          <RatingStars value={profile.ratingAvg} count={profile.ratingCount} />
        </div>

        <p className="text-sm text-muted">
          {profile.careType?.map((c) => careTypeLabel[c] || c).join(" · ")}
        </p>

        <p className="mt-auto flex items-center gap-1 text-sm text-ink/80">
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-teal-500">
            <path d="M10 1c-3.3 0-6 2.7-6 6 0 4.5 6 11 6 11s6-6.5 6-11c0-3.3-2.7-6-6-6zm0 8.3A2.3 2.3 0 1 1 10 4.7a2.3 2.3 0 0 1 0 4.6z" />
          </svg>
          {profile.city}, {profile.pincode}
        </p>
      </div>
    </Link>
  );
};

export default CaretakerCard;
