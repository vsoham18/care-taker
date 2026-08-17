import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(form);
       toast.success("Logged in successfully!");
       navigate(location.state?.from?.pathname || "/");
    } 
    catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Couldn't log you in."
      );
    } 
    finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-5 py-16">
      <h1 className="font-display text-3xl">Welcome back</h1>
      <p className="mt-1 text-sm text-muted">Log in to see full profiles and manage bookings.</p>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button type="submit" disabled={busy} className="btn btn-primary mt-2">
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        New to Aya?{" "}
        <Link to="/register" className="font-semibold text-teal-500">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
