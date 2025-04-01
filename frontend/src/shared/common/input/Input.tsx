import { ChangeEvent } from 'react';
import styles from './input.module.css';

interface InputProps {
  customContainerClass?: string;
  customInputClass?: string;
  customPlaceholderClass?: string;
  customCutClass?: string;
  value: string;
  onValueChange: (value: string) => void;
}

export default function Input({
  value,
  onValueChange,
  customContainerClass = '',
  customInputClass = '',
  customPlaceholderClass = '',
  customCutClass = '',
}: InputProps) {
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(',', '.');
    const regex = /^\d*\.?\d*$/;
    if (regex.test(newValue)) {
      onValueChange(newValue);
    }
  };
  return (
    <div className={customContainerClass || styles.inputContainer}>
      <input
        id='lastname'
        className={customInputClass || styles.input}
        type='text'
        placeholder=' '
        autoComplete='off'
        value={value}
        onChange={handleValueChange}
      />
      <div className={customCutClass || styles.cut}></div>
      <label
        htmlFor='lastname'
        className={customPlaceholderClass || styles.placeholder}
      >
        Enter value
      </label>
    </div>
  );
}
