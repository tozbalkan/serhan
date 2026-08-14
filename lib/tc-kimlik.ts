// TC Kimlik number algorithmic validation (Phase 4).
//
// This is ALGORITHMIC validation only — it checks whether the supplied 11-digit
// number conforms to the published TC Kimlik checksum rules. It does NOT verify
// identity, does NOT call NVI/MERNIS/e-Devlet, and does NOT confirm the number
// belongs to a real person. "Geçersiz kimlik numarası" / "Kimlik numarası formatı
// geçerli." wording is used — never "doğrulandı".
//
// Algorithm (per the public checksum rules):
//   - 11 digits, all numeric, first digit != 0
//   - 10th digit  = ((d1+d3+d5+d7+d9)*7 - (d2+d4+d6+d8)) mod 10
//   - 11th digit  = (d1+...+d10) mod 10
// Obvious invalid values (all-zeros, all-ones, repeated digits) are rejected.
//
// This module is pure (no server/client boundary) so it can be imported by both
// the client form and the server action. Do NOT add logging here.

const TC_LENGTH = 11;

export function isValidTcKimlik(value: unknown): boolean {
  if (typeof value !== "string") return false;

  const tc = value.trim();
  if (tc.length !== TC_LENGTH) return false;
  if (!/^\d{11}$/.test(tc)) return false;
  if (tc[0] === "0") return false;

  // Reject degenerate repeated-digit numbers (e.g. 11111111111, 00000000000).
  const first = tc[0];
  if (tc.split("").every((ch) => ch === first)) return false;

  const digits = tc.split("").map((ch) => Number(ch));

  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8]; // 1,3,5,7,9
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7]; // 2,4,6,8
  const tenth = (oddSum * 7 - evenSum) % 10;
  if (tenth !== digits[9]) return false;

  const total = digits.slice(0, 10).reduce((a, b) => a + b, 0);
  const eleventh = total % 10;
  if (eleventh !== digits[10]) return false;

  return true;
}

// Produce a safe, non-reversible representation for display in emails/logs.
// Keeps only the last 4 digits; masks everything else. Never use the full value.
export function maskTcKimlik(value: string): string {
  const tc = value.trim();
  if (tc.length !== TC_LENGTH || !/^\d{11}$/.test(tc)) return "*********0000";
  return `*********${tc.slice(-4)}`;
}

export function maskStoredTcKimlik(value: string): string {
  const tc = value.trim();
  if (!/^\d{4,11}$/.test(tc)) return "*********0000";
  return `*********${tc.slice(-4)}`;
}
