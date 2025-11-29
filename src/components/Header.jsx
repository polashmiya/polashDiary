import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Roles } from "../lib/auth";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-2 sm:px-6">
        <div className="flex h-16 items-center justify-between flex-wrap">
          <Link to="/" className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
            <span className="text-green-600">Polash</span> Diary
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <div className="flex flex-col items-end mr-1 sm:mr-2">
                  <span className="text-xs sm:text-sm text-slate-700 font-medium leading-tight">Hi, {user.name}</span>
                  {user.displayName && <span className="text-[10px] sm:text-xs text-slate-500">{user.displayName}</span>}
                </div>
                {user.role === Roles.Admin && (
                  <Link to="/admin" className="text-xs sm:text-sm text-green-600 hover:text-green-800">Admin</Link>
                )}
                <Link to="/create-post" className="text-xs sm:text-sm text-green-600 hover:text-green-800 font-semibold">Create Post</Link>
                <button
                  onClick={logout}
                  className="px-2 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-semibold text-green-600 border border-green-300 shadow-sm hover:bg-green-50 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link
                  to="/login"
                  className="px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium text-green-600 border border-green-200 hover:bg-green-50"
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
