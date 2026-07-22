import { useEffect, useState } from 'react';

export function useTheme() {
  const [tema, setTema] = useState<'dark' | 'light'>(() => {
    const salvo = localStorage.getItem('tema');
    return salvo === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    const html = document.documentElement;
    if (tema === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('tema', tema);
  }, [tema]);

  function alternarTema() {
    setTema((atual) => (atual === 'dark' ? 'light' : 'dark'));
  }

  return { tema, alternarTema };
}