import { test } from "node:test";
import assert from "node:assert/strict";

import {
  loadStudyFlowState,
  saveStudyFlowCollection,
  STORAGE_KEYS,
} from "../src/storage.mjs";

function createStorage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
    removeItem(key) {
      values.delete(key);
    },
    values,
  };
}

test("loads all saved collections and revives date fields", () => {
  const storage = createStorage({
    [STORAGE_KEYS.subjects]: JSON.stringify([{
      id: "dsa", name: "DSA", color: "#123456",
      studiedHours: 5.5, targetHours: 40,
      lastStudied: "2026-11-05T18:00:00.000Z",
    }]),
    [STORAGE_KEYS.assignments]: JSON.stringify([{
      id: "a1", title: "Graph assignment", subject: "DSA",
      deadline: "2026-11-10T00:00:00.000Z", priority: "High", completed: false,
    }]),
    [STORAGE_KEYS.sessions]: JSON.stringify([{
      id: "s1", subjectId: "dsa", subjectName: "DSA",
      duration: 1.5, date: "2026-11-05T18:00:00.000Z",
    }]),
  });

  const result = loadStudyFlowState(storage);

  assert.equal(result.subjects.length, 1);
  assert.equal(result.assignments.length, 1);
  assert.equal(result.studySessions.length, 1);
  assert.ok(result.subjects[0].lastStudied instanceof Date);
  assert.ok(result.assignments[0].deadline instanceof Date);
  assert.ok(result.studySessions[0].date instanceof Date);
});

test("malformed JSON does not crash startup or discard other valid collections", () => {
  const storage = createStorage({
    [STORAGE_KEYS.subjects]: "{broken",
    [STORAGE_KEYS.assignments]: JSON.stringify([{
      id: "a1", title: "DBMS", subject: "DBMS",
      deadline: "2026-11-10T00:00:00.000Z", priority: "Medium", completed: false,
    }]),
    [STORAGE_KEYS.sessions]: "null",
  });

  const result = loadStudyFlowState(storage);

  assert.deepEqual(result.subjects, []);
  assert.equal(result.assignments.length, 1);
  assert.deepEqual(result.studySessions, []);
});

test("invalid individual records are filtered instead of breaking the collection", () => {
  const storage = createStorage({
    [STORAGE_KEYS.subjects]: JSON.stringify([
      { id: "valid", name: "OS", color: "green", studiedHours: 2, targetHours: 40 },
      { id: "invalid", name: "Bad", color: "red", studiedHours: -2, targetHours: 0 },
    ]),
  });

  const result = loadStudyFlowState(storage);

  assert.deepEqual(result.subjects.map((subject) => subject.id), ["valid"]);
});

test("missing or unavailable storage returns empty collections safely", () => {
  assert.deepEqual(loadStudyFlowState(null), {
    subjects: [],
    assignments: [],
    studySessions: [],
  });

  const storage = {
    getItem() { throw new Error("Storage is blocked"); },
    setItem() { throw new Error("Storage is full"); },
  };
  assert.deepEqual(loadStudyFlowState(storage), {
    subjects: [],
    assignments: [],
    studySessions: [],
  });
  assert.equal(saveStudyFlowCollection(storage, STORAGE_KEYS.subjects, []), false);
});

test("persistence writes only known StudyFlow keys", () => {
  const storage = createStorage();

  assert.equal(saveStudyFlowCollection(storage, STORAGE_KEYS.subjects, []), true);
  assert.equal(storage.values.get(STORAGE_KEYS.subjects), "[]");
  assert.equal(saveStudyFlowCollection(storage, "other-app-key", []), false);
});
