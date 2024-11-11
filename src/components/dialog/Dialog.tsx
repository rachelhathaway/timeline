import React from "react";

import "./Dialog.css";

type DialogProps = {
  closeDialog: () => void;
};

export const Dialog = React.forwardRef<
  HTMLDialogElement,
  React.PropsWithChildren<DialogProps>
>(({ children, closeDialog }, ref) => (
  <dialog ref={ref}>
    <button onClick={closeDialog}>Close</button>
    {children}
  </dialog>
));
