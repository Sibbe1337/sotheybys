import { useTranslations } from 'next-intl';

export function useT(ns?: string) {
  const t = useTranslations(ns);
  return (key: string, params?: Record<string, any>) => t(key, params);
}

// Server-side translator
export function createTranslator(messages: Record<string, any>, locale: string) {
  return (key: string, params?: Record<string, any>) => {
    let message = messages[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        message = message.replace(`{${k}}`, String(v));
      });
    }
    
    return message;
  };
}

