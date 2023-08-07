import { Resend } from "resend";
import { config } from "../config/config";

const resend = new Resend(config.resendApiKey);

export const sendResetPasswordMail = async (email: string, token: string) => {
  const resetPasswordUrl = `${config.appUrl}${config.resetPasswordPath}?token=${token}`;
  const html = `
    <div>
        <p>Hi,</p>
        <p>You have requested to reset your password.</p>
        <p>Click <a href="${resetPasswordUrl}">here</a> to reset your password.</p>
        <p>If you did not request to reset your password, please ignore this email.</p>
        <p>Regards,</p>
        <p>${config.appName}</p>
    </div>
    `;
  try {
    const data = await resend.emails.send({
      from: config.mailFromAddress,
      to: email,
      subject: "Reset Password",
      html,
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const sendInvitationMail = async (email: string, token: string) => {
  const resetPasswordUrl = `${config.appUrl}${config.resetPasswordPath}?token=${token}`;
  const html = `
    <div>
        <p>Hi,</p>
        <p>You have been invited to join ${config.appName}.</p>
        <p>Click <a href="${resetPasswordUrl}">here</a> to set password.</p>
        <p>Regards,</p>
        <p>${config.appName}</p>
    </div>
    `;
  const data = await resend.emails.send({
    from: config.mailFromAddress,
    to: email,
    subject: "Invitation",
    html,
  });
  return data;
};
