import { sendEmail } from '@/app/Utils/sendEmail';

const ADMIN_EMAIL = 'islammasayekh@gmail.com';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const subjectMap: Record<string, string> = {
  general: 'General Inquiry',
  support: 'Technical Support',
  sales: 'Sales & Enterprise',
  billing: 'Billing Question',
  feedback: 'Product Feedback',
};

const sendContactMessage = async (data: ContactFormData) => {
  const { name, email, subject, message } = data;

  const readableSubject = subjectMap[subject] || subject;

  // Send the contact message to the admin
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `[JobSpark Contact] ${readableSubject} — from ${name}`,
    templateName: 'contact-message',
    templateData: {
      senderName: name,
      senderEmail: email,
      subject: readableSubject,
      message,
    },
  });

  return { message: 'Contact message sent successfully' };
};

export const ContactService = {
  sendContactMessage,
};
