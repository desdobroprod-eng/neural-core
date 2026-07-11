#!/usr/bin/env node
/**
 * Neural Core — SessionStart LOAD hook
 * Injects the two-phase memory (Subconscious + recent Conscious) into EVERY new
 * session's context, so the agent never starts blind and never redoes finished work.
 * Pairs with neural-core-save.js (Stop hook).
 *
 * Memory location: set env NEURAL_CORE_DIR, else defaults to ~/neural-core-memory
 * Expected files inside it:
 *   Index_Master.md   -> Subconscious: immutable lessons, aversions, SOPs
 *   task_history.md   -> Conscious: RAM / save state (where work stopped)
 *
 * Wire into ~/.claude/settings.json under hooks.SessionStart (see README).
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const MEM_DIR = process.env.NEURAL_CORE_DIR || path.join(os.homedir(), 'neural-core-memory');
const INDEX_MASTER = path.join(MEM_DIR, 'Index_Master.md');
const TASK_HISTORY = path.join(MEM_DIR, 'task_history.md');

// Token budget (~4 chars/token). Tune to taste.
const MAX_INDEX = Number(process.env.NEURAL_CORE_MAX_INDEX || 60000);      // subconscious: load ~all lessons
const MAX_TASK_TAIL = Number(process.env.NEURAL_CORE_MAX_TASK || 16000);   // conscious: recent tail only

function safeRead(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return null; }
}

function tail(str, maxChars) {
  if (str.length <= maxChars) return str;
  const cut = str.slice(str.length - maxChars);
  const firstSection = cut.indexOf('\n## '); // start at a clean heading, not mid-sentence
  return firstSection > -1 ? cut.slice(firstSection + 1) : cut;
}

const idx = safeRead(INDEX_MASTER);
const task = safeRead(TASK_HISTORY);

if (!idx && !task) {
  process.stdout.write(
    `Neural Core: no memory found in ${MEM_DIR}. ` +
    `Set NEURAL_CORE_DIR or create Index_Master.md / task_history.md (see templates/).`
  );
  process.exit(0);
}

let out = '=== 🧠 NEURAL CORE — MEMORY LOADED (read before acting) ===\n\n';

if (idx) {
  out += '## 🧠 SUBCONSCIOUS — Index_Master (immutable lessons, aversions, SOPs — never repeat a mistake from here)\n\n';
  out += idx.length > MAX_INDEX
    ? idx.slice(0, MAX_INDEX) + '\n\n[…Index_Master truncated — open the file for the rest]'
    : idx;
  out += '\n\n';
}

if (task) {
  out += '## ⚡ CONSCIOUS — task_history (where work stopped / recent save state)\n\n';
  out += tail(task, MAX_TASK_TAIL);
  out += '\n\n';
}

out += '=== end Neural Core memory — continue from the exact point, no rework ===';

process.stdout.write(out);
