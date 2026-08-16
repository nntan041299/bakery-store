import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/user/selectors";
import Layout from "@/layouts/Layout";
import { SectionCard, Field, Input } from "@/components/Form";
import PasswordInput from "@/components/PasswordInput";
import { useUpdateProfile } from "@/hook/useUpdateProfile";
import { useChangePassword } from "@/hook/useChangePassword";
import { ACCOUNT_TEXT } from "@/constant/account";
import { FONT_DISPLAY, FONT_SANS } from "@/constant/common";

interface FormState {
  fullName: string;
  email: string;
}

interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const EMPTY_PASSWORD_FORM: PasswordFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const Account = () => {
  const user = useSelector(selectUser);

  const [profileForm, setProfileForm] = useState<FormState>(() => ({
    fullName: [user.firstName, user.lastName].filter(Boolean).join(" "),
    email: user.email ?? "",
  }));
  const [profileValidationError, setProfileValidationError] = useState("");

  const [passwordForm, setPasswordForm] = useState<PasswordFormState>(
    EMPTY_PASSWORD_FORM,
  );
  const [passwordValidationError, setPasswordValidationError] = useState("");

  const {
    saveProfile,
    isPending: savingProfile,
    error: profileError,
    success: profileSuccess,
  } = useUpdateProfile();

  const {
    changePassword,
    isPending: savingPassword,
    error: passwordError,
    success: passwordSuccess,
  } = useChangePassword();

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileValidationError("");
    setProfileForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileValidationError("");
    if (!profileForm.fullName.trim()) {
      setProfileValidationError(ACCOUNT_TEXT.ERROR_FULL_NAME_REQUIRED);
      return;
    }
    saveProfile({
      fullName: profileForm.fullName.trim(),
      email: profileForm.email.trim() || undefined,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValidationError("");
    setPasswordForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordValidationError("");
    if (!passwordForm.currentPassword) {
      setPasswordValidationError(ACCOUNT_TEXT.ERROR_CURRENT_PASSWORD_REQUIRED);
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordValidationError(ACCOUNT_TEXT.ERROR_PASSWORD_TOO_SHORT);
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordValidationError(ACCOUNT_TEXT.ERROR_PASSWORD_MISMATCH);
      return;
    }
    changePassword(
      {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      },
      () => setPasswordForm(EMPTY_PASSWORD_FORM),
    );
  };

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    ACCOUNT_TEXT.DEFAULT_USER_NAME;
  const initials =
    user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user.firstName
        ? user.firstName[0].toUpperCase()
        : "?";

  const profileErrorMessage = profileValidationError || profileError;
  const passwordErrorMessage = passwordValidationError || passwordError;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 space-y-6">
        {/* Page header */}
        <div>
          <h1
            className="text-2xl font-bold text-surface-900"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            {ACCOUNT_TEXT.TITLE}
          </h1>
          <p
            className="text-sm text-surface-500 mt-1"
            style={{ fontFamily: FONT_SANS }}
          >
            {ACCOUNT_TEXT.SUBTITLE}
          </p>
        </div>

        {/* Avatar + name banner */}
        <div className="bg-ink-900 rounded-2xl px-6 py-5 flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full overflow-hidden bg-white/10 flex items-center
                       justify-center text-parchment text-xl font-bold flex-shrink-0"
            style={{ fontFamily: FONT_SANS }}
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div>
            <p
              className="text-white font-semibold text-base"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              {fullName}
            </p>
            <p
              className="text-white/50 text-sm"
              style={{ fontFamily: FONT_SANS }}
            >
              @{user.username}
            </p>
          </div>
        </div>

        {/* Profile section */}
        <SectionCard title={ACCOUNT_TEXT.PROFILE_SECTION_TITLE}>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Field label={ACCOUNT_TEXT.LABEL_FULL_NAME}>
              <Input
                name="fullName"
                value={profileForm.fullName}
                onChange={handleProfileChange}
                placeholder={ACCOUNT_TEXT.PLACEHOLDER_FULL_NAME}
              />
            </Field>
            <Field label={ACCOUNT_TEXT.LABEL_EMAIL}>
              <Input
                name="email"
                type="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                placeholder={ACCOUNT_TEXT.PLACEHOLDER_EMAIL}
              />
            </Field>
            {profileErrorMessage && (
              <p
                className="text-sm text-red-500"
                style={{ fontFamily: FONT_SANS }}
              >
                {profileErrorMessage}
              </p>
            )}
            {profileSuccess && (
              <p
                className="text-sm text-sage-600"
                style={{ fontFamily: FONT_SANS }}
              >
                {profileSuccess}
              </p>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-5 py-2.5 rounded-xl bg-ink-900 text-parchment text-sm font-semibold
                           hover:bg-ink-800 transition-colors duration-150 cursor-pointer
                           disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: FONT_SANS }}
              >
                {savingProfile ? ACCOUNT_TEXT.SAVING : ACCOUNT_TEXT.SAVE_CHANGES}
              </button>
            </div>
          </form>
        </SectionCard>

        {/* Change password section */}
        <SectionCard title={ACCOUNT_TEXT.PASSWORD_SECTION_TITLE}>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Field label={ACCOUNT_TEXT.LABEL_CURRENT_PASSWORD}>
              <PasswordInput
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder={ACCOUNT_TEXT.PLACEHOLDER_CURRENT_PASSWORD}
              />
            </Field>
            <Field label={ACCOUNT_TEXT.LABEL_NEW_PASSWORD}>
              <PasswordInput
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder={ACCOUNT_TEXT.PLACEHOLDER_NEW_PASSWORD}
              />
            </Field>
            <Field label={ACCOUNT_TEXT.LABEL_CONFIRM_PASSWORD}>
              <PasswordInput
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder={ACCOUNT_TEXT.PLACEHOLDER_CONFIRM_PASSWORD}
              />
            </Field>

            {passwordErrorMessage && (
              <p
                className="text-sm text-red-500"
                style={{ fontFamily: FONT_SANS }}
              >
                {passwordErrorMessage}
              </p>
            )}
            {passwordSuccess && (
              <p
                className="text-sm text-sage-600"
                style={{ fontFamily: FONT_SANS }}
              >
                {passwordSuccess}
              </p>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={savingPassword}
                className="px-5 py-2.5 rounded-xl bg-ink-900 text-parchment text-sm font-semibold
                           hover:bg-ink-800 transition-colors duration-150 cursor-pointer
                           disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: FONT_SANS }}
              >
                {savingPassword
                  ? ACCOUNT_TEXT.CHANGING_PASSWORD
                  : ACCOUNT_TEXT.CHANGE_PASSWORD}
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </Layout>
  );
};

export default Account;
