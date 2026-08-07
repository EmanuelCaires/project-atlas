import { EVIDENCE_POINTS } from "../constants";
import type { EvidenceBreakdown as EvidenceBreakdownValues } from "../types";

type EvidenceBreakdownProps = {
  score: number;
  breakdown: EvidenceBreakdownValues;
};

const BREAKDOWN_ITEMS: Array<{
  key: keyof EvidenceBreakdownValues;
  label: string;
  maximum: number;
}> = [
  {
    key: "project",
    label: "Project created",
    maximum: EVIDENCE_POINTS.PROJECT,
  },
  {
    key: "description",
    label: "Description",
    maximum: EVIDENCE_POINTS.DESCRIPTION,
  },
  {
    key: "github",
    label: "GitHub repository",
    maximum: EVIDENCE_POINTS.GITHUB,
  },
  {
    key: "liveDemo",
    label: "Live demo",
    maximum: EVIDENCE_POINTS.LIVE_DEMO,
  },
  {
    key: "screenshot",
    label: "Screenshot",
    maximum: EVIDENCE_POINTS.SCREENSHOT,
  },
  {
    key: "skills",
    label: "Linked skills",
    maximum: EVIDENCE_POINTS.SKILLS,
  },
  {
    key: "featured",
    label: "Featured project",
    maximum: EVIDENCE_POINTS.FEATURED,
  },
  {
    key: "completed",
    label: "Completed project",
    maximum: EVIDENCE_POINTS.COMPLETED,
  },
];

export default function EvidenceBreakdown({
  score,
  breakdown,
}: EvidenceBreakdownProps) {
  return (
    <details className="evidence-breakdown">
      <summary>
        View evidence breakdown
        <span>{score}/100</span>
      </summary>

      <div className="evidence-breakdown-list">
        {BREAKDOWN_ITEMS.map((item) => {
          const earned = breakdown[item.key];
          const completed = earned > 0;

          return (
            <div className="evidence-breakdown-item" key={item.key}>
              <span>
                <span aria-hidden="true">
                  {completed ? "✓" : "○"}
                </span>{" "}
                {item.label}
              </span>

              <strong>
                {earned}/{item.maximum}
              </strong>
            </div>
          );
        })}
      </div>
    </details>
  );
}