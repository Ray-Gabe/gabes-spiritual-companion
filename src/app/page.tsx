'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  setProfile,
  getProfile,
  isSignedIn,
  verifyPasscode,
  type GabeProfile,
} from '@/lib/client-auth';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#87CEEB,#B0E0E6,#E6F3FF)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Display','SF Pro Text', Segoe UI, Roboto, system-ui, sans-serif",
    position: 'relative' as const,
  },
  sheet: {
    width: 'min(480px, 94vw)',
    background: '#ffffff',
    borderRadius: 32,
    border: '1px solid #87CEEB',
    boxShadow: '0 40px 120px rgba(0,0,0,.4), 0 16px 64px rgba(135,206,235,.5)',
    padding: 'clamp(32px,5vw,48px)',
    position: 'relative' as const,
  },
  avatarWrap: { display: 'grid', placeItems: 'center', marginBottom: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 999,
    background:
      'radial-gradient(circle at 35% 30%, #eef4ff 0%, #dceaff 45%, #cfe0ff 100%)',
    boxShadow: 'inset 0 0 0 6px #f5f8ff, 0 6px 20px rgba(45,64,120,.20)',
    display: 'grid',
    placeItems: 'center',
    fontSize: 32,
    color: '#0b1b4f',
    fontWeight: 900,
    letterSpacing: '-0.02em',
  },
  formGroup: { marginBottom: 20 },
  label: { display: 'block', color: '#374151', fontSize: 14, fontWeight: 600, marginBottom: 8 },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: 12,
    fontSize: 15,
    background: '#f9fafb',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box' as const,
  },
  hint: { color: '#6b7280', fontSize: 12, marginTop: 6 },
  button: {
    width: '100%',
    background: 'linear-gradient(90deg,#243b90,#2849c7)',
    color: '#fff',
    border: 'none',
    borderRadius: 999,
    padding: '14px 24px',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'transform .15s ease, box-shadow .15s ease',
    boxShadow: '0 8px 20px rgba(36,59,144,.3)',
    marginBottom: 16,
  },
  chipContainer: { marginTop: 24, marginBottom: 24 },
  chipLabel: { textAlign: 'center' as const, color: '#6b7280', fontSize: 13, fontWeight: 600, marginBottom: 12 },
  chips: { display: 'flex', flexWrap: 'wrap' as const, gap: 8, justifyContent: 'center' },
  chip: {
    padding: '6px 12px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    border: '1px solid #d1d5db',
    background: '#f9fafb',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  chipActive: {
    background: '#0b1b4f',
    color: '#fff',
    border: '1px solid #0b1b4f',
    boxShadow: '0 4px 12px rgba(11,27,79,.25)',
  },
  footer: { textAlign: 'center' as const, color: '#9ca3af', fontSize: 12, marginTop: 24 },
  row: { display: 'flex', alignItems: 'center', gap: 8 },
  checkbox: { width: 16, height: 16, cursor: 'pointer' },
};

const SEGMENTS = ['Kid/Teen', 'Student', 'Young Adult', 'Adult', 'Senior', 'Auto'] as const;
type Segment = typeof SEGMENTS[number];

