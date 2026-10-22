import React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Octagon,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../lib/cn';

/* ──────────────────────────────────────────────────────────────────────────
   Status vocabulary.

   Two rules hold across the whole product:
     · Colour never carries meaning on its own — every badge has a word, and
       the risk scale has an icon too.
     · The brand teal occupies the green channel, so "low risk" is quiet
       neutral rather than green. Low risk should not shout.
   ────────────────────────────────────────────────────────────────────────── */

export type BadgeTone =
  | 'neutral'
  | 'brand'
  | 'people'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

const TONES: Record<BadgeTone, string> = {
  neutral: 'text-oat-600 bg-oat-100 border-oat-300',
  brand: 'text-teal-700 bg-teal-50 border-teal-200',
  people: 'text-mulberry-700 bg-mulberry-50 border-mulberry-200',
  success: 'text-green-700 bg-green-50 border-green-200',
  warning: 'text-orange-700 bg-orange-50 border-orange-200',
  danger: 'text-white bg-red-800 border-red-800',
  info: 'text-blue-700 bg-blue-50 border-blue-200',
};

export interface BadgeProps {
  tone?: BadgeTone;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ tone = 'neutral', icon, className, children }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1',
      'text-xs font-semibold whitespace-nowrap',
      TONES[tone],
      className,
    )}
  >
    {icon && <span className="flex-none [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>}
    {children}
  </span>
);

/* ── Clinical risk scale ─────────────────────────────────────────────────── */

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

const RISK: Record<RiskLevel, { label: string; tone: BadgeTone; Icon: LucideIcon }> = {
  low: { label: 'Low', tone: 'neutral', Icon: ShieldCheck },
  medium: { label: 'Medium', tone: 'warning', Icon: AlertCircle },
  high: { label: 'High', tone: 'warning', Icon: AlertTriangle },
  critical: { label: 'Critical', tone: 'danger', Icon: Octagon },
};

// High needs to read as distinct from Medium without reaching for red, which
// Critical owns. Orange-700 for Medium, orange-800 weight for High.
const RISK_OVERRIDE: Partial<Record<RiskLevel, string>> = {
  medium: 'text-orange-700 bg-orange-50 border-orange-200',
  high: 'text-orange-800 bg-orange-100 border-orange-300',
};

export const RiskBadge: React.FC<{ level: RiskLevel; prefix?: string; className?: string }> = ({
  level,
  prefix,
  className,
}) => {
  const { label, tone, Icon } = RISK[level];
  return (
    <Badge tone={tone} icon={<Icon />} className={cn(RISK_OVERRIDE[level], className)}>
      {prefix ? `${prefix} — ${label}` : label}
    </Badge>
  );
};

/* ── Assessment lifecycle ────────────────────────────────────────────────── */

export type AssessmentStatus = 'draft' | 'in_progress' | 'awaiting_signoff' | 'complete';

const STATUS: Record<AssessmentStatus, { label: string; tone: BadgeTone }> = {
  draft: { label: 'Draft', tone: 'neutral' },
  in_progress: { label: 'In progress', tone: 'brand' },
  awaiting_signoff: { label: 'Awaiting sign-off', tone: 'warning' },
  complete: { label: 'Complete', tone: 'success' },
};

export const StatusBadge: React.FC<{ status: string; className?: string }> = ({
  status,
  className,
}) => {
  const key = (status || 'draft').toLowerCase().replace(/[\s-]+/g, '_') as AssessmentStatus;
  const entry = STATUS[key] ?? { label: status || 'Draft', tone: 'neutral' as BadgeTone };
  return (
    <Badge
      tone={entry.tone}
      icon={entry.tone === 'success' ? <CheckCircle2 /> : undefined}
      className={className}
    >
      {entry.label}
    </Badge>
  );
};
