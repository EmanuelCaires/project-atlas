import type { ReactNode } from "react";

type PassportSectionProps = {
  kicker: string;
  heading: ReactNode;
  action?: ReactNode;
  children: ReactNode;
};

export default function PassportSection({
  kicker,
  heading,
  action,
  children,
}: PassportSectionProps) {
  return (
    <section className="profile-section">
      <div className="profile-section-header">
        <div>
          <p className="dashboard-kicker">{kicker}</p>
          <h2>{heading}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