export default function LandingPage() {
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [hoveredButton, setHoveredButton] = useState('');
  const [remember, setRemember] = useState(true);
  const [existing, setExisting] = useState<GabeProfile | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    ageGroup: 'Auto' as Segment,
  });

  // Prefill if a profile already exists -> switch to Sign In mode
  useEffect(() => {
    const prof = getProfile();
    if (prof) {
      setExisting(prof);
      setIsSignUp(false);
      setFormData((p) => ({
        ...p,
        name: prof.name || '',
        ageGroup: prof.ageGroup || 'Auto',
      }));
      setRemember(!!prof.remember);
    } else {
      setIsSignUp(true); // first-time visitors see Join flow
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  function validateSignup() {
    if (!formData.name.trim()) return 'Please enter your name so GABE can greet you 💙';
    if (!SEGMENTS.includes(formData.ageGroup)) return 'Please select an age group.';
    if (!formData.password) return 'Please choose a password (your private passcode).';
    if (formData.password.length < 4) return 'Passcode should be at least 4 characters.';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match.';
    return null;
  }

  function validateSignin() {
    if (!existing) return 'No saved profile found. Please “Join GABE” first.';
    if (!formData.password) return 'Please enter your passcode.';
    return null;
  }

  function handleSubmit() {
    if (isSignUp) {
      const err = validateSignup();
      if (err) return alert(err);

      // Save profile locally
      setProfile({
        name: formData.name.trim(),
        ageGroup: formData.ageGroup,
        passcode: formData.password,
        remember,
        createdAt: new Date().toISOString(),
      });

      // Go choose or go chat directly
      router.push('/chat');
      return;
    }

    // Sign In
    const err = validateSignin();
    if (err) return alert(err);

    if (!verifyPasscode(formData.password)) {
      alert('Passcode incorrect. Please try again.');
      return;
    }

    router.push('/chat');
  }

  return (
    <main style={styles.page}>
      <div style={styles.sheet}>
        {/* Mode toggles */}
        <div style={{ position: 'absolute', top: 32, left: 32 }}>
          <button
            onClick={() => setIsSignUp(false)}
            style={{
              background: 'none',
              border: 'none',
              color: !isSignUp ? '#243b90' : '#9ca3af',
              fontSize: 12,
              cursor: 'pointer',
              padding: '4px 8px',
              textDecoration: 'underline',
            }}
          >
            Sign In
          </button>
        </div>
        <div style={{ position: 'absolute', top: 32, right: 32 }}>
          <button
            onClick={() => setIsSignUp(true)}
            style={{
              background: 'none',
              border: 'none',
              color: isSignUp ? '#243b90' : '#9ca3af',
              fontSize: 12,
              cursor: 'pointer',
              padding: '4px 8px',
              textDecoration: 'underline',
            }}
          >
            Join GABE
          </button>
        </div>

        {/* Avatar */}
        <div style={styles.avatarWrap}>
          <div style={styles.avatar}>GABE</div>
        </div>

        {/* Intro */}
        <div style={{ textAlign: 'center', marginBottom: 24, paddingTop: 8 }}>
          <div style={{ color: '#6b7280', fontSize: 16, fontWeight: 600, marginBottom: 8, lineHeight: 1.3 }}>
            ✨ Meet GABE (Gabriel: God's Messenger)
          </div>
          <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.5, margin: 0 }}>
            Your AI-powered faith companion — here to guide, comfort, and inspire you with Scripture and
            interactive spiritual growth.
          </p>
        </div>

        {/* Existing profile hint */}
        {existing && !isSignUp && (
          <div style={{ marginBottom: 16, color: '#0b1b4f', fontSize: 14, textAlign: 'center', fontWeight: 600 }}>
            Welcome back, {existing.name}! ({existing.ageGroup})
          </div>
        )}

        {/* Form */}
        <div>
          {isSignUp && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter your name"
                onFocus={e => { e.target.style.borderColor = '#87CEEB'; e.target.style.background = '#ffffff'; }}
                onBlur={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.background = '#f9fafb'; }}
              />
            </div>
          )}

          {/* Passcode (both modes) */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Passcode</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              style={styles.input}
              placeholder={isSignUp ? 'Create a passcode' : 'Enter your passcode'}
              onFocus={e => { e.target.style.borderColor = '#87CEEB'; e.target.style.background = '#ffffff'; }}
              onBlur={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.background = '#f9fafb'; }}
            />
            <div style={styles.hint}>
              {isSignUp
                ? 'This is your private passcode to return later.'
                : 'Enter the passcode you created when you joined.'}
            </div>
          </div>

          {isSignUp && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Confirm Passcode</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Confirm your passcode"
                  onFocus={e => { e.target.style.borderColor = '#87CEEB'; e.target.style.background = '#ffffff'; }}
                  onBlur={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.background = '#f9fafb'; }}
                />
              </div>

              <div style={styles.chipContainer}>
                <div style={styles.chipLabel}>I am a...</div>
                <div style={styles.chips}>
                  {SEGMENTS.map(segment => (
                    <button
                      key={segment}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, ageGroup: segment }))}
                      style={{
                        ...styles.chip,
                        ...(formData.ageGroup === segment ? styles.chipActive : {}),
                      }}
                    >
                      {segment}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ ...styles.formGroup, ...styles.row }}>
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(r => !r)}
                  style={styles.checkbox}
                />
                <label htmlFor="remember" style={{ color: '#374151', fontSize: 14 }}>
                  Remember me on this device
                </label>
              </div>
            </>
          )}

          <button
            onClick={handleSubmit}
            style={{
              ...styles.button,
              ...(hoveredButton === 'primary'
                ? { transform: 'translateY(-2px)', boxShadow: '0 12px 28px rgba(36,59,144,.4)' }
                : {}),
            }}
            onMouseEnter={() => setHoveredButton('primary')}
            onMouseLeave={() => setHoveredButton('')}
          >
            {isSignUp ? '🙏 Join GABE' : '✨ Sign In'}
          </button>
        </div>

        {/* Quick links */}
        <div style={{ ...styles.footer, marginTop: 8 }}>
          <Link href="/chat" style={{ color: '#6b7280', textDecoration: 'underline' }}>
            Continue to chat
          </Link>
          {' • '}
          <Link href="/games" style={{ color: '#6b7280', textDecoration: 'underline' }}>
            Try Gabefiyed
          </Link>
        </div>
      </div>
    </main>
  );
}

