'use client';

import { useEffect } from 'react';

interface BodyClassProps {
  className: string;
}

export default function BodyClass({ className }: BodyClassProps) {
  useEffect(() => {
    const tokens = className.split(/\s+/).filter(Boolean);
    if (tokens.length > 0) {
      document.body.classList.add(...tokens);
    }
    return () => {
      if (tokens.length > 0) {
        document.body.classList.remove(...tokens);
      }
    };
  }, [className]);
  
  return null;
}

