import { BrevoClient } from '@getbrevo/brevo';
import { envVars } from '../config/env';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ejs from 'ejs';
import { AppError } from '../errorHelpers/AppError';
import httpStatus from 'http-status';

const brevo = new BrevoClient({
    apiKey: envVars.BREVO_API_KEY,
});

interface sendEmailOptions {
    to: string;
    subject: string;
    templateName?: string;
    templateData?: Record<string, any>;
    htmlBody?: string;
    attachments?: {
        filename: string;
        content: Buffer | string;
        contentType: string;
    }[];
}

export const sendEmail = async ({
    to,
    subject,
    templateName,
    templateData,
    htmlBody,
    attachments,
}: sendEmailOptions) => {
    try {
        let html = htmlBody;

        if (!html && templateName) {
            // ── Resolve template path ─────────────────────────────────────
            const builtPath = path.resolve(process.cwd(), "dist/src/app/template", `${templateName}.ejs`);
            const sourcePath = path.resolve(process.cwd(), "src/app/template", `${templateName}.ejs`);
            const currentFileDir = path.dirname(fileURLToPath(import.meta.url));
            const relativeTemplatePath = path.resolve(currentFileDir, "../template", `${templateName}.ejs`);

            let templatePath = "";
            if (fs.existsSync(builtPath)) templatePath = builtPath;
            else if (fs.existsSync(sourcePath)) templatePath = sourcePath;
            else if (fs.existsSync(relativeTemplatePath)) templatePath = relativeTemplatePath;

            if (!templatePath) {
                console.error(`[Email] ❌ Template not found: ${templateName}`, { builtPath, sourcePath });
                throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Email template ${templateName} not found`);
            }

            console.log(`[Email] Using template: ${templatePath}`);

            html = await ejs.renderFile(templatePath, templateData);
        }

        if (!html) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "No HTML body or template provided for email");
        }

        // ── Debug Logs ────────────────────────────────────────────────
        console.log(`[Email Debug] Sender Name: "${envVars.BREVO_FROM_NAME}"`);
        console.log(`[Email Debug] Sender Email: "${envVars.BREVO_FROM_EMAIL}"`);
        console.log(`[Email Debug] Recipient: "${to}"`);

        const response = await brevo.transactionalEmails.sendTransacEmail({
            subject,
            htmlContent: html,
            sender: {
                name: envVars.BREVO_FROM_NAME,
                email: envVars.BREVO_FROM_EMAIL,
            },
            to: [{ email: to }],
            ...(attachments?.length && {
                attachment: attachments.map((a) => ({
                    name: a.filename,
                    content: Buffer.isBuffer(a.content)
                        ? a.content.toString('base64')
                        : Buffer.from(a.content).toString('base64'),
                })),
            }),
        });

        console.log(`[Email] ✅ Email sent to ${to} — messageId=${(response as any)?.messageId}`);

    } catch (error: any) {
        console.error("[Email] ❌ sendEmail failed:", {
            message: error?.message,
            stack: error?.stack,
            templateName,
        });
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to send email");
    }
};
