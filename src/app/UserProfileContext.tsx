'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Profile = { name: string; ageGroup: string; email?: string };
type Ctx = {
  profile: Profile;
  setProfile: (p: Profile) => void;
  save: (p: Partial<Profile>) => void;
};

const UserProfileContext = createContext<Ctx | null>(null);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>({ name: 'friend', ageGroup: 'Auto', email: '' });

  // Load from localStorage on first mount
  useEffect(() => {
    try {
      const name = localStorage.getItem('gabeName') || 'friend';
      const ageGroup = localStorage.getItem('gabeAgeGroup') || 'Auto';
      const email = localStorage.getItem('gabeEmail') || '';
      setProfile({ name, ageGroup, email });
    } catch {}
  }, []);

  // Save helper (merge + persist)
  const save = (p: Partial<Profile>) => {
    setProfile(prev => {
      const next = { ...prev, ...p };
      try {
        if (p.name !== undefined) localStorage.setItem('gabeName', next.name);
        if (p.ageGroup !== undefined) localStorage.setItem('gabeAgeGroup', next.ageGroup);
        if (p.email !== undefined) localStorage.setItem('gabeEmail', next.email || '');
      } catch {}
      return next;
    });
  };

  return (
    <UserProfileContext.Provider value={{ profile, setProfile, save }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export const useUserProfile = () => {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be used within UserProfileProvider');
  return ctx;
};
