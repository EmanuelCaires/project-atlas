import { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export default function SectionHeader({
  title,
  eyebrow,
  description,
  action,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`atlas-section-header ${className}`}>
      <div className="atlas-section-heading">
        {eyebrow && (
          <p className="atlas-section-eyebrow">{eyebrow}</p>
        )}

        <h2>{title}</h2>

        {description && (
          <p className="atlas-section-description">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="atlas-section-action">
          {action}
        </div>
      )}
    </div>
  );
}