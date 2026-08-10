import type {
  ApplicationStatus,
  JobApplication,
} from "./jobApplication";

const DAY_IN_MS = 86_400_000;

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

export interface ApplicationStats {
  totalApplications: number;
  appliedLast30Days: number;
  reachedInterview: number;
  offersReceived: number;
  averageDaysInCurrentStatus: number | null;
  durationSampleSize: number;
  currentStatusCounts: Array<{
    status: ApplicationStatus;
    count: number;
    percentage: number;
  }>;
  topCities: Array<{ city: string; count: number }>;
  historyCoverage: {
    tracked: number;
    total: number;
    percentage: number;
  };
}

function percentage(value: number, total: number): number {
  return total === 0 ? 0 : Math.round((value / total) * 100);
}

export function calculateApplicationStats(
  applications: JobApplication[],
  now: Date,
): ApplicationStats {
  const statusCounts = new Map(
    APPLICATION_STATUSES.map((status) => [status, 0]),
  );
  const cities = new Map<string, { city: string; count: number }>();
  const nowTime = now.getTime();
  const todayUtc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  let appliedLast30Days = 0;
  let reachedInterview = 0;
  let offersReceived = 0;
  let historyTracked = 0;
  let durationTotal = 0;
  let durationSampleSize = 0;

  for (const application of applications) {
    statusCounts.set(
      application.status,
      (statusCounts.get(application.status) ?? 0) + 1,
    );

    const appliedTime = Date.parse(`${application.appliedAt}T00:00:00Z`);
    const daysSinceApplied = Math.floor((todayUtc - appliedTime) / DAY_IN_MS);
    if (Number.isFinite(appliedTime) && daysSinceApplied >= 0 && daysSinceApplied < 30) {
      appliedLast30Days += 1;
    }

    const city = application.city?.trim();
    if (city) {
      const key = city.toLocaleLowerCase("it-IT");
      const entry = cities.get(key);
      cities.set(key, { city: entry?.city ?? city, count: (entry?.count ?? 0) + 1 });
    }

    const history = application.statusHistory ?? [];
    if (history.length > 0) historyTracked += 1;

    const reachedStatuses = new Set<ApplicationStatus>([application.status]);
    let currentStatusStartedAt: number | null = null;

    for (const transition of history) {
      reachedStatuses.add(transition.status);
      if (transition.status !== application.status) continue;

      const changedAt = Date.parse(transition.changedAt);
      if (
        Number.isFinite(changedAt) &&
        changedAt <= nowTime &&
        (currentStatusStartedAt === null || changedAt > currentStatusStartedAt)
      ) {
        currentStatusStartedAt = changedAt;
      }
    }

    if (reachedStatuses.has("INTERVIEW") || reachedStatuses.has("OFFER")) {
      reachedInterview += 1;
    }
    if (reachedStatuses.has("OFFER")) offersReceived += 1;

    if (currentStatusStartedAt !== null) {
      durationTotal += (nowTime - currentStatusStartedAt) / DAY_IN_MS;
      durationSampleSize += 1;
    }
  }

  const totalApplications = applications.length;

  return {
    totalApplications,
    appliedLast30Days,
    reachedInterview,
    offersReceived,
    averageDaysInCurrentStatus:
      durationSampleSize === 0
        ? null
        : Math.round((durationTotal / durationSampleSize) * 10) / 10,
    durationSampleSize,
    currentStatusCounts: APPLICATION_STATUSES.map((status) => {
      const count = statusCounts.get(status) ?? 0;
      return { status, count, percentage: percentage(count, totalApplications) };
    }),
    topCities: [...cities.values()]
      .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city, "it"))
      .slice(0, 5),
    historyCoverage: {
      tracked: historyTracked,
      total: totalApplications,
      percentage: percentage(historyTracked, totalApplications),
    },
  };
}
