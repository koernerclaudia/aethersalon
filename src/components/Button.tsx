import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'sm' | 'md';
  to?: string;
  href?: string;
  className?: string;
  children?: React.ReactNode;
  target?: string;
  rel?: string;
};

const Button: React.FC<ButtonProps> = ({
  size = 'md',
  to,
  href,
  className = '',
  children,
  target,
  rel,
  ...rest
}) => {
  const sizeClass = size === 'sm' ? 'btn-sm' : 'btn';
  const cls = `${sizeClass} ${className}`.trim();

  if (to) {
    return (
      <RouterLink to={to} className={cls} {...(rest as any)}>
        {children}
      </RouterLink>
    );
  }

  if (href) {
    return (
      <a href={href} className={cls} target={target} rel={rel} {...(rest as any)}>
        {children}
      </a>
    );
  }

  return (
    <button className={cls} {...(rest as any)}>
      {children}
    </button>
  );
};

export default Button;
