import crypto from 'crypto';
import { cookies } from 'next/headers';

export const adminPassword = () => (process.env.ADMIN_PASSWORD || '').trim();

export const token = () =>
  crypto.createHmac('sha256', adminPassword() || 'unset').update('finance-feed-admin').digest('hex');

export async function isAdmin() {
  if (!adminPassword()) return false;
  const v = (await cookies()).get('ff_admin')?.value;
  if (!v) return false;
  const a = Buffer.from(v), b = Buffer.from(token());
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
