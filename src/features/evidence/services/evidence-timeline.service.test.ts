import assert from "node:assert/strict";
import { test } from "node:test";
import { buildEvidenceTimeline } from "./evidence-timeline.service";

const project = {
  id: "project-1",
  title: "Atlas",
  created_at: "2026-07-03T12:00:00Z",
  started_at: "2026-07-01",
  completed_at: "2026-07-04",
  github_verified_at: "2026-07-02T12:00:00Z",
};

test("derives all four events with project identity, newest first", () => {
  const events = buildEvidenceTimeline([project]);
  assert.deepEqual(events.map((event) => event.type), [
    "project_completed", "project_added", "repository_confirmed", "project_started",
  ]);
  assert.ok(events.every((event) => event.projectId === project.id && event.projectTitle === project.title));
  assert.equal(new Set(events.map((event) => event.id)).size, 4);
  assert.equal(events[0].date, project.completed_at);
});

test("skips missing, empty and invalid dates", () => {
  assert.deepEqual(buildEvidenceTimeline([]), []);
  assert.deepEqual(buildEvidenceTimeline([{
    ...project, created_at: null, started_at: "", completed_at: "invalid", github_verified_at: null,
  }]), []);
});

test("sorts across projects by timestamp without changing input", () => {
  const projects = Object.freeze([
    Object.freeze(project),
    Object.freeze({ ...project, id: "project-2", created_at: "2026-07-04T01:00:00+02:00" }),
  ]);
  const before = JSON.stringify(projects);
  const events = buildEvidenceTimeline(projects);
  assert.equal(JSON.stringify(projects), before);
  assert.equal(events.length, 8);
  assert.equal(new Set(events.map((event) => event.id)).size, 8);
  assert.ok(events.every((event, index) => index === 0 || Date.parse(events[index - 1].date) >= Date.parse(event.date)));
  assert.deepEqual(buildEvidenceTimeline(projects), events);
});
