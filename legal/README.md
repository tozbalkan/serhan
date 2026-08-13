# Legal Documents

Legal documents for Serhan Turizm are **versioned as files in this repository**,
not managed through a CMS.

## Convention

Each legal document is stored as a Markdown file named with its version date:

```
legal/
├── kvkk-aydinlatma-2026.08.01.md   # KVKK aydınlatma metni
└── kvkk-acik-riza-2026.08.01.md    # KVKK açık rıza metni
```

- The version date uses the `YYYY.MM.DD` format embedded in the filename.
- The **active** version of each document is referenced from application
  configuration in `lib/legal/config.ts` (`LEGAL_VERSIONS`).
- When a legal text changes, add a **new** file with the new version date and
  bump the corresponding key in `lib/legal/config.ts`. Previous versions are
  kept in the repository for auditability.

## Status

The legal document files exist as **placeholders** (`kvkk-aydinlatma-2026.08.01.md`
and `kvkk-acik-riza-2026.08.01.md`). They contain only structural comments and
**no legal text** — the actual KVKK aydınlatma and açık rıza wording will be
supplied by the appropriate owner in a later phase. The consent flow references
the `2026.08.01` versions via `LEGAL_VERSIONS`; when the real text arrives, the
file contents are replaced (new version files are added only if the version
date changes). Do not invent legal language here.
