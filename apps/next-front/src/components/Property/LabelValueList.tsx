import { ReactNode } from 'react';
import clsx from 'clsx';

export interface LabelValueItem {
  label: ReactNode;
  value: ReactNode;
  valueClassName?: string;
  hideIfEmpty?: boolean;
  secondary?: ReactNode;
}

interface LabelValueListProps {
  items: Array<LabelValueItem | undefined | null>;
  placeholder?: string;
  className?: string;
  rowClassName?: string;
}

const isEmpty = (value: ReactNode, placeholder: string) => {
  if (value == null) return true;
  if (typeof value === 'string') {
    return value.trim().length === 0 || value === placeholder;
  }
  return false;
};

export function LabelValueList({ items, placeholder = '—', className, rowClassName }: LabelValueListProps) {
  const rows = (items || []).filter((item): item is LabelValueItem => Boolean(item));

  return (
    <div className={clsx('space-y-2', className)}>
      {rows.map(({ label, value, valueClassName, hideIfEmpty, secondary }) => {
        const displayValue = value == null || (typeof value === 'string' && value.trim().length === 0)
          ? placeholder
          : value;

        if (hideIfEmpty && isEmpty(displayValue, placeholder)) {
          return null;
        }

        const isPlaceholder = isEmpty(displayValue, placeholder);

        return (
          <div key={String(label)} className={clsx('flex flex-col gap-1', rowClassName)}>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">{label}</span>
              <span className={clsx('text-right', valueClassName, isPlaceholder && 'text-gray-400 italic')}>
                {displayValue}
              </span>
            </div>
            {secondary ? <div className="text-right text-sm text-gray-600">{secondary}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
