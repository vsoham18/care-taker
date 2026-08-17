import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/axios.js"; 
import { useAuth } from "../context/AuthContext.jsx";
import RatingStars from "../components/RatingStars.jsx";
import BookingModal from "../components/BookingModal.jsx";
import CommentSection from "../components/CommentSection.jsx";
import MyBookings from "./Mybookings.jsx";

const careTypeLabel = {
  "elderly-care": "Elderly care",
  "baby-care": "Baby care",
  Both: "Elderly & baby care",
};

const statusCopy = {
  pending: "Request sent — awaiting a call to confirm",
  accepted: "Booking accepted",
};

const CaretakerProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [sentMessage, setSentMessage] = useState("");
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      const { data } = await api.get(`/caretakers/${id}`);
      setProfile(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load this profile.");
    }
  };

  const loadReviews = async () => {
    try {
      const { data } = await api.get(`/review/${id}`);
      setRatings(data.data || []);
    } catch (err) {
      // non-fatal 
    }
  };


  useEffect(() => {
    loadProfile();
    loadReviews(); 
    if (user) {
    loadMyBookings();
  }
  }, [id,user]);
  
  const loadMyBookings = async () => {
  try {
    const { data } = await api.get("/bookings/my-bookings");

    setMyBookings(
      (data.data || []).filter(
        (booking) => String(booking.caretaker) === String(id)
      )
    );
  } catch {
    // non-fatal
  }
};

  const cancelBooking = async (bookingId) => {
    await api.patch(`/bookings/cancel/${bookingId}`);
    loadMyBookings()
  };

  if (error) {
    return <p className="mx-auto max-w-3xl px-5 py-16 text-sm text-rose-500">{error}</p>;
  }

  if (!profile) {
    return <p className="mx-auto max-w-3xl px-5 py-16 text-sm text-muted">Loading profile…</p>;
  }
  
  const activeBooking = myBookings.find((b) => ["pending", "accepted"].includes(b.status));
  const isOwnProfile = user && profile.userDetails?._id === user._id;

  return (  
    <div className="mx-auto max-w-3xl px-5 py-12">
      <div className="card overflow-hidden">
        
        {/*  profile photo section */}
        <div className="aspect-16/7 w-full bg-teal-50">
          <img src={profile.photo?.url} alt={profile.userDetails?.name} className="h-full w-full object-cover" />
        </div>

        <div className="p-6">
          
          {/* profile name and care type section  */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>

              <h1 className="font-display text-3xl">{profile.userDetails?.name}</h1>
              <p className="mt-1 text-sm text-muted">
                {profile.careType?.map((c) => careTypeLabel[c] || c).join(" · ")} ·{" "}
                {profile.experienceYears || 0}+ yrs experience
              </p>
            </div>

            <RatingStars value={profile.ratingAvg} count={profile.ratingCount} />

          </div>
          {profile.about && <p className="mt-4 text-ink/80">{profile.about}</p>}

          <div className="stitch-divider my-6" />
          
        {/* Profile-address availability Section ----> */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="label">Address</p>
              <p className="text-sm text-ink">
                {profile.address}, {profile.city}, {profile.state} - {profile.pincode}
              </p>
            </div>
            <div>
              <p className="label">Availability</p>
              <span className={profile.isCurrentlyAvailable ? "badge badge-available" : "badge badge-unavailable"}>
                {profile.isCurrentlyAvailable ? "Currently available" : "Fully booked"}
              </span>
            </div>
          </div>
          
          {/* request or edit section of caretaker profile */}
          { isOwnProfile ? (
            <Link to="/edit-profile" className="btn btn-secondary mt-6 inline-flex">
              Edit your profile
            </Link>
          ) : user ? ( 
            <div className="mt-6">
              {activeBooking ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="badge bg-honey-100 text-honey-500">
                    {statusCopy[activeBooking.status]}
                  </span>
                  <button onClick={() => cancelBooking(activeBooking._id)} className="btn btn-ghost text-xs">
                    Cancel request
                  </button>
                </div>
              ) : (
                <button className="btn btn-primary" onClick={() => setShowBooking(true)}>
                  Request a booking
                </button>
              ) }

              {sentMessage && <p className="mt-2 text-sm text-teal-600">{sentMessage}</p>}

            </div>
          ) : (<div className="text-sm text-muted">
                 login to request for a booking 
            </div>)}

        </div>

      </div>
       
       {/* comment section loading */}
      <div className="mt-10">
        <CommentSection
          ratings={ratings}
        />
      </div>
     
       {/* Booking model showing----> */}
      {showBooking && (
        <BookingModal
          caretakerId={id}
          onClose={() => setShowBooking(false)}
          onSent={() => {
            setShowBooking(false);
            setSentMessage("Request sent — the caretaker will call you to confirm.");
            loadMyBookings();
          }}
        />
      )}

    </div>
  );
};

export default CaretakerProfile;
