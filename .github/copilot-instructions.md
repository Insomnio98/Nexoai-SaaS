<!-- Auto-generated guidance for AI coding agents. Update when repository content appears. -->
# Copilot instructions for AI coding agents

Summary
- This repository currently contains no discoverable source files or agent docs (no `README.md`, language manifests, or agent rules were found).
- The instructions below are a compact, actionable checklist and templates an AI agent should follow to become productive when code appears.

Quick agent checklist
- List top-level files and detect project type: look for `package.json`, `pyproject.toml`, `requirements.txt`, `go.mod`, `Cargo.toml`, `README.md`.
- If none found, ask the user whether to scaffold a minimal project (specify language and test harness).
- When files are present, prefer using project-specific build/test commands (examples below) rather than guessing.

Project discovery steps (explicit)
- Run: list files and top-level manifests. Example: inspect `package.json` → use `npm`/`pnpm` scripts; inspect `pyproject.toml` / `requirements.txt` → use `pip`/`pytest` or `poetry`.
- Search for agent docs: `**/{.github/copilot-instructions.md,AGENT.md,AGENTS.md,CLAUDE.md,README.md}` and rules under `.cursor/`, `.windsurf/`, `.clinerules/`.

When modifying or creating files
- If `.github/copilot-instructions.md` already exists: merge, preserve any repo-specific examples or commands, update stale notes (e.g., removed scripts or renamed folders).
- Keep guidance concise (20–50 lines). Prefer concrete commands over vague advice.

Build / test / run examples (use only if corresponding manifest exists)
- Node: run `npm ci` then `npm test` (or the script named `test` in `package.json`).
- Python: create venv, `pip install -r requirements.txt` or `poetry install`, run `pytest` if `tests/` present.
- Rust: `cargo build` and `cargo test` when `Cargo.toml` exists.

Conventions for this repo (derived from discovery)
- No discoverable code found. Agent should NOT assume language or project layout.
- Ask clarifying question immediately if the user's goal requires a specific language or framework.

Integration points & external deps
- If manifests are present, prefer built-in package managers to infer external deps and scripts.
- For CI files (`.github/workflows/*`) prefer to reuse existing job names and secrets; don't create new secrets without user approval.

Merge guidance (how to edit this file)
- Keep a short changelog entry at the top when you update this file, noting why the change was made.
- Preserve any repository-specific command snippets or path examples.

If you see this message
- Tell the user: "Repo appears empty — would you like me to scaffold a starter project or wait for files?"

Questions for the repo owner
- Which language(s) should I assume when scaffolding? (e.g., `node`, `python`, `go`)
- Do you have preferred CI, formatter, or test frameworks?

— End of guidance —
