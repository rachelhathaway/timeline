import React from "react";

export const DialogContext = React.createContext<{
  closeDialog: () => void;
  openDialog: (content: React.ReactNode) => void;
}>({
  closeDialog: () => {},
  openDialog: () => {},
});
