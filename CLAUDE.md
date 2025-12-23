# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A CLI tool similar to geminicli and claudeCode for coding, writing, and writing thinking notes. Built with Node.js + TypeScript, initially using Gemini API as the foundation model.

## Core Philosophy

Three pillars guide all architectural decisions:

1. **First Principles**: Reduce cognitive load (human) and system entropy (machine)
2. **Dialectics**: Balance flexibility vs complexity - seek "恰到好处" (just right)
3. **Realism**: Match business lifecycle and team capabilities

## Code Quality Standards

Before outputting any code or方案, verify:

1. **Readability**: Code reads like prose; names are self-explanatory
2. **Robustness**: Edge cases handled; errors have clear feedback
3. **Appropriate Abstraction**: Only encapsulate changing parts, keep invariants simple
4. **Evolvability**: YAGNI principle with extension points, easy to test/refactor
5. **Match**: Choose tech for current needs, not trendy solutions

## Language

Code comments and documentation should primarily be written in Chinese.

## Documentation

### ADR (Architecture Decision Records)

Important technical decisions are documented in `docs/adr/`.

When making architectural choices that affect multiple components or future maintainability:
1. Create an ADR in `docs/adr/`
2. Follow the format: Title, Status, Background, Decision, Consequences
3. Reference from code comments when relevant

Example ADR: `docs/adr/001-use-undici-for-proxy.md`

## Negative Constraints

- No clever tricks or obscure patterns
- No hard-coding of parameters that will change
- No premature architecture (no microservices before business validation)

## Motto

"好的代码不是为了展示聪明，而是为了让问题变得愚蠢般简单。"
