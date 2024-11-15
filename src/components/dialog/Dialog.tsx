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
    <div>
      <button onClick={closeDialog}>X</button>
    </div>
    {typeof children === "string" ? <p>{children}</p> : children}
  </dialog>
));
