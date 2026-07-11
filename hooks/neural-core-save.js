#!/usr/bin/env node
/**
 * Neural Core — Stop LOAD hook
 * Reads the session transcript, extracts [[NEURAL_CORE_SAVE: TYPE | text]] markers
 * the agent emitted, and appends each as an immutable lesson to Index_Master.md.
 * Pairs with neural-core-load.js (SessionStart hook).
 *
 * TYPE ∈ SOP | AVERSION | MILESTONE | RULE
 * Memory location: env NEURAL_CORE_DIR, else ~/neural-core-memory
 *
 * The agent writes a marker in its own reasoning when it learns something durable, e.g.:
 *   [[NEURAL_CORE_SAVE: AVERSION | never ship red CTA buttons — user rejected twice]]
 *   [[NEURAL_CORE_SAVE: SOP | deploy = build, then `firebase deploy --only hosting`]]
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const MEM_DIR = process.env.NEURAL_CORE_DIR || path.join(os.homedir(), 'neural-core-memory');
const INDEX_MASTER = path.join(MEM_DIR, 'Index_Master.md');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input || '{}');
    const transcript = data.transcript || [];

    const learnings = [];
    for (const turn of transcript) {
      if (turn.role !== 'assistant') continue;
      const content = Array.isArray(turn.content)
        ? turn.content.map(c => (typeof c === 'string' ? c : c.text || '')).join('')
        : String(turn.content || '');
      const matches = [...content.matchAll(/\[\[NEURAL_CORE_SAVE:\s*(SOP|AVERSION|AVERSAO|MILESTONE|MARCO|RULE|REGRA)\s*\|\s*(.+?)\]\]/gi)];
      for (const m of matches) {
        learnings.push({ type: m[1].toUpperCase(), text: m[2].trim() });
      }
    }

    if (learnings.length === 0) {
      process.stdout.write('Neural Core: no new lessons this session.');
      process.exit(0);
    }

    const today = new Date().toISOString().split('T')[0];
    let idx = '';
    try { idx = fs.readFileSync(INDEX_MASTER, 'utf8'); }
    catch {
      // bootstrap a minimal Index_Master if missing
      idx = '# 🧠 Index Master (Subconscious)\n\n## 📖 SOPs\n\n## ⚠️ Aversions (never do)\n\n## 🚀 Milestones\n';
      fs.mkdirSync(MEM_DIR, { recursive: true });
    }

    const map = { SOP: 'SOP', AVERSION: 'AVERSION', AVERSAO: 'AVERSION', RULE: 'AVERSION', REGRA: 'AVERSION', MILESTONE: 'MILESTONE', MARCO: 'MILESTONE' };
    const bucket = t => map[t] || 'SOP';

    const sop = learnings.filter(l => bucket(l.type) === 'SOP');
    const av = learnings.filter(l => bucket(l.type) === 'AVERSION');
    const ms = learnings.filter(l => bucket(l.type) === 'MILESTONE');

    const appendUnder = (text, headingRegex, lines) => {
      if (!lines.length) return text;
      const block = lines.map((l, i) => `\n**Auto ${today}-${i + 1}** — ${l.text}`).join('');
      if (headingRegex.test(text)) {
        return text.replace(headingRegex, (m) => m.trimEnd() + block + '\n');
      }
      return text.trimEnd() + '\n' + block + '\n';
    };

    idx = appendUnder(idx, /## 📖 SOPs[\s\S]*?(?=\n## |$)/, sop);
    idx = appendUnder(idx, /## ⚠️ Aversions[\s\S]*?(?=\n## |$)/, av);
    idx = appendUnder(idx, /## 🚀 Milestones[\s\S]*?(?=\n## |$)/, ms);

    fs.writeFileSync(INDEX_MASTER, idx, 'utf8');
    process.stdout.write(`Neural Core: saved ${learnings.length} lesson(s) to Index_Master.md.`);
  } catch (e) {
    process.stdout.write('Neural Core save error: ' + e.message);
  }
});
