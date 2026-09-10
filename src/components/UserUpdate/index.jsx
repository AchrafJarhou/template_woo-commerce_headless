import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateCurrentUserThunk } from "../../thunkActionsCreator/userThunks";
import { useTranslation } from "react-i18next";

export function UserUpdate() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const profile = user?.profile;
  const [newEmail, setNewEmail] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  useEffect(() => {
    profile && profile.email ? setNewEmail(profile.email) : null;
    profile && profile.firstName ? setNewFirstName(profile.firstName) : null;
    profile && profile.lastName ? setNewLastName(profile.lastName) : null;
  }, [profile]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    dispatch(
      updateCurrentUserThunk({
        email: newEmail || undefined,
        firstName: newFirstName || undefined,
        lastName: newLastName || undefined,
        password: newPassword || undefined,
      }),
    );
  };
  return (
    <div>
      <h3>{t("auth.editProfile")}</h3>
      <form onSubmit={handleUpdateProfile}>
        <input
          type="email"
          placeholder={t("auth.newEmailPlaceholder")}
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder={t("common.firstName")}
          value={newFirstName}
          onChange={(e) => setNewFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder={t("common.lastName")}
          value={newLastName}
          onChange={(e) => setNewLastName(e.target.value)}
        />
        <input
          type="password"
          placeholder={t("auth.newPasswordPlaceholder")}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit" disabled={user.loading}>
          {user.loading ? t("common.updating") : t("account.updateProfile")}
        </button>
      </form>
    </div>
  );
}
