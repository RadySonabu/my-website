"use client";

import { deleteProjectAction } from "./actions";

export default function DeleteProjectButton({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  return (
    <form
      action={deleteProjectAction.bind(null, slug)}
      onSubmit={(event) => {
        if (!window.confirm(`Delete "${title}"? This can't be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="text-sm text-muted hover:text-foreground"
      >
        Delete
      </button>
    </form>
  );
}
