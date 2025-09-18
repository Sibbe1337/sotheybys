import Image from 'next/image';
import Link from 'next/link';
import { Agent } from '@/lib/wordpress';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';

interface AgentCardProps {
  agent: Agent;
  className?: string;
}

export default function AgentCard({ agent, className = '' }: AgentCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 card transition-all duration-200 hover:shadow-lg ${className}`}>
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
        <Heading as="h3" className="text-center mb-2 text-xl">
          {agent.name}
        </Heading>
      )}

      {/* Contact Information */}
      <div className="space-y-2 mb-4">
        {agent.phone && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">📞</span>
            <a
              href={`tel:${agent.phone}`}
              className="text-[var(--brand-blue)] hover:underline transition-colors"
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
              className="text-[var(--brand-blue)] hover:underline transition-colors"
            >
              {agent.email}
            </a>
          </div>
        )}
      </div>

      {/* Agent Bio */}
      {agent.bio && (
        <div className="text-sm text-gray-600 leading-relaxed mb-4">
          <div 
            dangerouslySetInnerHTML={{ __html: agent.bio }}
            className="prose prose-sm max-w-none"
          />
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mt-auto pt-4 border-t">
        {agent.phone && (
          <Button 
            variant="primary" 
            className="w-full"
            onClick={() => window.location.href = `tel:${agent.phone}`}
          >
            Soita
          </Button>
        )}
        {agent.email && (
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => window.location.href = `mailto:${agent.email}`}
          >
            Lähetä viesti
          </Button>
        )}
        {/* TODO: Add agent detail page link when available
        <Button 
          variant="link" 
          className="w-full"
        >
          Katso kohteet
        </Button>
        */}
      </div>
    </div>
  );
} 