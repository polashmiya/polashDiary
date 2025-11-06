import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const from = new URLSearchParams(location.search).get("from") || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch {
      // error handled via context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Login</h1>
      <p className="mt-2 text-sm text-slate-600">
        Don't have an account?{" "}
  <Link className="text-green-600 hover:text-green-800" to="/signup">Sign up</Link>
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-green-500 focus:outline-none"
            value={form.email}
            onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(null); }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-green-500 focus:outline-none"
            value={form.password}
            onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(null); }}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
        
      </form>
    </div>
  );
}
