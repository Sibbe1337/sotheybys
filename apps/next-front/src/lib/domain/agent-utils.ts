import { log } from '@/lib/logger';

/**
 * Validate email address
 */
export function isValidEmail(email: string | undefined): boolean {
  if (!email) return false;
  return /^\S+@\S+\.\S+$/.test(email);
}

/**
 * Clean and validate agent data
 */
export function cleanAgentData(agent: any): {
  name?: string;
  phone?: string;
  email?: string;
  photoUrl?: string;
  title?: string;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  // Validate email (Fluxio case: sometimes URL instead of email)
  let cleanEmail: string | undefined;
  if (agent?.email) {
    if (isValidEmail(agent.email)) {
      cleanEmail = agent.email;
    } else if (agent.email.startsWith('http')) {
      log('⚠️ Agent email is URL:', agent.email);
      warnings.push(`Invalid email (URL): ${agent.email}`);
    } else {
      log('⚠️ Invalid agent email:', agent.email);
      warnings.push(`Invalid email format: ${agent.email}`);
    }
  }
  
  return {
    name: agent?.name || undefined,
    phone: agent?.phone || undefined,
    email: cleanEmail,
    photoUrl: agent?.photoUrl || agent?.avatar || undefined,
    title: agent?.title || agent?.jobTitle || undefined,
    warnings
  };
}

