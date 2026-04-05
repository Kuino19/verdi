import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendAmbassadorWelcome = async (email: string, name: string, password: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Verdi <onboarding@resend.dev>', // Replace with your domain once verified on Resend
      to: [email],
      subject: 'Welcome to the Verdi Ambassador Programme! 🎓⚖️',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #020617; color: #ffffff; padding: 40px; border-radius: 24px; border: 1px solid #111827;">
          <h1 style="color: #C9A227; font-style: italic; font-weight: 800; margin-bottom: 24px;">VERDI</h1>
          
          <p style="font-size: 18px; line-height: 1.6; color: #cbd5e1;">Hello <strong>${name}</strong>,</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #94a3b8;">
            Congratulations! You have been officially selected as a <strong>Verdi Ambassador</strong>. 
            As part of our elite circle of student leaders, we have granted your account <strong>lifetime Premium access</strong> to all Verdi features.
          </p>
          
          <div style="background-color: #0f172a; padding: 24px; border-radius: 16px; margin: 32px 0; border: 1px solid #1e293b;">
            <p style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #C9A227; font-weight: 900;">Your Login Credentials</p>
            <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 0; font-size: 14px;"><strong>Temporary Password:</strong> <code style="background-color: #1e293b; padding: 4px 8px; border-radius: 4px; color: #ffffff;">${password}</code></p>
          </div>
          
          <p style="font-size: 14px; color: #64748b; font-style: italic; margin-bottom: 32px;">
            *Please change your password in the Profile settings once you log in.
          </p>
          
          <a href="https://verdi.web.app" style="display: inline-block; background-color: #C9A227; color: #020617; padding: 16px 32px; border-radius: 12px; font-weight: 900; text-decoration: none; text-transform: uppercase; font-size: 12px; letter-spacing: 0.05em;">Launch Verdi Academy</a>
          
          <hr style="border: 0; border-top: 1px solid #1e293b; margin: 40px 0;">
          
          <p style="font-size: 12px; text-align: center; color: #475569;">
            © 2026 Verdi Legal Academy. All rights reserved.
          </p>
        </div>
      `
    });

    if (error) {
      console.error(`Resend Error for ${email}:`, error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error(`Email Exception for ${email}:`, err);
    return { success: false, error: err };
  }
};
