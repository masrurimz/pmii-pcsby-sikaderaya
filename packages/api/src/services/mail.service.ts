import { config } from "../config/config";
import nodemailer from "nodemailer";

const client = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.mail.user,
        pass: config.mail.password,
    },
})

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
    const data = await client.sendMail({
        from: config.mail.fromAddress,
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
  const data = await client.sendMail({
    from: config.mail.fromAddress,
    to: email,
    subject: "Invitation",
    html,
  });
  return data;
};
