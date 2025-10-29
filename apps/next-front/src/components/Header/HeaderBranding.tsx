import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { getSiteSettings } from '@/lib/wordpress';

export default async function HeaderBranding() {
  const settings = await getSiteSettings();
  
  return (
    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      {/* Logo will be fetched from WordPress customizer settings */}
      <div className="flex items-center gap-2">
        <Image
          src="/logo.png" // This should come from WordPress settings
          alt={settings.title}
          width={120}
          height={40}
          priority
          className="h-8 w-auto"
        />
        <span className="font-semibold text-lg hidden sm:block text-gray-900">
          {settings.title}
        </span>
      </div>
    </Link>
  );
} 