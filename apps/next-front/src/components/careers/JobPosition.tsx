'use client';

import { useState } from 'react';

interface JobPositionProps {
  category: string;
  title: string;
  intro: string;
  description: string;
  requirements: string[];
  reqTitle: string;
  offers: string[];
  offerTitle: string;
  location: string;
  contactName: string;
  contactTitle: string;
  contactPhone: string;
  contactEmail: string;
  forMoreInfo: string;
  contactCta: string;
  applyBtn: string;
  readMore: string;
}

export function JobPosition(props: JobPositionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200">
      <div className="p-8">
        <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">{props.category}</p>
        <h3 className="text-2xl font-light text-gray-900 mb-4">{props.title}</h3>
        <p className="text-gray-700 leading-relaxed mb-4">{props.intro}</p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[#002349] hover:underline font-medium text-sm uppercase tracking-wider"
        >
          {expanded ? '▲ Close' : `▼ ${props.readMore}`}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-200 p-8 bg-gray-50 animate-fadeIn">
          <p className="text-gray-700 leading-relaxed mb-8 whitespace-pre-line">{props.description}</p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">{props.reqTitle}</h4>
              <ul className="space-y-2">
                {props.requirements.map((req, i) => (
                  <li key={i} className="flex items-start text-gray-700 text-sm">
                    <span className="mr-2 mt-1 text-[#002349]">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">{props.offerTitle}</h4>
              <ul className="space-y-2">
                {props.offers.map((offer, i) => (
                  <li key={i} className="flex items-start text-gray-700 text-sm">
                    <span className="mr-2 mt-1 text-[#8e740b]">•</span>
                    <span>{offer}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6">{props.location}</p>

          <div className="bg-white border-l-4 border-[#002349] p-6 mb-6">
            <p className="font-medium text-gray-900 mb-2">{props.forMoreInfo}</p>
            <p className="text-gray-900 font-medium">{props.contactName}</p>
            <p className="text-gray-600 text-sm">{props.contactTitle}</p>
            <p className="text-gray-600 text-sm">{props.contactPhone}</p>
            <a href={`mailto:${props.contactEmail}`} className="text-[#002349] hover:underline text-sm">
              {props.contactEmail}
            </a>
          </div>

          <p className="text-gray-700 mb-4 text-sm">{props.contactCta}</p>
          <a
            href={`mailto:${props.contactEmail}?subject=Application: ${props.title}`}
            className="inline-block bg-[#002349] text-white px-8 py-3 hover:bg-[#001731] transition-colors font-medium uppercase tracking-wider text-sm"
          >
            {props.applyBtn}
          </a>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
