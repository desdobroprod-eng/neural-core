# 🧠 Neural Core

**Persistent, two-phase memory for AI coding agents. Stop the amnesia. Stop the rework.**

AI agents start every session blank. Fix a behavior today and the agent repeats the same mistake tomorrow — you re-explain, forever. Neural Core gives your agent a brain that survives across sessions:

- **🧠 Subconscious** (`Index_Master.md`) — immutable lessons, aversions, SOPs. *Never repeat a corrected mistake.*
- **⚡ Conscious** (`task_history.md`) — RAM / save state: where the work stopped. *Continue from the exact point.*

Two hooks make it automatic — no reliance on the model "remembering" to read files:

| Hook | When | What it does |
|------|------|--------------|
| `hooks/neural-core-load.js` | **SessionStart** | Injects Subconscious + recent Conscious into context |
| `hooks/neural-core-save.js` | **Stop** | Extracts `[[NEURAL_CORE_SAVE: …]]` markers → appends to `Index_Master.md` |

---

## Install (Claude Code)

1. Pick a memory folder and seed it from `templates/`:

```bash
export NEURAL_CORE_DIR="$HOME/neural-core-memory"
mkdir -p "$NEURAL_CORE_DIR"
cp templates/Index_Master.md "$NEURAL_CORE_DIR/"
cp templates/Z_Singularidade.md "$NEURAL_CORE_DIR/task_history.md"
cp hooks/*.js "$HOME/.claude/hooks/"
```

2. Wire the hooks in `~/.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      { "hooks": [ { "type": "command", "command": "node \"$HOME/.claude/hooks/neural-core-load.js\"" } ] }
    ],
    "Stop": [
      { "hooks": [ { "type": "command", "command": "node \"$HOME/.claude/hooks/neural-core-save.js\"" } ] }
    ]
  }
}
```

> Set `NEURAL_CORE_DIR` in your shell profile so both hooks find the memory. Defaults to `~/neural-core-memory`.

3. (Optional) Add the boot/termination rules to your global agent prompt (`CLAUDE.md`, `.cursorrules`, etc.) — see `templates/prompt_hook_template.md`. Fallback for if a hook ever fails.

---

## How the agent saves a lesson

When the agent learns something durable it emits a marker in its reasoning; the Stop hook harvests it:

```
[[NEURAL_CORE_SAVE: AVERSION | never ship red CTA buttons — user rejected twice]]
[[NEURAL_CORE_SAVE: SOP | deploy = build, then `firebase deploy --only hosting`]]
[[NEURAL_CORE_SAVE: MILESTONE | v2 shipped 2026-07-10]]
```

Types: `SOP` · `AVERSION` · `MILESTONE` (aliases: `AVERSAO`, `REGRA`, `MARCO`).

**Diary (conscious):** to record *what was done* (not a lesson) into `task_history.md`, emit:

```
[[NEURAL_CORE_TASK: shipped 13 badges to prod; 3D hero perf still pending]]
```

The Stop hook appends these under a dated `## [YYYY-MM-DD] Session (auto)` heading, so the next session's load hook restores exactly where you stopped.

## Tuning (env vars)

- `NEURAL_CORE_DIR` — memory folder (default `~/neural-core-memory`)
- `NEURAL_CORE_MAX_INDEX` — max chars of Index_Master injected (default 60000)
- `NEURAL_CORE_MAX_TASK` — max chars of task_history tail injected (default 16000)

Files are **never deleted, only appended**. Propose a cleanup every ~6 months so the memory doesn't bloat the context window.

---

## Credits

Architected by **Ben-Hur Real Figueiró** — CEO, [10Dobro Prod](https://10dobroprod.com.br). MIT License.
