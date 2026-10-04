import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const SESSION_COOKIE = "kitabkhana_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Create a simple signed session token (base64url payload + HMAC-like signature using secret) */
async function signSession(payload: { userId: string; email: string; role: string; exp: number }) {
  const secret = process.env.AUTH_SECRET || "urdu-adab-dev-secret-change-me";
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  const sigB64 = Buffer.from(sig).toString("base64url");
  return `${data}.${sigB64}`;
}

async function verifySession(token: string) {
  const secret = process.env.AUTH_SECRET || "urdu-adab-dev-secret-change-me";
  const [data, sigB64] = token.split(".");
  if (!data || !sigB64) return null;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      Buffer.from(sigB64, "base64url"),
      new TextEncoder().encode(data)
    );
    if (!valid) return null;

    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as {
      userId: string;
      email: string;
      role: string;
      exp: number;
    };
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createAdminSession(user: { id: string; email: string; role: string }) {
  const exp = Date.now() + SESSION_MAX_AGE * 1000;
  const token = await signSession({
    userId: user.id,
    email: user.email,
    role: user.role,
    exp,
  });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session || session.role !== "admin") {
    return null;
  }
  return session;
}

export async function loginAdmin(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== "admin") {
    return { error: "غلط ای میل یا پاس ورڈ" };
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return { error: "غلط ای میل یا پاس ورڈ" };
  }
  await createAdminSession({ id: user.id, email: user.email, role: user.role });
  return { success: true, user: { id: user.id, email: user.email, name: user.name } };
}
