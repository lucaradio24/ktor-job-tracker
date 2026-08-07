import assert from "node:assert/strict";
import test from "node:test";
import { calculateApplicationStats } from "./applicationStats.ts";
import type { JobApplication } from "./jobApplication.ts";

const now = new Date("2026-08-07T12:00:00.000Z");

function application(
  overrides: Partial<JobApplication> = {},
): JobApplication {
  return {
    id: "application-1",
    company: "Acme",
    title: "Product designer",
    status: "APPLIED",
    appliedAt: "2026-08-01",
    statusHistory: [],
    ...overrides,
  };
}

test("handles an empty dataset without invalid percentages or durations", () => {
  const stats = calculateApplicationStats([], now);

  assert.equal(stats.totalApplications, 0);
  assert.equal(stats.averageDaysInCurrentStatus, null);
  assert.equal(stats.historyCoverage.percentage, 0);
  assert.ok(stats.currentStatusCounts.every(({ percentage }) => percentage === 0));
});

test("keeps legacy records in current and funnel counts without inventing time", () => {
  const stats = calculateApplicationStats(
    [application({ status: "INTERVIEW", city: "  " })],
    now,
  );

  assert.equal(stats.reachedInterview, 1);
  assert.equal(stats.offersReceived, 0);
  assert.equal(stats.durationSampleSize, 0);
  assert.equal(stats.averageDaysInCurrentStatus, null);
  assert.deepEqual(stats.topCities, []);
});

test("counts each application once across a complete status path", () => {
  const stats = calculateApplicationStats(
    [
      application({
        city: "Milano",
        status: "OFFER",
        statusHistory: [
          { status: "APPLIED", changedAt: "2026-07-01T10:00:00.000Z" },
          { status: "INTERVIEW", changedAt: "2026-07-15T10:00:00.000Z" },
          { status: "OFFER", changedAt: "2026-08-02T12:00:00.000Z" },
        ],
      }),
      application({
        id: "application-2",
        city: "milano",
        status: "REJECTED",
        statusHistory: [
          { status: "APPLIED", changedAt: "2026-06-01T10:00:00.000Z" },
          { status: "INTERVIEW", changedAt: "2026-06-10T10:00:00.000Z" },
          { status: "REJECTED", changedAt: "2026-06-20T10:00:00.000Z" },
        ],
      }),
    ],
    now,
  );

  assert.equal(stats.reachedInterview, 2);
  assert.equal(stats.offersReceived, 1);
  assert.equal(stats.historyCoverage.tracked, 2);
  assert.equal(stats.durationSampleSize, 2);
  assert.deepEqual(stats.topCities, [{ city: "Milano", count: 2 }]);
});

test("uses the last 30 calendar days and excludes empty cities", () => {
  const stats = calculateApplicationStats(
    [
      application({ appliedAt: "2026-07-09", city: null }),
      application({ id: "application-2", appliedAt: "2026-07-08", city: "Roma" }),
      application({ id: "application-3", appliedAt: "2026-08-08", city: "" }),
    ],
    now,
  );

  assert.equal(stats.appliedLast30Days, 1);
  assert.deepEqual(stats.topCities, [{ city: "Roma", count: 1 }]);
});
