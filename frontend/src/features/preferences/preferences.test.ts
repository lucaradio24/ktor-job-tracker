import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_PREFERENCES, parsePreferences } from "./preferences.ts";

test("falls back to defaults for corrupted storage", () => {
  assert.deepEqual(parsePreferences("not-json"), DEFAULT_PREFERENCES);
});

test("keeps valid values and replaces unknown values", () => {
  assert.deepEqual(
    parsePreferences(
      JSON.stringify({ theme: "light", density: "tiny", motion: "reduced" }),
    ),
    { theme: "light", density: "comfortable", motion: "reduced" },
  );
});
