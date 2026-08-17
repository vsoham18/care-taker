import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { toast } from "react-toastify";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "";

const Requests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/bookings/requested-bookings");
      setBookings(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

const act = async (id, action) => {
  try {
    await api.patch(`/bookings/${action}/${id}`);

    toast.success(
      action === "accept"
        ? "Booking accepted successfully."
        : "Booking rejected successfully."
    );

    load();
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      `Couldn't ${action} the booking.`
    );
  }
};

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-3xl">Booking requests</h1>
      <p className="mt-1 text-sm text-muted">
        Speak with the family by phone first, then accept. Mark as complete
        once the service period is over — that's what lets them leave a review.
      </p>

      {error && <p className="mt-4 text-sm text-rose-500">{error}</p>}

      {loading ? (
        <p className="mt-6 text-sm text-muted">Loading…</p>
      ) : bookings.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No requests yet.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {bookings.map((b) => (
            <li key={b._id} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-ink">{b.requestedBy?.name}</p>
                  <p className="text-xs text-muted">{b.requestedBy?.phone}</p>
                </div>
                <span className="badge bg-teal-50 text-teal-600">{b.status}</span>
              </div>

              <p className="mt-2 text-xs text-muted">
                {formatDate(b.servicePeriod?.from)} – {formatDate(b.servicePeriod?.to)}
              </p>
              {b.message && <p className="mt-2 text-sm text-ink/80">"{b.message}"</p>}

              <div className="mt-3 flex gap-2">

                {b.status === "pending" && (
                  <>
                    <button onClick={() => act(b._id, "accept")} className="btn btn-primary text-xs">
                      Accept
                    </button>
                    <button onClick={() => act(b._id, "reject")} className="btn btn-ghost text-xs">
                      Decline
                    </button>
                  </>
                )}

                {b.status === "accepted" && (
                  <button onClick={() => act(b._id, "complete")} className="btn btn-secondary text-xs">
                    Mark service complete
                  </button>
                )}

              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Requests;
