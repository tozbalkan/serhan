"use client";

// Client control: toggles a school's active/inactive state via the
// `setSchoolActive` Server Action. Slug and identity are never sent from the
// client — only the id and the desired boolean.

import { useState, useTransition } from "react";
import { setSchoolActive } from "@/lib/schools/actions";
import * as t from "./school-active-toggle.css";

type Props = {
  schoolId: string;
  initialActive: boolean;
};

export function SchoolActiveToggle({ schoolId, initialActive }: Props) {
  const [active, setActive] = useState(initialActive);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !active;
    setActive(next);
    startTransition(async () => {
      const res = await setSchoolActive({ id: schoolId, aktif: next });
      if (!res.ok) {
        setActive(!next); // revert on failure
      }
    });
  }

  return (
    <button
      type="button"
      className={t.toggle}
      data-active={active}
      onClick={toggle}
      disabled={pending}
      aria-pressed={active}
    >
      {active ? "Aktif" : "Pasif"}
    </button>
  );
}
