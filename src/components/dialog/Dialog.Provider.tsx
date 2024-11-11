import React from "react";

import { DialogContext } from "./Dialog.Context";
import { Dialog } from "./Dialog";

export const DialogProvider = ({ children }: React.PropsWithChildren) => {
  const dialogRef = React.useRef<HTMLDialogElement | null>(null);
  const [dialogContent, setDialogContent] =
    React.useState<React.ReactNode>(null);
  const closeDialog = React.useCallback(() => {
    setDialogContent(null);
    dialogRef.current?.close?.();
  }, []);
  const openDialog = React.useCallback((content: React.ReactNode) => {
    setDialogContent(content);
    dialogRef.current?.showModal?.();
  }, []);

  return (
    <DialogContext.Provider value={{ closeDialog, openDialog }}>
      {children}
      <Dialog closeDialog={closeDialog} ref={dialogRef}>
        {dialogContent}
      </Dialog>
    </DialogContext.Provider>
  );
};
