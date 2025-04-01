import { useEffect, useRef, useState } from 'react';

export const useUserCardVisibility = () => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const userCardRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleWindowBlur = () => {
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 350);
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (
      userCardRef.current &&
      !userCardRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 350);
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
    if (!isVisible) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 0);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 350);
    }
  };

  return {
    isVisible,
    isAnimating,
    toggleUserCard,
    buttonRef,
    userCardRef,
  };
};
