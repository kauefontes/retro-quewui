import React, { forwardRef, useState } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import { useInputStyles } from '../../../styles/components/Input.styles';

// Input Props
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input size variant */
  size?: 'small' | 'medium' | 'large';
  /** Error state */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Optional label */
  label?: React.ReactNode;
  /** Whether input is in a group (affects border radius) */
  inGroup?: boolean;
}

// TextArea Props  
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** TextArea size variant */
  size?: 'small' | 'medium' | 'large';
  /** Error state */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Optional label */
  label?: React.ReactNode;
}

// Input Field Wrapper Props
interface InputFieldProps extends InputProps {
  /** Field wrapper className */
  wrapperClassName?: string;
}

/**
 * Styled Input Component
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  size = 'medium',
  error = false,
  className = '',
  disabled,
  inGroup = false,
  ...props
}, ref) => {
  const { theme } = useTheme();
  const styles = useInputStyles(theme);
  const [isFocused, setIsFocused] = useState(false);

  const inputStyle = {
    ...styles.base,
    ...styles[size],
    ...(isFocused ? styles.focus : {}),
    ...(error ? styles.error : {}),
    ...(disabled ? styles.disabled : {}),
    ...(inGroup ? styles.inputGroupInput : {}),
  };

  return (
    <input
      ref={ref}
      style={inputStyle}
      className={className}
      disabled={disabled}
      onFocus={(e) => {
        setIsFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        props.onBlur?.(e);
      }}
      {...props}
    />
  );
});

Input.displayName = 'Input';

/**
 * Styled TextArea Component
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  size = 'medium', 
  error = false,
  className = '',
  disabled,
  ...props
}, ref) => {
  const { theme } = useTheme();
  const styles = useInputStyles(theme);
  const [isFocused, setIsFocused] = useState(false);

  const textareaStyle = {
    ...styles.base,
    ...styles.textarea,
    ...styles[size],
    ...(isFocused ? styles.focus : {}),
    ...(error ? styles.error : {}),
    ...(disabled ? styles.disabled : {}),
  };

  return (
    <textarea
      ref={ref}
      style={textareaStyle}
      className={className}
      disabled={disabled}
      onFocus={(e) => {
        setIsFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        props.onBlur?.(e);
      }}
      {...props}
    />
  );
});

TextArea.displayName = 'TextArea';

/**
 * Complete Input Field with Label and Error Message
 */
export const InputField: React.FC<InputFieldProps> = ({
  label,
  errorMessage,
  error,
  wrapperClassName = '',
  ...inputProps
}) => {
  const { theme } = useTheme();
  const styles = useInputStyles(theme);

  return (
    <div style={styles.fieldWrapper} className={wrapperClassName}>
      {label && (
        <label style={styles.label} htmlFor={inputProps.id}>
          {label}
        </label>
      )}
      <Input error={error || !!errorMessage} {...inputProps} />
      {errorMessage && (
        <div style={styles.errorMessage}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

/**
 * Complete TextArea Field with Label and Error Message
 */
export const TextAreaField: React.FC<TextAreaProps & { 
  wrapperClassName?: string;
}> = ({
  label,
  errorMessage,
  error,
  wrapperClassName = '',
  ...textareaProps
}) => {
  const { theme } = useTheme();
  const styles = useInputStyles(theme);

  return (
    <div style={styles.fieldWrapper} className={wrapperClassName}>
      {label && (
        <label style={styles.label} htmlFor={textareaProps.id}>
          {label}
        </label>
      )}
      <TextArea error={error || !!errorMessage} {...textareaProps} />
      {errorMessage && (
        <div style={styles.errorMessage}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

/**
 * Input Group - Input with attached button
 */
interface InputGroupProps {
  children: [React.ReactElement, React.ReactElement];
  className?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({ 
  children, 
  className = '' 
}) => {
  const { theme } = useTheme();
  const styles = useInputStyles(theme);

  const [inputElement, buttonElement] = children;

  const inputWithGroupProps = React.cloneElement(inputElement, {
    inGroup: true,
  });

  const buttonWithGroupStyles = React.cloneElement(buttonElement, {
    style: {
      ...buttonElement.props.style,
      ...styles.inputGroupButton,
    },
  });

  return (
    <div style={styles.inputGroup} className={className}>
      {inputWithGroupProps}
      {buttonWithGroupStyles}
    </div>
  );
};