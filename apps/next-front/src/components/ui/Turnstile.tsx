'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

export function Turnstile({ siteKey, onVerify, onExpire }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !window.turnstile || widgetIdRef.current) return;
    
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: onVerify,
      'expired-callback': onExpire,
      theme: 'light',
      size: 'normal',
    });
  }, [siteKey, onVerify, onExpire]);

  useEffect(() => {
    if (window.turnstile) {
      setLoaded(true);
      renderWidget();
      return;
    }

    window.onTurnstileLoad = () => {
      setLoaded(true);
      renderWidget();
    };

    const existing = document.querySelector('script[src*="turnstile"]');
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
      script.async = true;
      document.head.appendChild(script);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [renderWidget]);

  useEffect(() => {
    if (loaded) renderWidget();
  }, [loaded, renderWidget]);

  return <div ref={containerRef} />;
}
