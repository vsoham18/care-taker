import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import OtpInput from "../components/OtpInput.jsx";

const initial = { name: "", email: "", phone: "", password: "", confirmPassword: "" };

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!phoneVerified) return setError("Please verify your phone number first.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");

    setBusy(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create your account.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-16">
      <h1 className="font-display text-3xl">Join Aya</h1>
      <p className="mt-1 text-sm text-muted">
        We'll ask your permission for your location once you're in, so we can
        show you caretakers nearby.
      </p>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="label">Full name</label>
          <input required className="input" value={form.name} onChange={update("name")} />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" required className="input" value={form.email} onChange={update("email")} />
        </div>

        <div>
          <label className="label">Phone</label>
          <input
            required
            className="input"
            placeholder="10-digit mobile number"
            value={form.phone}
            onChange={update("phone")}
            disabled={phoneVerified}
          />
          <div className="mt-2">
            <OtpInput phone={form.phone} onVerified={() => setPhoneVerified(true)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Password</label>
            <input type="password" required minLength={6} className="input" value={form.password} onChange={update("password")} />
          </div>
          <div>
            <label className="label">Confirm password</label>
            <input type="password" required minLength={6} className="input" value={form.confirmPassword} onChange={update("confirmPassword")} />
          </div>
        </div>

        {error && <p className="text-sm text-rose-500">{error}</p>}
        <button type="submit" disabled={busy} className="btn btn-primary mt-2">
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already on Aya?{" "}
        <Link to="/login" className="font-semibold text-teal-500">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
