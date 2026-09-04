export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function resolveUniqueSlug(
  baseSlug: string,
  existingSlugs: string[],
  wasManuallyEdited: boolean,
): string | null {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  if (wasManuallyEdited) {
    return null;
  }

  let attempt = 2;
  while (existingSlugs.includes(`${baseSlug}-${attempt}`)) {
    attempt += 1;
  }
  return `${baseSlug}-${attempt}`;
}
