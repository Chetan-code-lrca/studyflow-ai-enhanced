export type StudyFlowSubject = {
  id: string;
  name: string;
  color: string;
  studiedHours: number;
  targetHours: number;
  lastStudied?: Date;
};

export type StudyFlowAssignment = {
  id: string;
  title: string;
  subject: string;
  deadline: Date;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
};

export type StudyFlowSession = {
  id: string;
  subjectId: string;
  subjectName: string;
  duration: number;
  date: Date;
};

export type StudyFlowState = {
  subjects: StudyFlowSubject[];
  assignments: StudyFlowAssignment[];
  studySessions: StudyFlowSession[];
};

export function loadStudyFlowState(storage: Storage | null): StudyFlowState;
export function saveStudyFlowCollection(
  storage: Storage | null,
  key: string,
  value: unknown,
): boolean;
export function getStudyFlowStorage(): Storage | null;
export const STORAGE_KEYS: {
  subjects: "studyflow_subjects";
  assignments: "studyflow_assignments";
  sessions: "studyflow_sessions";
};
