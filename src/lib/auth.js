import { api, setToken } from "./api";

const KEY = "authUser";

export const Roles = {
  Admin: "admin",
  User: "user",
};

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

function persistSession({ user, token }) {
  if (!user) return null;
  const normalized = { ...user };
  if (!normalized.id && normalized._id) normalized.id = normalized._id;
  if (!normalized.role) normalized.role = Roles.User;
  if (token) setToken(token);
  localStorage.setItem(KEY, JSON.stringify(normalized));
  return normalized;
}

export async function signup({ name, email, password }) {
  // Try to sign up; if API does not return token, fallback to login
  const res = await api.post("/auth/signup", { name, email, password });
  const user = res?.user || res?.data?.user || res;
  const token = res?.token || res?.data?.token;
  if (token && user) return persistSession({ user, token });
  // fallback: login to get token
  const u = await login({ email, password });
  // Optionally update name if signup response had it
  if (user?.name && u && !u.name) {
    const merged = { ...u, name: user.name };
    localStorage.setItem(KEY, JSON.stringify(merged));
    return merged;
  }
  return u;
}

export async function login({ email, password }) {
  const res = await api.post("/auth/login", { email, password });
  const token = res?.token || res?.data?.token;
  const user = res?.user || res?.data?.user || {
    id: res?.userId || res?._id || res?.id,
    email,
    name: res?.name,
    role: res?.role || Roles.User,
  };
  if (!token) throw new Error("Login failed: token not provided");
  return persistSession({ user, token });
}

export function logout() {
  setToken(null);
  localStorage.removeItem(KEY);
}

// Admin utilities (not implemented against API)
export function listUsers() { throw new Error("Not implemented"); }
export function setUserActive() { throw new Error("Not implemented"); }
export function createUser() { throw new Error("Not implemented"); }
