import { useEffect, useRef, useState } from 'react';

export const useUserCardVisibility = () => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const userCardRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<boolean>(false);

  const handleWindowBlur = () => {
    setTimeout(() => setStatus(false), 350);
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (
      userCardRef.current &&
      !userCardRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setTimeout(() => setStatus(false), 350);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleUserCard = () => {
    if (!status) {
      setTimeout(() => setStatus(true), 0);
    } else {
      setTimeout(() => setStatus(false), 350);
    }
  };

  return {
    isVisible: status,
    isAnimating: status,
    toggleUserCard,
    buttonRef,
    userCardRef,
  };
};
