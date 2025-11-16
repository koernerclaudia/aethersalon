# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## 2025-11-16 — feature/mobile-preview

- Commit: `5a9d161`
- Summary: Mobile header and navigation UI improvements
  - Centered mobile logo and navigation links
  - Increased mobile nav link size (`text-lg`) and made links full-width & centered
  - Added semi-transparent black background to the mobile linkbar (`bg-black/80`), with padding and rounded corners
  - Kept active link highlight in brass; mobile non-active links use white text for better contrast

Files touched (high level):
- `src/components/Header.tsx`
- Various assets and small page updates were included in the same commit; see the git history for full per-file details.

---

Tips:
- For visual tweaks edit `src/components/Header.tsx` and adjust Tailwind utilities.
- To produce a smaller PR that only contains header changes, create a new branch and cherry-pick the header-related commit(s) or I can prepare the focused branch for you.
