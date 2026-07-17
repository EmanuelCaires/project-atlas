import { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  padding?: "small" | "medium" | "large";
  elevated?: boolean;
};

export default function Card({
  children,
  className = "",
  padding = "medium",
  elevated = false,
  ...props
}: CardProps) {
  const classes = [
    "atlas-card",
    `atlas-card-padding-${padding}`,
    elevated ? "atlas-card-elevated" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes} {...props}>
      {children}
    </section>
  );
}