import { useState } from "react";
import { api } from "../api/axios";
import { toast } from "react-toastify";

const todayISO = () => new Date().toISOString().split("T")[0];

const BookingModal = ({ caretakerId, onClose, onSent }) => {
  const [from, setFrom] = useState(todayISO());
  const [to, setTo] = useState(todayISO());
  const [preferredTime, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (new Date(to) < new Date(from)) {
      setError("End date must be after the start date.");
      return;
    }
    setBusy(true);
    setError("");

    try {
      await api.post(`/bookings/request/${caretakerId}`, {
        servicePeriod: { from, to },
        preferredTime,
        message,
      });
       toast.success("Booking request sent successfully!")
       onSent?.();
    }
    catch (err) {
      setError(err.response?.data?.message || "Couldn't send the request."); setError(
      err.response?.data?.message ||
      "Couldn't send the request."
      ) 
    } 
    finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div className="card w-full max-w-md p-6">
        <h3 className="mb-1 font-display text-2xl">Request a booking</h3>
        <p className="mb-4 text-sm text-muted">
          Send a request first — once sent, the caretaker will call you to
          confirm the details before accepting.
        </p>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">From</label>
              <input
                type="date"
                required
                className="input"
                value={from}
                min={todayISO()}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="label">To</label>
              <input
                type="date"
                required
                className="input"
                value={to}
                min={from}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Preferred time of day (optional)</label>
            <input
              className="input"
              placeholder="e.g. Mornings, 9–1"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
            />
          </div>
          <div>
            <label className="label">A note (optional)</label>
            <textarea
              className="input min-h-24"
              placeholder="Tell them a bit about what you need…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-rose-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={busy} className="btn btn-primary">
              {busy ? "Sending…" : "Send request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
