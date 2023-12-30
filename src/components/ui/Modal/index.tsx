import { Dispatch, useEffect, useRef } from "react";
import styles from "./Modal.module.scss";

type PorpTypes = {
  children: React.ReactNode;
  onClose: any;
};

const Modal = (props: PorpTypes) => {
  const { children, onClose } = props;
  const ref: any = useRef();
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  return (
    <div className={styles.modal}>
      <div className={styles.modal__main} ref={ref}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
