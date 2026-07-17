
import Link from "next/link";
import {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

type ButtonSize = "small" | "medium" | "large";

type BaseProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLink = BaseProps & {
  href: string;
  type?: never;
  disabled?: never;
  onClick?: never;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "medium",
  fullWidth = false,
  ...props
}: ButtonProps) {
  const classes = [
    "atlas-button",
    `atlas-button-${variant}`,
    `atlas-button-${size}`,
    fullWidth ? "atlas-button-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href) {
    return (
      <Link className={classes} href={props.href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}