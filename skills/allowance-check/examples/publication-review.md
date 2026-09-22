# Lab 6 publication review

Reviewed on **2026-09-22 UTC**, before commit. Scope: new Lab 6 artifacts and their integration changes.

- Removed unpublished draft reports and discovery logs containing individual-wallet observations or unnecessary account identifiers.
- Regenerated all three live examples with a documented protocol-contract owner or the zero address. Address substitution into old evidence was not used.
- Kept only documented token/protocol contract addresses and the zero-address live control. Synthetic test identifiers appear only in clearly offline fixtures and were not queried for those tests.
- Redacted app-selection identifiers and omitted account metadata from public call logs. Credentials and private local configuration are not publication inputs.
- Added publication rules to the skill, prompts, walkthrough and agent pointer: private personal-wallet reports stay private; public examples must not identify individuals or imply protocol safety findings.
- Credential-pattern scanning of Git publication candidates found no matching secrets. This is a bounded automated check, not a guarantee that every possible secret format is detectable.

**Deferred by explicit user choice:** personal references in previously published Labs 0–5 and repository history. They have not been sanitized by this review. Do not describe the whole repository as free of personal references.

No commit or push is part of this review.
