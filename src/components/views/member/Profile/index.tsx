import MemberLayout from "@/components/layouts/MemberLayout";
import styles from "./Profile.module.scss";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { uploadFile } from "@/lib/firebase/service";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import userServices from "@/services/user";
import { User } from "@/type/user.type";

type PropTypes = {
  profile: User | any;
  setProfile: Dispatch<SetStateAction<any>>;
  session: any;
  setToaster: Dispatch<SetStateAction<{}>>;
};

const ProfileMemberView = ({
  profile,
  setProfile,
  session,
  setToaster,
}: PropTypes) => {
  const [changeImage, setChangeImage] = useState<File | any>({});
  const [isLoadingPicture, setIsLoadingPicture] = useState<boolean>(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState<boolean>(false);
  const handelChangeProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoadingProfile(true);
    // setError("");
    const form = event.target as HTMLFormElement;
    const data = {
      fullname: form.fullname.value,
      phone: form.phone.value,
    };
    const result = await userServices.updateProfile(
      data,
      session.data?.accessToken,
    );
    if (result.status === 200) {
      setIsLoadingProfile(false);
      setProfile({ ...profile, fullname: data.fullname, phone: data.phone });
      form.reset();
      setToaster({
        variant: "success",
        message: "Update Profile Successed",
      });
    } else {
      setIsLoadingProfile(false);
    }
  };

  const handleChangeProfilePicture = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoadingPicture(true);
    const form = event.target as HTMLFormElement;
    const file = form.image.files[0];
    if (file) {
      uploadFile(
        profile.id,
        file,
        async (status: boolean, newImageURL: string) => {
          if (status) {
            const data = {
              image: newImageURL,
            };
            const result = await userServices.updateProfile(
              data,
              session.data?.accessToken,
            );
            if (result.status === 200) {
              setIsLoadingPicture(false);
              setProfile({ ...profile, image: newImageURL });
              setChangeImage({});
              form.reset();
              setToaster({
                variant: "success",
                message: "Change Profile Picture Successed",
              });
            } else {
              setIsLoadingPicture(false);
            }
          } else {
            setToaster({
              variant: "warning",
              message: "Image too big, please upload an image less than 1MB",
            });
            setIsLoadingPicture(false);
            setChangeImage({});
            form.reset();
          }
        },
      );
    } else {
      setToaster({
        variant: "warning",
        message: "Choose an image",
      });
      setIsLoadingPicture(false);
    }
  };

  const handelChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoadingPassword(true);
    const form = event.target as HTMLFormElement;
    const data = {
      password: form["new-password"].value,
      oldPassword: form["old-password"].value,
      encryptedPassword: profile.password,
    };

    const result = await userServices.updateProfile(
      data,
      session.data?.accessToken,
    );

    try {
      if (result.status === 200) {
        setIsLoadingPassword(false);
        form.reset();
        setToaster({
          variant: "success",
          message: "Password Updated",
        });
      }
    } catch (error) {
      setIsLoadingPassword(false);
      setToaster({
        variant: "danger",
        message: "Password Update Failed",
      });
    }
  };

  return (
    <MemberLayout>
      <h1 className={styles.profile__title}>Profile</h1>
      <div className={styles.profile__main}>
        <div className={styles.profile__main__row}>
          <div className={styles.profile__main__row__avatar}>
            <h2 className={styles.profile__main__row__avatar__title}>Avatar</h2>
            {profile.image ? (
              <Image
                className={styles.profile__main__row__avatar__image}
                src={profile.image}
                alt="profile"
                width={200}
                height={200}
              />
            ) : (
              <div className={styles.profile__main__row__avatar__image}>
                {profile.fullname?.charAt(0)}
              </div>
            )}
            <form onSubmit={handleChangeProfilePicture}>
              <label
                className={styles.profile__main__row__avatar__label}
                htmlFor="upload-image"
              >
                {changeImage?.name ? (
                  <p>{changeImage?.name}</p>
                ) : (
                  <>
                    <p>
                      Upload a new avatar, larger image will be resized
                      automatically
                    </p>
                    <p>
                      <br /> Maximum size: <b>1MB</b>
                    </p>
                  </>
                )}
              </label>
              <input
                className={styles.profile__main__row__avatar__input}
                type="file"
                name="image"
                id="upload-image"
                onChange={(event: any) => {
                  event.preventDefault();
                  setChangeImage(event.currentTarget.files[0]);
                }}
              />
              <Button
                className={styles.profile__main__row__avatar__button}
                type="submit"
                variant="primary"
              >
                {isLoadingPicture ? "Uploading..." : "Change Picture"}
              </Button>
            </form>
          </div>
          <div className={styles.profile__main__row__detail}>
            <form onSubmit={handelChangeProfile}>
              <h2 className={styles.profile__main__row__detail__title}>
                Profile
              </h2>
              <Input
                label="Fullname"
                type="text"
                name="fullname"
                defaultValue={profile.fullname}
              />
              <Input
                label="Phone"
                type="number"
                name="phone"
                placeholder="Input your phone number"
                defaultValue={profile.phone}
              />
              <Input
                label="Email"
                type="email"
                name="email"
                defaultValue={profile.email}
                disabled
              />
              <Input
                label="Role"
                type="role"
                name="role"
                defaultValue={profile.role}
                disabled
              />
              {/* <Input */}
              {/*   label="Password" */}
              {/*   type="password" */}
              {/*   name="password" */}
              {/*   defaultValue={profile.password} */}
              {/* /> */}
              <Button type="submit" variant="primary">
                {isLoadingProfile ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </div>
          <div className={styles.profile__main__row__password}>
            <h2>Change Password</h2>
            <form onSubmit={handelChangePassword}>
              <Input
                name="old-password"
                label="Old Password"
                type="password"
                placeholder="Enter your current password"
                disabled={profile.type === "google"}
              />
              <Input
                name="new-password"
                label="New Password"
                type="password"
                placeholder="Enter your new password"
                disabled={profile.type === "google"}
              />
              <Button
                type="submit"
                variant="primary"
                disabled={isLoadingPassword || profile.type === "google"}
              >
                {isLoadingPassword ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
};

export default ProfileMemberView;
