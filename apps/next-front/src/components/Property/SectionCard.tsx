import { ReactNode } from 'react';
import clsx from 'clsx';

interface SectionCardProps {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function SectionCard({ title, children, className, bodyClassName }: SectionCardProps) {
  const content = bodyClassName ? (
    <div className={bodyClassName}>{children}</div>
  ) : (
    <>{children}</>
  );

  return (
    <div className={clsx('bg-white rounded-lg shadow-sm p-6', className)}>
      {title ? (
        <h3 className="text-xl font-light mb-4">{title}</h3>
      ) : null}
      {content}
    </div>
  );
}
