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
    label: "GitHub evidence",
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

function getEvidenceLabel(
  key: keyof EvidenceBreakdownValues,
  earned: number,
) {
  if (key !== "github") {
    return BREAKDOWN_ITEMS.find((item) => item.key === key)?.label ?? key;
  }

  if (earned >= EVIDENCE_POINTS.GITHUB) {
    return "Verified GitHub repository";
  }

  if (earned >= EVIDENCE_POINTS.GITHUB_UNVERIFIED) {
    return "GitHub URL added";
  }

  return "GitHub repository";
}

function getStatusSymbol(
  key: keyof EvidenceBreakdownValues,
  earned: number,
  maximum: number,
) {
  if (earned === maximum) {
    return "✓";
  }

  if (
    key === "github" &&
    earned === EVIDENCE_POINTS.GITHUB_UNVERIFIED
  ) {
    return "◐";
  }

  return "○";
}

export default function EvidenceBreakdown({
  score,
  breakdown,
}: EvidenceBreakdownProps) {
  return (
    <details className="evidence-breakdown">
      <summary>
        <span>Why this score?</span>
        <strong>{score}/100</strong>
      </summary>

      <div className="evidence-breakdown-list">
        {BREAKDOWN_ITEMS.map((item) => {
          const earned = breakdown[item.key];
          const label = getEvidenceLabel(item.key, earned);
          const symbol = getStatusSymbol(
            item.key,
            earned,
            item.maximum,
          );

          return (
            <div
              className="evidence-breakdown-item"
              key={item.key}
            >
              <span>
                <span aria-hidden="true">
                  {symbol}
                </span>{" "}
                {label}
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