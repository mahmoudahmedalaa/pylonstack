import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tech Catalog | Pylon',
  description:
    'Browse and discover over 200 curated infrastructure tools, frameworks, and managed services for your next tech stack.',
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
