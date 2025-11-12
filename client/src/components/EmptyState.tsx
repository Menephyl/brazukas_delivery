/**
 * Brazukas Delivery - EmptyState Component
 * Componente para exibir estados vazios com ilustrações e CTAs
 */

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
}: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-border p-12 text-center animate-fade-in">
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          {action.label}
        </button>
      )}
      {children}
    </div>
  );
}
