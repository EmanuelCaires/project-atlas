type SkillBadgeProps = {
  name: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

export default function SkillBadge({
  name,
  selected = false,
  onClick,
  disabled = false,
}: SkillBadgeProps) {
  const className = selected
    ? "skill-badge skill-badge-selected"
    : "skill-badge";

  if (onClick) {
    return (
      <button
        aria-pressed={selected}
        className={className}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        {selected ? "✓ " : ""}
        {name}
      </button>
    );
  }

  return <span className={className}>{name}</span>;
}