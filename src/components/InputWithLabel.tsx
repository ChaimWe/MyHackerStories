import React from 'react';
import styles from '../styles/InputWithLabel.module.css';


interface InputWithLabelProps {
  id: string;
  value: string;
  type?: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isFocused?: boolean;
  placeholder?: string;
  children: React.ReactNode;
};

const InputWithLabel: React.FC<InputWithLabelProps> = ({
  id,
  children,
  type = 'text',
  value,
  isFocused,
  placeholder,
  onInputChange,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <div className={styles.search}>
      <label  htmlFor={id}>
        {children}
      </label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onInputChange}
      />
    </div>
  );
};

export default InputWithLabel;