'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  opacity: number;
}

export default function ChristmasLandingPage() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Generate snowflakes on client side only
    const flakes: Snowflake[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 5 + Math.random() * 10,
      animationDelay: Math.random() * 5,
      size: 2 + Math.random() * 4,
      opacity: 0.3 + Math.random() * 0.7,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background - Gradient fallback with optional image */}
      <div className="absolute inset-0 z-0">
        {/* Gradient background as fallback */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #3a5f7c 0%, #5a7f9c 30%, #8aa5b8 60%, #c5d5e0 80%, #e8f0f5 100%)',
          }}
        />
        {/* Winter landscape image */}
        <Image
          src="/images/backgrounds/snellman-sothebys-merry-christmas-2025-web.jpg"
          alt="Finnish winter landscape"
          fill
          className="object-cover"
          priority
          quality={90}
          onError={(e) => {
            // Hide image if it fails to load, gradient will show through
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-[#1a3a5c]/30" />
      </div>

      {/* Snowfall Effect */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute rounded-full bg-white animate-snowfall"
            style={{
              left: `${flake.left}%`,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              opacity: flake.opacity,
              animationDuration: `${flake.animationDuration}s`,
              animationDelay: `${flake.animationDelay}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-between py-8 px-4">
        {/* Logo */}
        <div className="flex-shrink-0 pt-4">
          <Image
            src="/images/logos/logo-white.png"
            alt="Snellman Sotheby's International Realty"
            width={400}
            height={120}
            className="h-16 md:h-20 w-auto"
            priority
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center text-white max-w-4xl mx-auto py-8">
          {/* Main Greeting - Elegant Script */}
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl mb-8 leading-tight"
            style={{ fontFamily: 'freight-display-pro, Georgia, serif', fontStyle: 'italic' }}
          >
            Hyvää Joulua, God Jul &amp;<br />
            Merry Christmas!
          </h1>

          {/* Multilingual Messages */}
          <div className="space-y-4 mb-8 text-base md:text-lg font-light">
            <p>
              Haluamme kiittää asiakkaitamme kuluneesta vuodesta sekä<br />
              toivottaa Onnellista Uutta Vuotta 2026!
            </p>
            <p>
              Vi vill tacka våra kunder för det gångna året och önskar er ett<br />
              riktigt Gott Nytt År 2026!
            </p>
            <p>
              We would like to thank all our customers for the past year and<br />
              wish you a Happy New Year 2026!
            </p>
          </div>

          {/* Team Names - Script Font */}
          <p 
            className="text-2xl md:text-3xl lg:text-4xl mb-10 text-white/90"
            style={{ fontFamily: 'freight-display-pro, Georgia, serif', fontStyle: 'italic' }}
          >
            Heidi, Soile, Ali, Kadri-Ann, Tea, Sima,<br />
            Dennis, Johan, Eeva, Petteri ja Robert
          </p>

          {/* Call to Action */}
          <div className="space-y-4 mb-8">
            <h2 className="text-lg md:text-xl font-semibold">
              Tutustu myynnissä oleviin kohteisiimme<br />
              Bekanta dig med våra objekt till salu<br />
              Get acquainted with our properties for sale
            </h2>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Link 
              href="/fi/kohteet"
              className="px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-[#002349] transition-all duration-300 text-sm tracking-widest"
            >
              SNELLMAN SOTHEBY&apos;S »
            </Link>
            <a 
              href="https://www.etuovi.com/myytavat-asunnot?hpipc=2644749-2"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-[#002349] transition-all duration-300 text-sm tracking-widest"
            >
              ETUOVI »
            </a>
            <a 
              href="https://asunnot.oikotie.fi/myytavat-asunnot?cardType=relative&companyId=17628"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-[#002349] transition-all duration-300 text-sm tracking-widest"
            >
              OIKOTIE »
            </a>
          </div>

          {/* Contact Info */}
          <div className="text-center mb-6">
            <p className="text-2xl md:text-3xl font-light mb-2">
              <a href="tel:0103156900" className="hover:text-[var(--color-gold)] transition-colors">010 315 6900</a>
              <span className="mx-4">|</span>
              <a href="mailto:info@sothebysrealty.fi" className="hover:text-[var(--color-gold)] transition-colors">info@sothebysrealty.fi</a>
            </p>
          </div>

          {/* Company Name */}
          <div className="text-center mb-4">
            <h3 className="text-xl md:text-2xl font-semibold">
              Snellman Sotheby&apos;s<br />
              International Realty
            </h3>
            <p className="text-lg mt-2 font-light italic">
              Opens new doors and possibilities
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm mb-4">
            <a 
              href="https://www.sothebysrealty.com/eng/living-in-finland"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--color-gold)] transition-colors"
            >
              Living in Finland »
            </a>
            <a 
              href="https://www.sothebysrealty.com/eng/sales/fin"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--color-gold)] transition-colors"
            >
              SIR.COM Listings »
            </a>
          </div>

          {/* Address */}
          <p className="text-sm text-white/80 mb-6">
            Kasarmikatu 34, 00130 Helsinki
          </p>
        </div>

        {/* Social Media */}
        <div className="flex-shrink-0 pb-4">
          <div className="flex items-center justify-center gap-8 text-sm">
            <a 
              href="https://www.facebook.com/snellmansothebysrealty"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-gold)] transition-colors text-white"
            >
              Facebook
            </a>
            <a 
              href="https://www.instagram.com/snellmansothebysrealty"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-gold)] transition-colors text-white"
            >
              Instagram
            </a>
            <a 
              href="https://www.linkedin.com/company/snellman-sothebys-international-realty"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-gold)] transition-colors text-white"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* CSS for snowfall animation */}
      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10px) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        .animate-snowfall {
          animation-name: snowfall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
}

