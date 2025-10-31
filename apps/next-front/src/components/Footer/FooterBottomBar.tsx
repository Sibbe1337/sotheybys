import { Link } from '@/lib/navigation';
import Image from 'next/image';
import GoToTopButton from './GoToTopButton';

export default function FooterBottomBar() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer>
      {/* Main Footer Section */}
      <div className="bg-[#001731] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="mb-6">
                <Image
                  src="/images/logos/logo-white.png"
                  alt="Snellman Sotheby's International Realty"
                  width={300}
                  height={60}
                  className="h-14 w-auto"
                />
              </div>

              {/* Contact Information */}
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold mb-2">Helsinki</h3>
                  <div className="space-y-1 text-white/80">
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Kasarmikatu 34, 00130 Helsinki
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      +358 (0)10 315 6900
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      info@sothebysrealty.fi
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Y-tunnus: 2644749-2
                    </p>
                  </div>
                </div>

                {/* KVKL Certification Badge */}
                <div className="pt-4">
                  <div className="inline-block bg-white/10 rounded-lg p-3">
                    <Image 
                      src="/images/logos/kvkl-badge.svg"
                      alt="Noudatamme hyvää välitystapaa - Kiinteistönvälitysalan Keskusliitto"
                      width={80}
                      height={80}
                      className="opacity-60"
                    />
                  </div>
                </div>

                {/* Social Media Icons */}
                <div className="flex items-center space-x-4 pt-4">
                  <a href="https://www.facebook.com/Snellmansothebysrealty/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Facebook" 
                        className="text-white/60 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/sothebysrealtyfinland" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Instagram" 
                        className="text-white/60 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                    </svg>
                  </a>
                  <a href="https://www.youtube.com/channel/UCUDafZp-yXwW6d-amvxoebQ" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="YouTube" 
                        className="text-white/60 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <a href="https://se.pinterest.com/sothebysrealtyfinland/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Pinterest" 
                        className="text-white/60 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/company/snellman-sothebys-international-realty" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="LinkedIn" 
                        className="text-white/60 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Pikalinkit</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-white/80 hover:text-white transition-colors">
                    Koti
                  </Link>
                </li>
                <li>
                  <Link href="/kohteet" className="text-white/80 hover:text-white transition-colors">
                    Kohteet
                  </Link>
                </li>
                <li>
                  <Link href="/myymassa" className="text-white/80 hover:text-white transition-colors">
                    Myymässä
                  </Link>
                </li>
                <li>
                  <Link href="/kansainvalisesti" className="text-white/80 hover:text-white transition-colors">
                    Kansainvälisesti
                  </Link>
                </li>
                <li>
                  <Link href="/henkilosto" className="text-white/80 hover:text-white transition-colors">
                    Henkilöstö
                  </Link>
                </li>
                <li>
                  <Link href="/yhteystiedot" className="text-white/80 hover:text-white transition-colors">
                    Ota yhteyttä
                  </Link>
                </li>
              </ul>
            </div>

            {/* Property Portals */}
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Asuntoportaalit</h3>
              <p className="text-sm text-white/80 mb-4">
                Katso kaikki myyntikohteemme myös:
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link 
                    href="https://www.etuovi.com/yritys/snellman-sothebys-international-realty" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Etuovi.com
                  </Link>
                </li>
                <li>
                  <Link 
                    href="https://www.oikotie.fi/yritys/snellman-sothebys-international-realty" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Oikotie.fi
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Tilaa Uutiskirje</h3>
              <p className="text-sm text-white/80 mb-4">
                Oletko kiinnostunut arvokodeista ja uniikeista kiinteistöistä?
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Sähköpostiosoitteesi"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded
                           text-white placeholder-white/50 text-sm
                           focus:bg-white/20 focus:border-white/40 focus:outline-none
                           transition-colors"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-white text-[#0a2a3d] rounded
                           font-semibold text-sm uppercase tracking-wider
                           hover:bg-white/90 transition-colors"
                >
                  Tilaa
                </button>
                <p className="text-xs text-white/60">
                  Olen tutustunut{' '}
                  <Link href="/tietosuojaseloste" className="underline hover:text-white">
                    Tietosuojaselosteeseen
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar with Copyright and Disclaimer */}
      <div className="bg-[#000e1f] text-white py-6">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <p className="text-sm">
              © {currentYear} Ab Snellman LKV Oy. All rights reserved.
            </p>
            
            <p className="text-xs text-white/60 max-w-5xl mx-auto leading-relaxed">
              Sotheby&apos;s International Realty® and the Sotheby&apos;s International Realty Logo are service marks licensed to Sotheby&apos;s International Realty Affiliates LLC and used with permission.
              Ab Snellman LKV Oy fully supports the principles of the Fair Housing Act and the Equal Opportunity Act. Each office is independently owned and operated.
              Any services or products provided by independently owned and operated franchisees are not provided by, affiliated with or related to Sotheby&apos;s International Realty Affiliates LLC nor any of its affiliated companies.
            </p>
          </div>
        </div>
      </div>

      {/* Go to Top Button */}
      <GoToTopButton />
    </footer>
  );
}