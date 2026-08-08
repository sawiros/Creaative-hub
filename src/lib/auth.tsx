import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthResult, localAuth, Member, supabase } from './supabase';

interface AuthState {
  user: { id: string; email: string } | null;
  profile: Member | null;
  loading: boolean;
  isSupabase: boolean;
  signUp: (d: { fullName: string; phone: string; email: string; password: string; vehicle: string; battery: number }) => Promise<AuthResult>;
  signIn: (identifier: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthCtx = createContext<AuthState>(null as unknown as AuthState);
export const useAuth = () => useContext(AuthCtx);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthState['user']>(null);
  const [profile, setProfile] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const isSupabase = Boolean(supabase);

  useEffect(() => {
    let active = true;
    if (!isSupabase) {
      const s = localAuth.current();
      if (active) {
        setUser(s?.user || null);
        setProfile(s?.profile || null);
        setLoading(false);
      }
      return;
    }
    supabase!.auth.getSession().then(({ data }) => {
      if (!active) return;
      const u = data.session?.user;
      if (u) {
        setUser({ id: u.id, email: u.email || '' });
        loadProfile(u.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    const { data: sub } = supabase!.auth.onAuthStateChange((_e, session) => {
      if (!active) return;
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
        loadProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });
    return () => {
      active = false;
      sub?.subscription.unsubscribe();
    };
  }, []);

  async function loadProfile(id: string) {
    if (!supabase) return;
    const { data } = await supabase.from('members').select('*').eq('user_id', id).maybeSingle();
    if (data) setProfile(data as Member);
  }

  const signUp: AuthState['signUp'] = async (d) => {
    if (!isSupabase) {
      const r = localAuth.signUp(d);
      if (r.ok) {
        setUser(r.user!);
        setProfile(r.profile || null);
      }
      return r;
    }
    const { data, error } = await supabase!.auth.signUp({ email: d.email, password: d.password });
    if (error || !data.user) return { ok: false, error: error?.message || 'Sign up failed.' };
    // store profile
    const { error: insertErr } = await supabase!.from('members').insert({
      user_id: data.user.id,
      full_name: d.fullName,
      phone: d.phone,
      email: d.email,
      vehicle: d.vehicle,
      battery: d.battery,
      is_seed: false,
    });
    if (insertErr) return { ok: false, error: 'Account created but profile save failed: ' + insertErr.message };
    const p = { id: data.user.id, full_name: d.fullName, phone: d.phone, vehicle: d.vehicle, battery: d.battery, email: d.email } as Member;
    setUser({ id: data.user.id, email: d.email });
    setProfile(p);
    return { ok: true, user: { id: data.user.id, email: d.email }, profile: p };
  };

  const signIn: AuthState['signIn'] = async (identifier, password) => {
    if (!isSupabase) {
      const r = localAuth.signIn(identifier, password);
      if (r.ok) {
        setUser(r.user!);
        setProfile(r.profile || null);
      }
      return r;
    }
    // accept phone or email
    const email = identifier.includes('@') ? identifier : identifier.replace(/[^0-9]/g, '') + '@demo.chargeshare.et';
    const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error || !data.user) return { ok: false, error: error?.message || 'Invalid credentials.' };
    setUser({ id: data.user.id, email: data.user.email || '' });
    await loadProfile(data.user.id);
    return { ok: true, user: { id: data.user.id, email: data.user.email || '' } };
  };

  const signOut: AuthState['signOut'] = async () => {
    if (isSupabase) await supabase!.auth.signOut();
    else localAuth.signOut();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user && isSupabase) await loadProfile(user.id);
  };

  return (
    <AuthCtx.Provider value={{ user, profile, loading, isSupabase, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthCtx.Provider>
  );
};
