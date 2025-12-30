'use client';

import React from 'react';

type Variant = 'cyan' | 'violet' | 'ghost' | 'secondary' | 'danger' | 'dash';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}

export function Button({
  variant = 'cyan',
  size = 'md',
  block = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const variantClass = {
    cyan: 'btn-cyan',
    violet: 'btn-violet',
    ghost: 'btn-ghost',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    dash: 'btn-dash',
  }[variant];

  const sizeClass = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  }[size];

  const widthClass = block ? 'w-full' : '';

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${widthClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;

