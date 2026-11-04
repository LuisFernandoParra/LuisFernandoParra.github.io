import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost';

const base =
  'inline-flex items-center justify-center gap-2 border px-4 py-2 font-mono text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'border-accent bg-accent text-bg hover:bg-hi hover:border-hi',
  ghost: 'border-line bg-panel text-hi hover:border-accent hover:text-accent',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({
  variant = 'ghost',
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return <button type={type} className={`${base} ${variants[variant]} ${className}`} {...rest} />;
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  children: ReactNode;
}

export function ButtonLink({ variant = 'ghost', className = '', ...rest }: ButtonLinkProps) {
  return <a className={`${base} no-underline ${variants[variant]} ${className}`} {...rest} />;
}
