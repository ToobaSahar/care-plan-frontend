import React, { forwardRef, useId } from 'react';
import { cn } from '../../lib/cn';

/* ──────────────────────────────────────────────────────────────────────────
   Form field anatomy.

   One shape for every input in the assessment: label, optional hint, control,
   error. The eleven section forms all route through this, which is what keeps
   their spacing and states identical without each one re-deciding.
   ────────────────────────────────────────────────────────────────────────── */

const CONTROL_BASE =
  'block w-full bg-white text-oat-900 border rounded-md transition-shadow duration-fast ease-out ' +
  'placeholder:text-oat-500 ' +
  'focus:outline-none focus:border-teal-600 focus:shadow-focus ' +
  'disabled:bg-oat-100 disabled:text-oat-500 disabled:cursor-not-allowed ' +
  'read-only:bg-oat-50';

const CONTROL_SIZE = 'text-md px-3 py-2.5';

function controlClasses(invalid?: boolean, extra?: string) {
  return cn(
    CONTROL_BASE,
    CONTROL_SIZE,
    invalid ? 'border-red-700 focus:border-red-700' : 'border-oat-300',
    extra,
  );
}

export interface FieldProps {
  label: string;
  /** Marks the control required and renders the indicator. */
  required?: boolean;
  /** Guidance shown under the label, before the control is touched. */
  hint?: string;
  /** Replaces the hint when present and marks the control invalid. */
  error?: string;
  /** Spans both columns of a two-column grid. */
  wide?: boolean;
  className?: string;
  children: (props: {
    id: string;
    'aria-describedby': string | undefined;
    'aria-invalid': boolean | undefined;
  }) => React.ReactNode;
}

/**
 * Wraps a control with its label, hint and error.
 *
 * Takes a render prop so the generated id and ARIA wiring reach the control
 * itself rather than being guessed by the caller.
 */
export const Field: React.FC<FieldProps> = ({
  label,
  required,
  hint,
  error,
  wide,
  className,
  children,
}) => {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', wide && 'md:col-span-2', className)}>
      <label htmlFor={id} className="text-sm font-medium text-oat-800">
        {label}
        {required && (
          <span className="ml-0.5 text-red-700" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
      })}

      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-oat-600">
          {hint}
        </p>
      ) : null}
    </div>
  );
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, className, ...rest },
  ref,
) {
  return <input ref={ref} className={controlClasses(invalid, className)} {...rest} />;
});

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, rows = 3, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={controlClasses(invalid, cn('resize-y leading-6', className))}
      {...rest}
    />
  );
});

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid, className, children, ...rest },
  ref,
) {
  return (
    <select ref={ref} className={controlClasses(invalid, cn('pr-9', className))} {...rest}>
      {children}
    </select>
  );
});

/** Read-only presentation of an answered field, used by every section's review mode. */
export const ReadField: React.FC<{ label: string; value?: React.ReactNode; wide?: boolean }> = ({
  label,
  value,
  wide,
}) => (
  <div className={cn('flex flex-col gap-1', wide && 'md:col-span-2')}>
    <span className="text-sm font-medium text-oat-800">{label}</span>
    <span className={cn('text-base', value ? 'text-oat-900' : 'text-oat-500 italic')}>
      {value || 'Not provided'}
    </span>
  </div>
);

/** The two-column grid every section's fields sit in. Collapses to one on tablet. */
export const FieldGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={cn('grid grid-cols-1 gap-5 md:grid-cols-2', className)}>{children}</div>;
