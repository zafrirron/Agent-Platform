Compress a memory or context file to reduce input tokens ~46%. Usage: `/caveman-compress path/to/file.md`

Compress the file at the path the user provides after the command.

Rules:
- Preserve all facts, technical terms, file paths, commands exactly
- Remove: filler words, redundant explanations, repeated points, verbose phrasing
- Shorten section headers where meaning is obvious
- Target: ~46% character reduction
- Output: rewrite file in place (show diff summary after)
- Do not compress code blocks or YAML/JSON

If no path given: ask user which file to compress.
