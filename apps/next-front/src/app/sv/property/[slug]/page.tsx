import { redirect } from 'next/navigation';

interface RedirectPageProps {
  params: {
    slug: string;
  };
}

// Redirect /sv/property/[slug] to /sv/objekt/[slug]
export default function SwedishPropertyRedirect({ params }: RedirectPageProps) {
  redirect(`/sv/objekt/${params.slug}`);
}

