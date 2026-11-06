const STORAGE_KEYS = {
  subjects: "studyflow_subjects",
  assignments: "studyflow_assignments",
  sessions: "studyflow_sessions",
};

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validDate(value) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
}

function readArray(storage, key, validate) {
  if (!storage) return [];
  try {
    const raw = storage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(validate).filter((item) => item !== null);
  } catch {
    return [];
  }
}

function validateSubject(value) {
  if (!isRecord(value) || typeof value.id !== "string" ||
      typeof value.name !== "string" || typeof value.color !== "string" ||
      !Number.isFinite(value.studiedHours) || value.studiedHours < 0 ||
      !Number.isFinite(value.targetHours) || value.targetHours <= 0) {
    return null;
  }

  const lastStudied = value.lastStudied ? validDate(value.lastStudied) : null;
  return {
    id: value.id,
    name: value.name,
    color: value.color,
    studiedHours: value.studiedHours,
    targetHours: value.targetHours,
    ...(lastStudied ? { lastStudied } : {}),
  };
}

function validateAssignment(value) {
  if (!isRecord(value) || typeof value.id !== "string" ||
      typeof value.title !== "string" || typeof value.subject !== "string" ||
      typeof value.completed !== "boolean" ||
      !["High", "Medium", "Low"].includes(value.priority)) {
    return null;
  }

  const deadline = validDate(value.deadline);
  if (!deadline) return null;
  return {
    id: value.id,
    title: value.title,
    subject: value.subject,
    deadline,
    priority: value.priority,
    completed: value.completed,
  };
}

function validateSession(value) {
  if (!isRecord(value) || typeof value.id !== "string" ||
      typeof value.subjectId !== "string" || typeof value.subjectName !== "string" ||
      !Number.isFinite(value.duration) || value.duration <= 0) {
    return null;
  }

  const date = validDate(value.date);
  if (!date) return null;
  return {
    id: value.id,
    subjectId: value.subjectId,
    subjectName: value.subjectName,
    duration: value.duration,
    date,
  };
}

export function loadStudyFlowState(storage) {
  return {
    subjects: readArray(storage, STORAGE_KEYS.subjects, validateSubject),
    assignments: readArray(storage, STORAGE_KEYS.assignments, validateAssignment),
    studySessions: readArray(storage, STORAGE_KEYS.sessions, validateSession),
  };
}

export function saveStudyFlowCollection(storage, key, value) {
  if (!storage || !Object.values(STORAGE_KEYS).includes(key)) return false;
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getStudyFlowStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export { STORAGE_KEYS };
