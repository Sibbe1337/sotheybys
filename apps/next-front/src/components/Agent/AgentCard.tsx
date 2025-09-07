import Image from 'next/image';
import { Agent } from '@/lib/wordpress';

interface AgentCardProps {
  agent: Agent;
  className?: string;
}

export default function AgentCard({ agent, className = '' }: AgentCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Agent Photo */}
      {agent.photo && (
        <div className="flex justify-center mb-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden">
            <Image
              src={agent.photo.sourceUrl}
              alt={agent.photo.altText || agent.name || 'Agent photo'}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Agent Name */}
      {agent.name && (
        <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
          {agent.name}
        </h3>
      )}

      {/* Contact Information */}
      <div className="space-y-2 mb-4">
        {agent.phone && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">📞</span>
            <a
              href={`tel:${agent.phone}`}
              className="text-primary-600 hover:text-primary-700 transition-colors"
            >
              {agent.phone}
            </a>
          </div>
        )}
        
        {agent.email && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">✉️</span>
            <a
              href={`mailto:${agent.email}`}
              className="text-primary-600 hover:text-primary-700 transition-colors"
            >
              {agent.email}
            </a>
          </div>
        )}
      </div>

      {/* Agent Bio */}
      {agent.bio && (
        <div className="text-sm text-gray-600 leading-relaxed">
          <div 
            dangerouslySetInnerHTML={{ __html: agent.bio }}
            className="prose prose-sm max-w-none"
          />
        </div>
      )}
    </div>
  );
} 