import { useState } from "react";
import { api } from "../api/axios.js";
import { toast } from "react-toastify";

const REPORT_REASONS = [
  ["inappropriate-content", "Inappropriate content"],
  ["misleading-information", "Misleading information"],
  ["fraud", "Fraud or scam"],
  ["harassment", "Harassment"],
  ["escort-sexual-services", "Escort or sexual services"],
  ["spam", "Spam"],
  ["other", "Other"],
];

const ReportModal = ({
  onClose,
  targetType,
  targetId,
}) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    if (!reason) {
      setError("Please select a reason for reporting.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const endpoint =
        targetType === "review"
          ? `/report/review/${targetId}`
          : `/report/caretaker/${targetId}`;

      await api.post(endpoint, {
        reason,
        description: description.trim() || undefined,
      });
 
      toast.success(
        targetType === "review"
          ? "Review reported successfully."
          : "Profile reported successfully."
      );

      onClose();
    } 
    catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't submit your report. Please try again."
      )
    } 
    finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) {
          onClose();
        }
      }}
    >
      <div className="card w-full max-w-md p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl">
              Report {targetType === "review" ? "review" : "profile"}
            </h3>

            <p className="mt-1 text-sm text-muted">
              Help us understand what is wrong with this{" "}
              {targetType === "review" ? "comment" : "profile"}.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="text-xl leading-none text-muted transition hover:text-ink disabled:opacity-50"
            aria-label="Close report dialog"
          >
            ×
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="report-reason" className="label">
              Reason
            </label>

            <select
              id="report-reason"
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input"
              disabled={busy}
            >
              <option value="">Select a reason</option>

              {REPORT_REASONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="report-description" className="label">
              Additional details{" "}
              <span className="font-normal text-muted">(optional)</span>
            </label>

            <textarea
              id="report-description"
              name="description"
              className="input min-h-28"
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us briefly what happened..."
              disabled={busy}
            />

            <p className="mt-1 text-right text-xs text-muted">
              {description.length}/1000
            </p>
          </div>

          {error && (
            <p className="text-sm text-rose-500">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="btn btn-ghost"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={busy}
              className="btn btn-primary"
            >
              {busy ? "Submitting…" : "Submit report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;