import type { Metadata } from 'next';
import { UserProfileProvider } from './UserProfileContext';

export const metadata: Metadata = {
  title: 'GABE — Spiritual Companion',
  description: "Where every prayer begins with a conversation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProfileProvider>{children}</UserProfileProvider>
      </body>
    </html>
  );
}
