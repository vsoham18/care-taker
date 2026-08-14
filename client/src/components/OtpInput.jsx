import { useState } from "react";
import { api } from "../api/axios";


const OtpInput = ({ phone, onVerified }) => {
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [devHint, setDevHint] = useState("");

  const sendCode = async () => {

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit phone number first.");
      return;
    }
    setError("");
    setBusy(true);

    try {
      const { data } = await api.post("/otp/send", { phone });
      setSent(true);
      // the server only includes this outside production - handy for local testing
      setDevHint(data.data?.otp ? `Dev mode - your code is ${data.data.otp}` : "");
    } 
    catch (err) {
      setError(err.response?.data?.message || "Couldn't send OTP.");
    } 
    finally {
      setBusy(false);
    }
  };

  const verifyCode = async () => {
    setError("");
    setBusy(true);

    try {
      await api.post("/otp/verify", { phone, otp });
      setVerified(true);
      onVerified?.(phone);
    } 
    catch (err) {
      setError(err.response?.data?.message || "Incorrect code.");
    } 
    finally {
      setBusy(false);
    }
  };

  if (verified) {
    return (
      <p className="flex items-center gap-1.5 text-sm font-medium text-teal-600">
        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-teal-500">
          <path d="M8 13.4 4.6 10l-1.4 1.4L8 16.2l9-9-1.4-1.4z" />
        </svg>
        Phone verified
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-teal-50/50 p-3">
      {!sent ? (
        <button type="button" onClick={sendCode} disabled={busy} className="btn btn-secondary text-xs">
          {busy ? "Sending…" : "Send OTP to verify"}
        </button>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <input
            className="input w-32"
            placeholder="6-digit code"
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />
          <button type="button" onClick={verifyCode} disabled={busy} className="btn btn-primary text-xs">
            {busy ? "Checking…" : "Verify"}
          </button>
          <button type="button" onClick={sendCode} disabled={busy} className="btn text-xs text-teal-600 underline">
            Resend
          </button>
        </div>
      )}
      {devHint && <p className="mt-2 text-xs text-honey-500">{devHint}</p>}
      {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}
    </div>
  );
};

export default OtpInput;
