import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { seedUsers } from './seedUsers';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const hasSupabase = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = hasSupabase ? createClient(url!, anonKey!) : null;

export type Member = {
  id: string;
  full_name: string;
  phone: string;
  vehicle: string;
  battery: number;
  is_seed?: boolean;
  email?: string;
  created_at?: string;
};

export interface AuthResult {
  ok: boolean;
  error?: string;
  user?: { id: string; email: string };
  profile?: Member;
}

// ---------- localStorage fallback (runs without Supabase keys) ----------
const LS_KEY = 'chargeshare_members';
const LS_SESSION = 'chargeshare_session';

export function localDb(): Member[] {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) {
    const seeded = seedUsers();
    localStorage.setItem(LS_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as Member[];
  } catch {
    return seedUsers();
  }
}
function saveLocal(members: Member[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(members));
}

export const localAuth = {
  signUp(data: { fullName: string; phone: string; email: string; password: string; vehicle: string; battery: number }): AuthResult {
    const members = localDb();
    if (members.some((m) => m.phone === data.phone || m.email === data.email)) {
      return { ok: false, error: 'An account with this phone or email already exists.' };
    }
    const member: Member = {
      id: 'usr-' + Date.now(),
      full_name: data.fullName,
      phone: data.phone,
      vehicle: data.vehicle,
      battery: data.battery,
      email: data.email,
      is_seed: false,
      created_at: new Date().toISOString(),
    };
    members.push(member);
    saveLocal(members);
    localStorage.setItem(LS_SESSION, JSON.stringify({ id: member.id, email: data.email, password: data.password }));
    return { ok: true, user: { id: member.id, email: data.email }, profile: member };
  },
  signIn(identifier: string, password: string): AuthResult {
    const members = localDb();
    const m = members.find((x) => x.phone === identifier || x.email === identifier);
    if (!m) return { ok: false, error: 'No account found with that phone/email.' };
    localStorage.setItem(LS_SESSION, JSON.stringify({ id: m.id, email: m.email, password }));
    return { ok: true, user: { id: m.id, email: m.email || '' }, profile: m };
  },
  current(): { user: { id: string; email: string }; profile?: Member } | null {
    const raw = localStorage.getItem(LS_SESSION);
    if (!raw) return null;
    try {
      const s = JSON.parse(raw);
      const profile = localDb().find((m) => m.id === s.id);
      return { user: { id: s.id, email: s.email }, profile };
    } catch {
      return null;
    }
  },
  signOut() {
    localStorage.removeItem(LS_SESSION);
  },
};

export const memberDb = {
  async list(): Promise<Member[]> {
    if (supabase) {
      const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: false }).limit(500);
      if (!error && data) return data as Member[];
    }
    return localDb();
  },
};
