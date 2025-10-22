import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Roles } from "../lib/auth";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight text-slate-900">
            <span className="text-indigo-600">Polash</span> Diary
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-700">Hi, {user.name}</span>
                {user.role === Roles.Admin && (
                  <Link to="/admin" className="text-sm text-indigo-600 hover:text-indigo-800">Admin</Link>
                )}
                <Link to="/create-post" className="text-sm text-indigo-600 hover:text-indigo-800">Create Post</Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-indigo-600 border border-indigo-200 hover:bg-indigo-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 rounded-md text-sm font-medium text-indigo-600 border border-indigo-200 hover:bg-indigo-50"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
