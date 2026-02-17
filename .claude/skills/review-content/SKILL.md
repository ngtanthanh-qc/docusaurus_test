---
name: review-content
description: Review blog posts or documentation for grammar, technical accuracy, structure, and Docusaurus best practices
argument-hint: [file-path]
context: fork
agent: Explore
model: haiku
---

# Content Review

Review the content at `$ARGUMENTS` for quality and correctness.

## Review Checklist

### Structure & Format
- Proper frontmatter (title, tags, authors for blog; title, sidebar_position for docs)
- Logical heading hierarchy (no skipped levels)
- Appropriate use of admonitions (:::tip, :::note, :::warning)
- Code blocks have language identifiers
- Images have alt text and exist in the referenced path

### Writing Quality
- Clear and concise language
- Consistent terminology throughout
- No spelling or grammar errors
- Technical terms are properly explained on first use
- Sentences are not overly long or complex

### Technical Accuracy
- Code examples are syntactically correct
- Commands and CLI instructions are accurate
- Links point to valid destinations
- Version numbers and tool references are current

### Docusaurus Best Practices
- MDX syntax is valid
- Mermaid diagrams render correctly (proper syntax)
- KaTeX expressions are properly delimited
- Blog posts have `{/* truncate */}` for preview control
- Images use relative paths from the document location

## Output Format

Organize findings by severity:
1. **Must Fix**: Errors that would break the build or mislead readers
2. **Should Fix**: Grammar issues, unclear explanations, missing context
3. **Nice to Have**: Style improvements, additional diagrams, better examples
