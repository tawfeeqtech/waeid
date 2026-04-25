# Salla Coach Theme Engine – Project Memory

## Project Overview

This repository is a reusable **Salla Theme Engine** designed for building high-converting websites for:

* Fitness coaches
* Trainers
* Digital service providers

The system is NOT a one-off theme.
It is a **modular, scalable, and configurable UI system**.

---

## Core Principles

1. **Mobile-first always**

   * Design and implementation must prioritize mobile UX before desktop.

2. **Arabic-first UX**

   * RTL is the default direction.
   * Layout must work perfectly in both RTL and LTR.

3. **Configurability over hardcoding**

   * Avoid hardcoded layouts.
   * Prefer variants + settings instead of fixed designs.

4. **Reusability**

   * Every component must be reusable across multiple projects.

5. **Performance matters**

   * Avoid heavy DOM
   * Lazy load media
   * Optimize assets

6. **Stay within Salla limitations**

   * Do NOT invent unsupported features
   * Do NOT modify checkout or restricted flows

---

## Architecture Rules

### 1. Design Tokens (Mandatory)

All styling must use centralized tokens:

* Colors
* Typography
* Spacing
* Radius
* Shadows

❌ Do NOT use random values
✅ Use CSS variables only

---

### 2. Component-Based System

Build small reusable components instead of large sections.

Each component should:

* Be independent
* Support variants
* Support responsive behavior

---

### 3. Variants System

Avoid creating new components for small differences.

Instead:

* Use variants

Examples:

* Header: multiple layout variants
* Hero: centered / split / video / minimal

---

### 4. Settings-Driven UI

Every major component must support configuration via theme settings.

Examples:

* visibility toggles
* layout selection
* content control

⚠️ Only expose meaningful settings (avoid over-complexity)

---

## Component Requirements Checklist

Every new component MUST include:

* Responsive behavior (mobile-first)
* RTL/LTR support
* Accessibility basics (semantic HTML)
* Clean structure
* Optional dark mode compatibility (if applicable)

---

## RTL / LTR Rules

Use logical CSS properties:

✅ Correct:

* margin-inline-start
* padding-inline-end
* text-align: start

❌ Avoid:

* margin-left
* padding-right
* text-align: left

---

## Dark Mode Rules

* Use CSS variables for color switching
* Support light and dark themes
* Avoid hardcoded colors

---

## Media Handling Rules

All media must be optimized and flexible:

* Support image / video / slider
* Lazy load where possible
* Provide mobile fallback

---

## Naming Conventions

* Components: kebab-case
* Variables: --token-name
* Files: clear and descriptive

---

## Folder Structure Guidelines

/theme
/tokens
/components
/variants
/sections
/settings
/utils

---

## Do NOT

* Do NOT hardcode layout decisions
* Do NOT create one-off components
* Do NOT break RTL
* Do NOT ignore mobile behavior
* Do NOT introduce unsupported Salla features

---

## Preferred Workflow

When implementing changes, always follow:

1. Audit
2. Plan
3. Implementation
4. Verification

---

## Output Expectations (for AI agent)

Responses should be:

* Structured
* Practical (not theoretical)
* Incremental (step-by-step)
* Focused on real implementation

Avoid unnecessary explanations.

---

## Goal

Build a **flexible, scalable, high-performance theme system**
that can generate multiple client websites بسرعة وبجودة عالية
without rewriting code each time.
