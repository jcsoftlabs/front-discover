'use client';

import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | Discover Haiti`;
    
    return () => {
      document.title = 'Discover Haiti - Tourisme en Haïti';
    };
  }, [title]);
}
