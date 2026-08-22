/**
 * Contact-form rules, shared by the client form and the API route.
 *
 * Kept in one module on purpose: duplicating the rules is how a form ends up
 * accepting input the server then rejects with a generic 500.
 */

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { min: 5, max: 200 },
  message: { min: 10, max: 2000 },
} as const;

export type ContactField = keyof typeof LIMITS;

export interface ContactValues {
  name: string;
  email: string;
  message: string;
}

export type ContactErrors = Partial<Record<ContactField, string>>;

// Deliberately permissive. Strict RFC-5322 regexes reject valid addresses far
// more often than they catch typos; the real check is whether the reply lands.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Validate a single field. Returns an error message, or undefined if valid. */
export function validateField(
  field: ContactField,
  rawValue: string
): string | undefined {
  const value = rawValue.trim();
  const { min, max } = LIMITS[field];

  if (value.length === 0) {
    return field === "message"
      ? "Please write a short message."
      : `Please enter your ${field}.`;
  }

  if (value.length > max) {
    return `Please keep this under ${max} characters.`;
  }

  switch (field) {
    case "name":
      return value.length < min ? "Please enter your full name." : undefined;
    case "email":
      return EMAIL_RE.test(value) ? undefined : "That doesn't look like a valid email.";
    case "message":
      return value.length < min
        ? `A little more detail, please — at least ${min} characters.`
        : undefined;
  }
}

/** Validate every field. Empty object means the payload is good. */
export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of Object.keys(LIMITS) as ContactField[]) {
    const error = validateField(field, values[field] ?? "");
    if (error) errors[field] = error;
  }
  return errors;
}
