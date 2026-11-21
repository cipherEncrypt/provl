export type WatchSchedule = "hourly" | "daily";

export type WatchLastStatus = "done" | "not_done" | "never";

export type WatchRecord = {
  id: string;
  sessionId: string;
  userId: string | null;
  task: string;
  url?: string;
  schedule: WatchSchedule;
  alertEmail: string;
  active: boolean;
  lastStatus: WatchLastStatus;
  lastRunAt: string | null;
  lastProofId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WatchListScope = {
  sessionId: string;
  userId: string | null;
};

export type WatchCreateInput = {
  sessionId: string;
  userId: string | null;
  task: string;
  url?: string;
  schedule: WatchSchedule;
  alertEmail: string;
};

export type WatchUpdateAfterRun = {
  lastStatus: "done" | "not_done";
  lastRunAt: string;
  lastProofId: string;
};