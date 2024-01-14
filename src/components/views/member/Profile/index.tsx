import MemberLayout from "@/components/layouts/MemberLayout";
import styles from "./Profile.module.scss";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { uploadFile } from "@/lib/firebase/service";
import { useState } from "react";
import userServices from "@/services/user";

const ProfileMemberView = ({ profile, setProfile, session }: any) => {
  const [changeImage, setChangeImage] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleChangeProfilePicture = (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    const file = event.target[0]?.files[0];
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
              profile.id,
              data,
              session.data?.accessToken,
            );
            if (result.status === 200) {
              setIsLoading(false);
              setProfile({ ...profile, image: newImageURL });
              setChangeImage({});
              event.target[0].value = "";
            } else {
              setIsLoading(false);
            }
          } else {
            setIsLoading(false);
            setChangeImage({});
            alert("Image is too big, please select image with less than 1MB");
          }
        },
      );
    } else {
      setIsLoading(false);
      alert("Please select image");
    }
  };
  return (
    <MemberLayout>
      <h1 className={styles.profile__title}>Profile</h1>
      <div className={styles.profile__main}>
        <div className={styles.profile__main__avatar}>
          <form onSubmit={handleChangeProfilePicture}>
            {profile.image ? (
              <Image
                className={styles.profile__main__avatar__image}
                src={profile.image}
                alt="profile"
                width={200}
                height={200}
              />
            ) : (
              <div className={styles.profile__main__avatar__image}>
                {profile.fullname?.charAt(0)}
              </div>
            )}
            <label
              className={styles.profile__main__avatar__label}
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
              className={styles.profile__main__avatar__input}
              type="file"
              name="image"
              id="upload-image"
              onChange={(event: any) => {
                event.preventDefault();
                setChangeImage(event.currentTarget.files[0]);
              }}
            />
            <Button
              className={styles.profile__main__avatar__button}
              type="submit"
              variant="primary"
            >
              {isLoading ? "Uploading..." : "Change Picture"}
            </Button>
          </form>
        </div>
        <div className={styles.profile__main__detail}>
          <form>
            <Input
              label="Fullname"
              type="text"
              name="fullname"
              defaultValue={profile.fullname}
            />
            <Input
              label="Email"
              type="email"
              name="email"
              defaultValue={profile.email}
            />
            <Input
              label="Phone"
              type="number"
              name="phone"
              defaultValue={profile.phone}
            />
            <Button type="submit" variant="primary">
              Update Profile
            </Button>
            {/* <Input */}
            {/*   label="Password" */}
            {/*   type="password" */}
            {/*   name="password" */}
            {/*   defaultValue={profile.password} */}
            {/* /> */}
          </form>
        </div>
      </div>
    </MemberLayout>
  );
};

export default ProfileMemberView;
