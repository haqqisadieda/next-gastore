import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import styles from "./ModalDeleteUser.module.scss";
import userServices from "@/services/user";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useState } from "react";
import { User } from "@/type/user.type";

type PropTypes = {
  deletedUser: User | any;
  setDeletedUser: Dispatch<SetStateAction<{}>>;
  setUsersData: Dispatch<SetStateAction<User[]>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
};

const ModalDeleteUser = (props: PropTypes) => {
  const { deletedUser, setDeletedUser, setUsersData, setToaster, session } =
    props;
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    const result = await userServices.deleteUser(
      deletedUser.id,
      session.data?.accessToken,
    );
    if (result.status === 200) {
      setIsLoading(false);
      setToaster({ variant: "success", message: "User Data Deleted" });
      setDeletedUser({});
      const { data } = await userServices.getAllUsers();
      setUsersData(data.data);
    } else {
      setToaster({ variant: "danger", message: "User Data Not Deleted" });
    }
  };
  return (
    <Modal onClose={() => setDeletedUser({})}>
      <h1 className={styles.modal__title}>Are you sure?</h1>
      <Button type="button" onClick={() => handleDelete()}>
        {isLoading ? "Loading..." : "Yes, Delete"}
      </Button>
    </Modal>
  );
};

export default ModalDeleteUser;
