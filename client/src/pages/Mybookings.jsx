import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/axios";

const statusStyle = {
  pending: "bg-honey-100 text-honey-500",
  accepted: "bg-teal-50 text-teal-600",
  completed: "bg-teal-100 text-teal-700",
  rejected: "bg-rose-100 text-rose-500",
  cancelled: "bg-line/60 text-muted",
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api
      .get("/bookings/my-bookings")
      .then(({ data }) => setBookings(data.data || []))
      .catch(() => setError("Couldn't reach the server. Make sure the Aya API is running."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const cancel = async (id) => {
    await api.patch(`/bookings/cancel/${id}`);
    load();
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-3xl">My bookings</h1>

      {loading ? (
        <p className="mt-6 text-sm text-muted">Loading…</p>
      ) : error ? (
        <p className="mt-6 text-sm text-rose-500">{error}</p>
      ) : bookings.length === 0 ? (
        <p className="mt-6 text-sm text-muted">
          No requests yet. Browse caretakers and send a request when you find
          the right fit.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {bookings.map((b) => (
             
            <li key={b._id} className="card flex items-center gap-4 p-4">
              <div className="flex-1">
                <Link to={`/caretaker/${b.caretaker}`} className="font-semibold text-ink">
                  {b.careTakerName?.userDetails?.name}
                </Link>

                <p className="text-xs text-muted">
                  {formatDate(b.servicePeriod?.from)} – {formatDate(b.servicePeriod?.to)}
                </p>

              </div>

              <span className={`badge ${statusStyle[b.status] || ""}`}>{b.status}</span>

              {["pending", "accepted"].includes(b.status) && (
                <button onClick={() => cancel(b._id)} className="btn btn-ghost text-xs">
                  Cancel
                </button>
              )}
 
            { 
              b.status === "completed" ? (!b.hasBeenRated ? (
                  <Link
                  to={`/post-review/${b._id}`}
                  className="btn btn-accent"
                 >
                  Post Review
                </Link> 
              ) : (<span className="text-xs text-muted"> already reviewed</span>))
              : ""
              }

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;
