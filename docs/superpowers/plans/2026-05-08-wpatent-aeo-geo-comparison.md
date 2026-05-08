# W&Patent AEO/GEO Comparison Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a compact AEO/GEO comparison block to the existing Trust Chain scorecard so W&Patent can compare development-time AI interpretation against production-time AI visibility without creating a second full analytics system.

**Architecture:** Keep the implementation entirely inside the existing markdown scorecard and existing scorecard tests. Add one manual `AEO/GEO Comparison` section with two `0–20` scores, five shared dimensions, and a short interpretation note, then update tests so the new structure stays protected.

**Tech Stack:** Markdown scorecard content, Node test suite, existing scorecard docs

---

## File Structure

- Modify: `docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md`
  - add the new AEO/GEO comparison block
  - keep it compact and adjacent to the existing visibility/authority narrative

- Modify: `tests/trust-chain-scorecard.test.mjs`
  - assert the new comparison block exists
  - assert both development and production scores are represented
  - assert the five scoring dimensions are present

### Task 1: Lock the AEO/GEO comparison contract in tests

**Files:**
- Modify: `tests/trust-chain-scorecard.test.mjs`
- Test: `tests/trust-chain-scorecard.test.mjs`

- [ ] **Step 1: Read the current scorecard tests**

Run:

```bash
sed -n '1,260p' tests/trust-chain-scorecard.test.mjs
```

Expected: the file checks scorecard docs, summary categories, and worksheet rows, but does not yet cover any AEO/GEO comparison section.

- [ ] **Step 2: Add failing assertions for the new comparison block**

Update `tests/trust-chain-scorecard.test.mjs` to include a test like:

```js
test("scorecard summary includes the AEO/GEO comparison block", () => {
  const summary = read("docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md");
  assert.match(summary, /## AEO\\/GEO Comparison/i);
  assert.match(summary, /Development AEO\\/GEO/i);
  assert.match(summary, /Production AEO\\/GEO/i);
  assert.match(summary, /Concept Alignment/i);
  assert.match(summary, /Entity Recognition/i);
  assert.match(summary, /Founder Recognition/i);
  assert.match(summary, /Authority Framing/i);
  assert.match(summary, /Reference Quality|Citation Quality/i);
});
```

Keep the assertions specific to the comparison block rather than the entire scorecard.

- [ ] **Step 3: Run the focused scorecard tests to verify they fail**

Run:

```bash
npm test -- --test-name-pattern "scorecard"
```

Expected: FAIL because the scorecard markdown does not yet include the new AEO/GEO comparison section.

- [ ] **Step 4: Commit the failing-test checkpoint**

```bash
git add tests/trust-chain-scorecard.test.mjs
git commit -m "test: cover aeo geo comparison scorecard block"
```

### Task 2: Add the comparison block to the scorecard

**Files:**
- Modify: `docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md`
- Test: `tests/trust-chain-scorecard.test.mjs`

- [ ] **Step 1: Read the current scorecard markdown in context**

Run:

```bash
sed -n '1,260p' docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md
```

Expected: the current scorecard has the summary dashboard, headline signals, prompt set, and update workflow, but no dev-vs-production AEO/GEO comparison section.

- [ ] **Step 2: Add a compact AEO/GEO comparison section**

Update `docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md` by inserting a section like:

```md
## AEO/GEO Comparison

- Development AEO/GEO: `11/20`
- Production AEO/GEO: `3/20`

### Development breakdown

- Concept Alignment: `2/4`
- Entity Recognition: `1/4`
- Founder Recognition: `0/4`
- Authority Framing: `4/4`
- Reference Quality: `4/4`

### Production breakdown

- Concept Alignment: `1/4`
- Entity Recognition: `0/4`
- Founder Recognition: `0/4`
- Authority Framing: `1/4`
- Citation Quality: `1/4`

Interpretation: internal and provider-assisted framing is stronger than public external citation so far.
```

Keep the copy consistent with the approved design:

- development score reflects readiness and internal framing
- production score reflects real external surfacing and citation
- the section remains compact

- [ ] **Step 3: Run the focused scorecard tests to verify they pass**

Run:

```bash
npm test -- --test-name-pattern "scorecard"
```

Expected: PASS for the scorecard-specific tests, including the new comparison block coverage.

- [ ] **Step 4: Commit the scorecard comparison update**

```bash
git add docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md tests/trust-chain-scorecard.test.mjs
git commit -m "feat: add aeo geo comparison to trust chain scorecard"
```

### Task 3: Verify the full suite and repo state

**Files:**
- Modify: `docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md`
- Test: `tests/trust-chain-scorecard.test.mjs`

- [ ] **Step 1: Run the full test suite**

Run:

```bash
npm test
```

Expected: PASS with the full suite green.

- [ ] **Step 2: Manually inspect the updated scorecard summary**

Run:

```bash
sed -n '1,260p' docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md
```

Expected: the new comparison block is visible, clearly marked as AEO/GEO-only, and does not introduce SEO or business comparison rows.

- [ ] **Step 3: Check the worktree status**

Run:

```bash
git status --short
```

Expected: only the scorecard markdown, scorecard test file, and any already-known unrelated untracked files remain.

- [ ] **Step 4: Commit the verification checkpoint**

```bash
git add docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md tests/trust-chain-scorecard.test.mjs
git commit -m "test: verify aeo geo comparison scorecard update"
```

## Self-Review Checklist

- Spec coverage:
  - two-score AEO/GEO comparison block: covered in Task 2
  - five shared scoring dimensions: covered in Task 2 and protected in Task 1
  - placement inside existing scorecard: covered in Task 2
  - manual workflow only, no new schema: preserved by all tasks

- Placeholder scan:
  - no `TBD`, `TODO`, or vague implementation steps remain

- Type consistency:
  - comparison labels stay consistent across spec, markdown, and tests:
    - `Development AEO/GEO`
    - `Production AEO/GEO`
    - `Concept Alignment`
    - `Entity Recognition`
    - `Founder Recognition`
    - `Authority Framing`
    - `Reference Quality`
    - `Citation Quality`
