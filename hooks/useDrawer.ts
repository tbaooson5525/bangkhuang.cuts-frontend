"use client";

import { useState } from "react";

export function useDrawer() {
  const [open, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  const onToggle = () => setOpen((o) => !o);

  return { open, onOpen, onClose, onToggle, setOpen };
}
