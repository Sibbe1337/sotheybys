/**
 * Global Not Found Page
 * 
 * ⚠️ This page doesn't have locale context (not under [locale] route)
 * Therefore we CANNOT use:
 * - next-intl Link
 * - useTranslations
 * - Any locale-aware components
 * 
 * Keep it simple with plain <a> tags
 */
export default function GlobalNotFound() {
  return (
    <html lang="fi">
      <body>
        <div className="min-h-screen flex flex-col bg-white">
          <main className="flex-1 flex items-center justify-center px-4">
            <div className="text-center max-w-2xl mx-auto">
              {/* 404 Icon */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gray-100">
                  <svg 
                    className="w-16 h-16 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
              </div>

              {/* Error Message */}
              <h1 className="text-6xl lg:text-7xl font-thin text-gray-900 mb-4">
                404
              </h1>
              <h2 className="text-2xl lg:text-3xl font-light text-gray-700 mb-6">
                Sivua ei löytynyt / Page not found
              </h2>
              <p className="text-lg text-gray-600 font-light mb-12 leading-relaxed">
                Valitettavasti etsimääsi sivua ei löydy. / Unfortunately the page you're looking for cannot be found.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/fi"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 
                           bg-[#1a3a4a] text-white hover:bg-[#0f2633] 
                           transition-colors duration-300 font-light tracking-wider uppercase text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Etusivulle / Home
                </a>
                
                <a
                  href="/fi/kohteet"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 
                           border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white 
                           transition-colors duration-300 font-light tracking-wider uppercase text-sm"
                >
                  Selaa kohteita / Browse properties
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}