const KEY = "authUser";
const USERS_KEY = "authUsers"; // simplistic local user store

export const Roles = {
  Admin: "admin",
  User: "user",
};

function seedUsersIfNeeded() {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) return; // already seeded/has content
  const defaults = [
    {
      id: crypto.randomUUID(),
      name: "Admin",
      email: "admin@gmail.com",
      password: "123456",
      role: Roles.Admin,
      userTypeName: "Admin",
      userTypeId: 1,
      active: true,
    },
    {
      id: crypto.randomUUID(),
      name: "User",
      email: "user@gmail.com",
      password: "123456",
      role: Roles.User,
      userTypeName: "User",
      userTypeId: 2,
      active: true,
    },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
}

function loadUsers() {
  seedUsersIfNeeded();
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function signup({ name, email, password }) {
  const users = loadUsers();
  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    throw new Error("An account with this email already exists.");
  }
  const user = { id: crypto.randomUUID(), name, email, password, role: Roles.User, userTypeName: "User", userTypeId: 2, active: true }; // do NOT use in production
  users.push(user);
  saveUsers(users);
  const session = { id: user.id, name: user.name, email: user.email, role: user.role, userTypeName: user.userTypeName, userTypeId: user.userTypeId };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function login({ email, password }) {
  const users = loadUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password.");
  }
  if (!user.active) {
    throw new Error("Your account is inactive. Please contact admin.");
  }
  const session = { id: user.id, name: user.name, email: user.email, role: user.role, userTypeName: user.userTypeName, userTypeId: user.userTypeId };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  localStorage.removeItem(KEY);
}

// Admin utilities
export function listUsers() {
  return loadUsers();
}

export function setUserActive(userId, active) {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx !== -1) {
    users[idx].active = !!active;
    saveUsers(users);
  }
}

export function createUser({ name, email, password, role = Roles.User, active = true }) {
  const users = loadUsers();
  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) throw new Error("Email already exists");
  const userTypeMap = {
    [Roles.Admin]: { userTypeName: "Admin", userTypeId: 1 },
    [Roles.User]: { userTypeName: "User", userTypeId: 2 },
  };
  const meta = userTypeMap[role] || userTypeMap[Roles.User];
  const u = { id: crypto.randomUUID(), name, email, password, role, active, ...meta };
  users.push(u);
  saveUsers(users);
  return u;
}
