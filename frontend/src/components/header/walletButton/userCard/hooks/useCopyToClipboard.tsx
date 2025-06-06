import { useState } from 'react';

export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (text: `0x${string}` | undefined) => {
    if (text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 3000);
        })
        .catch((err) => console.error('Failed to copy: ', err));
    }
  };

  return { isCopied, handleCopy };
};
