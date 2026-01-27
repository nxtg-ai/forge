# Comprehensive Guide: Claude Code SKILLS.md & Project Scaffolding

Claude Code's skills system extends capabilities through modular, self-contained packages that Claude triggers automatically or you invoke manually. Skills follow the Agent Skills open standard and work across multiple AI tools. [code.claude](https://code.claude.com/docs/en/skills)

## SKILLS.md Structure

Every skill requires a `SKILL.md` file with two components: [code.claude](https://code.claude.com/docs/en/skills)

### YAML Frontmatter

Defines metadata between `---` markers that controls when and how Claude uses the skill: [code.claude](https://code.claude.com/docs/en/skills)

```yaml
---
name: explain-code
description: Explains code with visual diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when the user asks "how does this work?"
argument-hint: [filename]
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep
model: opus
context: fork
agent: Explore
---
```

### Markdown Body

Instructions Claude follows when the skill activates. Only loaded after the skill triggers based on the description match. [code.claude](https://code.claude.com/docs/en/skills)

## .claude Directory Structure

Complete project scaffolding follows this hierarchy: [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)

```
project-root/
├── .claude/
│   ├── CLAUDE.md              # Project-level context (commit to git)
│   ├── CLAUDE.local.md        # Personal overrides (.gitignore this)
│   ├── settings.json          # Hooks, permissions, config
│   ├── skills/
│   │   ├── explain-code/
│   │   │   ├── SKILL.md       # Main instructions (required)
│   │   │   ├── template.md    # Templates Claude fills in
│   │   │   ├── examples/
│   │   │   │   └── sample.md  # Example outputs
│   │   │   └── scripts/
│   │   │       └── helper.py  # Executable scripts
│   │   ├── api-conventions/
│   │   │   └── SKILL.md
│   │   └── deploy/
│   │       └── SKILL.md
│   ├── agents/
│   │   ├── security-reviewer.md
│   │   └── test-writer.md
│   └── commands/              # Legacy (still works, use skills instead)
│       └── review.md
├── ~/.claude/                 # Global settings (all projects)
│   ├── CLAUDE.md              # Global context
│   └── skills/                # Personal skills library
│       └── my-skill/
│           └── SKILL.md
```

## Skill Priority & Discovery

Skills cascade from multiple locations with priority order: [code.claude](https://code.claude.com/docs/en/skills)

1. **Enterprise** → All organization users
2. **Personal** (`~/.claude/skills/`) → All your projects
3. **Project** (`.claude/skills/`) → Current project only
4. **Plugin** (`<plugin>/skills/`) → Namespaced as `plugin-name:skill-name`

Claude auto-discovers nested `.claude/skills/` directories when working in subdirectories, perfect for monorepos. [code.claude](https://code.claude.com/docs/en/skills)

## CLAUDE.md Best Practices

CLAUDE.md loads at conversation start—keep it concise and actionable: [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)

### ✅ Include

- Bash commands Claude can't guess [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)
- Code style rules differing from defaults [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)
- Testing instructions and preferred runners [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)
- Repository etiquette (branch naming, PR conventions) [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)
- Architectural decisions specific to your project [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)
- Developer environment quirks (required env vars) [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)
- Common gotchas or non-obvious behaviors [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)

### ❌ Exclude

- Information Claude infers from code [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)
- Standard language conventions [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)
- Detailed API documentation (link instead) [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)
- Frequently changing information [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)
- File-by-file codebase descriptions [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)
- Self-evident practices [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)

### Example Template

```markdown
# Code style
- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')

# Workflow
- Be sure to typecheck when you're done making a series of code changes
- Prefer running single tests, not the whole test suite, for performance

# Project-specific
- API keys must use Google Secret Manager
- All DB migrations require manual approval before production deploy

# Import additional context
See @README.md for project overview and @package.json for available npm commands.
- Git workflow: @docs/git-instructions.md
```

## Frontmatter Configuration Reference

| Field | Purpose | Example |
|-------|---------|---------|
| `name` | Slash command name (lowercase, hyphens, max 64 chars)  [code.claude](https://code.claude.com/docs/en/skills) | `fix-issue` |
| `description` | When Claude should use it (critical for auto-invocation)  [code.claude](https://code.claude.com/docs/en/skills) | `Fix a GitHub issue` |
| `argument-hint` | Autocomplete hint  [code.claude](https://code.claude.com/docs/en/skills) | `[issue-number]` |
| `disable-model-invocation` | Prevent auto-trigger (manual `/name` only)  [code.claude](https://code.claude.com/docs/en/skills) | `true` |
| `user-invocable` | Hide from `/` menu (background knowledge)  [code.claude](https://code.claude.com/docs/en/skills) | `false` |
| `allowed-tools` | Pre-approved tools for this skill  [code.claude](https://code.claude.com/docs/en/skills) | `Read, Grep, Bash` |
| `model` | Specific model to use  [code.claude](https://code.claude.com/docs/en/skills) | `opus` |
| `context` | Run in subagent (`fork`)  [code.claude](https://code.claude.com/docs/en/skills) | `fork` |
| `agent` | Which subagent type  [code.claude](https://code.claude.com/docs/en/skills) | `Explore`, `Plan` |
| `hooks` | Skill-scoped lifecycle hooks  [code.claude](https://code.claude.com/docs/en/skills) | See hooks docs |

## String Substitution Variables

Skills support dynamic values: [code.claude](https://code.claude.com/docs/en/skills)

| Variable | Description |
|----------|-------------|
| `$ARGUMENTS` | All arguments passed when invoking |
| `$ARGUMENTS[N]` or `$N` | Specific argument by index (0-based) |
| `${CLAUDE_SESSION_ID}` | Current session ID |

**Example:**
```markdown
---
name: migrate-component
description: Migrate a component from one framework to another
---

Migrate the $0 component from $1 to $2.
Preserve all existing behavior and tests.
```

Invoke: `/migrate-component SearchBar React Vue`

## Cookbook Recipes

### 1. Reference Content Skill (Auto-Invoked)

For knowledge Claude applies contextually: [code.claude](https://code.claude.com/docs/en/skills)

```markdown
---
name: api-conventions
description: API design patterns for this codebase
---

When writing API endpoints:
- Use RESTful naming conventions
- Return consistent error formats
- Include request validation
- Version APIs in URL path (/v1/, /v2/)
```

### 2. Task Workflow Skill (Manual Trigger)

For actions with side effects: [code.claude](https://code.claude.com/docs/en/skills)

```markdown
---
name: deploy
description: Deploy the application to production
context: fork
disable-model-invocation: true
---

Deploy $ARGUMENTS to production:
1. Run the test suite
2. Build the application
3. Push to the deployment target
4. Verify the deployment succeeded
```

### 3. Dynamic Context Injection

Use `!`command`` to run shell commands before rendering: [code.claude](https://code.claude.com/docs/en/skills)

```markdown
---
name: pr-summary
description: Summarize changes in a pull request
context: fork
agent: Explore
allowed-tools: Bash(gh:*)
---

## Pull request context
- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`
- Changed files: !`gh pr diff --name-only`

## Your task
Summarize this pull request including:
- What changed and why
- Potential risks
- Testing recommendations
```

### 4. Subagent Research Skill

Run investigations in isolated context: [code.claude](https://code.claude.com/docs/en/skills)

```markdown
---
name: deep-research
description: Research a topic thoroughly
context: fork
agent: Explore
---

Research $ARGUMENTS thoroughly:
1. Find relevant files using Glob and Grep
2. Read and analyze the code
3. Summarize findings with specific file references
4. Identify patterns and anti-patterns
```

### 5. Visual Output Generator

Generate interactive HTML reports: [code.claude](https://code.claude.com/docs/en/skills)

```markdown
---
name: codebase-visualizer
description: Generate an interactive collapsible tree visualization of your codebase. Use when exploring a new repo, understanding project structure, or identifying large files.
allowed-tools: Bash(python:*)
---

# Codebase Visualizer

Run the visualization script from your project root:

```bash
python ~/.claude/skills/codebase-visualizer/scripts/visualize.py .
```

This creates `codebase-map.html` in the current directory and opens it in your default browser.
```

### 6. Issue Fixer with GitHub Integration

```markdown
---
name: fix-issue
description: Fix a GitHub issue
disable-model-invocation: true
---

Analyze and fix the GitHub issue: $ARGUMENTS.

1. Use `gh issue view` to get issue details
2. Understand the problem described
3. Search the codebase for relevant files
4. Implement necessary changes
5. Write and run tests to verify the fix
6. Ensure code passes linting and type checking
7. Create descriptive commit message
8. Push and create a PR
```

### 7. Security Review Subagent

```markdown
---
name: security-reviewer
description: Reviews code for security vulnerabilities
tools: Read, Grep, Glob, Bash
model: opus
---

You are a senior security engineer. Review code for:
- Injection vulnerabilities (SQL, XSS, command injection)
- Authentication and authorization flaws
- Secrets or credentials in code
- Insecure data handling

Provide specific line references and suggested fixes.
```

## Invocation Control Matrix

How `disable-model-invocation` and `user-invocable` work together: [code.claude](https://code.claude.com/docs/en/skills)

| Frontmatter | You invoke | Claude invokes | Context loading |
|-------------|-----------|----------------|-----------------|
| (default) | Yes | Yes | Description always in context |
| `disable-model-invocation: true` | Yes | No | Not in context until you invoke |
| `user-invocable: false` | No | Yes | Description always in context |

## Advanced Patterns

### Supporting Files Structure

Keep `SKILL.md` focused, load details on-demand: [code.claude](https://code.claude.com/docs/en/skills)

```
my-skill/
├── SKILL.md           # Overview and navigation
├── reference.md       # Detailed API docs (loaded when needed)
├── examples.md        # Usage examples (loaded when needed)
└── scripts/
    └── helper.py      # Utility script (executed, not loaded)
```

Reference from `SKILL.md`:
```markdown
## Additional resources
- For complete API details, see [reference.md](reference.md)
- For usage examples, see [examples.md](examples.md)
```

### Skill with Forked Context

Runs in isolated subagent: [code.claude](https://code.claude.com/docs/en/skills)

```markdown
---
name: code-review
description: Comprehensive code review
context: fork
agent: Explore
---

Review all modified files in this branch:
1. Code quality and maintainability
2. Performance implications
3. Security concerns
4. Test coverage gaps

Provide specific line-by-line feedback.
```

## Essential Links & Resources

| Resource | URL | Description |
|----------|-----|-------------|
| **Official Docs** |
| Claude Code Skills Docs | https://code.claude.com/docs/en/skills | Complete skills reference  [code.claude](https://code.claude.com/docs/en/skills) |
| Claude Code Best Practices | https://code.claude.com/docs/en/best-practices | Optimization techniques  [code.claude](https://code.claude.com/docs/en/best-practices) |
| Agent Skills API Docs | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview | API integration  [platform.claude](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) |
| **Repositories** |
| Anthropic Official Skills | https://github.com/anthropics/skills | Official examples library  [github](https://github.com/anthropics/skills) |
| Claude Cookbooks | https://github.com/anthropics/claude-cookbooks | Recipes and patterns  [github](https://github.com/anthropics/claude-cookbooks) |
| Awesome Claude Skills | https://github.com/travisvn/awesome-claude-skills | Community curated list  [github](https://github.com/travisvn/awesome-claude-skills) |
| **Guides & Tutorials** |
| Gend.co Practical Guide | https://www.gend.co/blog/claude-skills-claude-md-guide | 2026 practical guide  [gend](https://www.gend.co/blog/claude-skills-claude-md-guide) |
| Sidbharath Complete Guide | https://sidbharath.com/blog/claude-code-the-complete-guide/ | Cooking with Claude Code  [sidbharath](https://sidbharath.com/blog/claude-code-the-complete-guide/) |
| Reddit Guide v2 | https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/ | CLAUDE.md, MCP, Commands guide  [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/) |
| Anthropic Best Practices Blog | https://www.anthropic.com/engineering/claude-code-best-practices | Engineering best practices  [anthropic](https://www.anthropic.com/engineering/claude-code-best-practices) |
| Agent Skills Engineering | https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills | Real-world agent skills  [anthropic](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) |
| Skills Structure Deep Dive | https://mikhail.io/2025/10/claude-code-skills/ | Internal structure analysis  [mikhail](https://mikhail.io/2025/10/claude-code-skills/) |

## Quick Start Commands

```bash
# Create your first skill
mkdir -p ~/.claude/skills/explain-code
nano ~/.claude/skills/explain-code/SKILL.md

# Initialize CLAUDE.md for project
claude /init

# View available skills
claude "What skills are available?"

# Install official skills as plugin
claude /plugin marketplace add anthropics/skills

# Check context usage
claude /context

# Configure permissions
claude /permissions

# Create hooks
claude /hooks
```

## Troubleshooting

**Skill not triggering:** [code.claude](https://code.claude.com/docs/en/skills)
- Verify description includes natural keywords users would say
- Check skill appears in available skills list
- Try direct invocation with `/skill-name`
- Match your request phrasing to description

**Skill triggers too often:** [code.claude](https://code.claude.com/docs/en/skills)
- Make description more specific
- Add `disable-model-invocation: true` for manual-only

**Claude doesn't see all skills:** [code.claude](https://code.claude.com/docs/en/skills)
- Skills exceed character budget (default 15,000)
- Run `/context` to check for exclusion warnings
- Increase with `SLASH_COMMAND_TOOL_CHAR_BUDGET` env var

## Production Tips

1. **Start with `/init`** to auto-detect build systems and frameworks [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)
2. **Keep CLAUDE.md under 200 lines**—bloat causes Claude to ignore instructions [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)
3. **Use hooks for deterministic actions**—they guarantee execution vs advisory CLAUDE.md [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)
4. **Commit `.claude/skills/` to git** for team sharing [code.claude](https://code.claude.com/docs/en/skills)
5. **Personal overrides go in `CLAUDE.local.md`** and `.gitignore` it [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)
6. **CLI tools > APIs**—more context-efficient (e.g., `gh` CLI) [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)
7. **Run `/compact` during long sessions** to preserve critical context [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)
8. **Double-tap Escape or `/rewind`** to restore checkpoints [reddit](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)

This architecture scales from single-developer workflows to enterprise deployments with managed settings. [code.claude](https://code.claude.com/docs/en/skills)