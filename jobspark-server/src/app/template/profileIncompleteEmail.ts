/**
* profileIncompleteEmail.ts
*
* Returns a fully self-contained HTML email string.
* Compatible with Gmail, Outlook, Apple Mail, and mobile clients.
*
* Fixes applied:
* - Replaced EJS template tags with a plain TS function + string interpolation
* - Replaced CSS gradients (unsupported in Gmail/Outlook) with solid fallback colours
* - Replaced flexbox layout with inline-table layout for Outlook compatibility
* - Replaced box-shadow / border-radius / overflow:hidden with border-based styling
* - Added Inter font with a full web-safe fallback stack
* - Added meta charset + viewport for mobile clients
* - Added safe guard: missingItems defaults to [] if not provided
* - Added safe guard: completionPercent clamped to 0-100 so inline style is always valid
* - Added mandatory unsubscribe link (CAN-SPAM / GDPR compliance)
* - Added role="presentation" on all layout tables
* - CTA button rebuilt as a table-based button (renders correctly in Outlook)
* - Progress bar rebuilt as a nested table (no CSS gradient needed)
*/

export interface ProfileIncompleteEmailOptions {
seekerName: string;
completionPercent: number;
missingItems?: string[];
frontendUrl: string;
unsubscribeUrl: string;
}

export function profileIncompleteEmail(opts: ProfileIncompleteEmailOptions): string {
const {
seekerName,
frontendUrl,
unsubscribeUrl,
} = opts;

// ── safe defaults ────────────────────────────────────────────────────────
const missingItems: string[] = Array.isArray(opts.missingItems) ? opts.missingItems : [];
// Clamp to 0-100 so the inline width style is always a valid percentage
const completionPercent = Math.min(100, Math.max(0, Math.round(opts.completionPercent)));
// Remaining width for the grey part of the progress bar
const remainingPercent = 100 - completionPercent;

// ── missing items rows ────────────────────────────────────────────────────
const missingItemsHtml =
missingItems.length === 0
? `<p style="font-size:14px;color:#6b21a8;margin:0 0 16px;">
    Great — no critical fields missing! Just review your profile to make sure everything looks polished.
</p>`
: missingItems
.map(
(item) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:8px;">
    <tr>
        <td width="32" valign="middle" style="background:#fdf4ff;border-radius:8px 0 0 8px;padding:10px 0 10px 14px;
                       font-size:16px;line-height:1;">
            &#9888;&#65039;
        </td>
        <td valign="middle" style="background:#fdf4ff;border-radius:0 8px 8px 0;padding:10px 14px 10px 8px;
                       font-size:14px;color:#6b21a8;font-weight:600;
                       font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Inter',Arial,sans-serif;">
            ${escapeHtml(item)}
        </td>
    </tr>
</table>`,
)
.join('');

// ── full HTML string ──────────────────────────────────────────────────────
return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">

    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Complete Your JobSpark Profile</title>
        <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
        <style>
            /* Google Fonts import — renders in Gmail/Apple Mail; Outlook ignores and falls back */
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

            body,
            table,
            td,
            a {
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }

            table,
            td {
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }

            img {
                -ms-interpolation-mode: bicubic;
                border: 0;
                outline: none;
                text-decoration: none;
            }

            body {
                margin: 0 !important;
                padding: 0 !important;
                background-color: #f4f7fb;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', Arial, sans-serif;
            }

            /* Mobile styles */
            @media screen and (max-width: 620px) {
                .email-container {
                    width: 100% !important;
                }

                .content-pad {
                    padding: 20px 16px !important;
                }

                .header-pad {
                    padding: 28px 16px !important;
                }

                .footer-pad {
                    padding: 16px !important;
                }

                h1.header-title {
                    font-size: 20px !important;
                }
            }
        </style>
    </head>

    <body style="margin:0;padding:0;background-color:#f4f7fb;">

        <!-- Preheader text (hidden, shows in inbox preview) -->
        <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;
              font-size:1px;color:#f4f7fb;line-height:1px;">
            Your JobSpark profile is ${completionPercent}% complete — finish it to get 3x more recruiter views.
            &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
        </div>

        <!-- Outer wrapper -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
            style="background-color:#f4f7fb;">
            <tr>
                <td align="center" style="padding:32px 16px;">

                    <!-- Email card — max 600px -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600"
                        class="email-container" style="background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;">

                        <!-- ── HEADER ── -->
                        <tr>
                            <td class="header-pad" style="background-color:#7c3aed;border-radius:16px 16px 0 0;
                       padding:36px 30px;text-align:center;">
                                <!--[if mso]>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="background-color:#7c3aed;padding:36px 30px;text-align:center;">
              <![endif]-->
                                <h1 class="header-title" style="margin:0 0 8px;font-size:24px;font-weight:700;color:#ffffff;
                         font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Inter',Arial,sans-serif;
                         line-height:1.3;">
                                    &#10024; Your Profile is ${completionPercent}% Complete
                                </h1>
                                <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.85);
                        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Inter',Arial,sans-serif;">
                                    Finish it to unlock more job matches
                                </p>
                                <!--[if mso]></td></tr></table><![endif]-->
                            </td>
                        </tr>

                        <!-- ── BODY ── -->
                        <tr>
                            <td class="content-pad" style="padding:28px 30px;">

                                <!-- Greeting -->
                                <p style="margin:0 0 12px;font-size:16px;color:#334155;
                        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Inter',Arial,sans-serif;">
                                    Hi <strong>${escapeHtml(seekerName)}</strong>,
                                </p>
                                <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.6;
                        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Inter',Arial,sans-serif;">
                                    Recruiters are actively browsing profiles on JobSpark. A complete profile gets
                                    <strong>3&#215; more views</strong> than an incomplete one.
                                </p>

                                <!-- Progress bar — table-based, no CSS gradient needed -->
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                                    style="margin:0 0 6px;">
                                    <tr>
                                        ${
                                        completionPercent > 0
                                        ? `<td width="${completionPercent}%" height="16" valign="top" style="background-color:#7c3aed;
                                     border-radius:${remainingPercent === 0 ? '50px' : '50px 0 0 50px'};
                                     font-size:0;line-height:0;">&nbsp;</td>`
                                        : ''
                                        }
                                        ${
                                        remainingPercent > 0
                                        ? `<td width="${remainingPercent}%" height="16" valign="top" style="background-color:#e2e8f0;
                                     border-radius:${completionPercent === 0 ? '50px' : '0 50px 50px 0'};
                                     font-size:0;line-height:0;">&nbsp;</td>`
                                        : ''
                                        }
                                    </tr>
                                </table>
                                <p style="margin:0 0 24px;font-size:13px;color:#64748b;
                        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Inter',Arial,sans-serif;">
                                    <strong>${completionPercent}%</strong> complete — just a few steps to go!
                                </p>

                                <!-- Missing items heading -->
                                <h3 style="margin:0 0 10px;font-size:15px;color:#1e293b;font-weight:600;
                         font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Inter',Arial,sans-serif;">
                                    What&#39;s still missing:
                                </h3>

                                <!-- Missing items list -->
                                ${missingItemsHtml}

                                <!-- Benefit box -->
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                                    style="margin:20px 0;border:1px solid #bbf7d0;border-radius:12px;">
                                    <tr>
                                        <td style="background-color:#f0fdf4;border-radius:12px;padding:16px 20px;
                             font-size:14px;color:#166534;line-height:1.6;
                             font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Inter',Arial,sans-serif;">
                                            &#9989; Complete profiles are <strong>3&#215; more likely</strong>
                                            to get contacted by recruiters directly.
                                        </td>
                                    </tr>
                                </table>

                                <!-- CTA button — table-based for Outlook -->
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"
                                    style="margin:0 auto;">
                                    <tr>
                                        <td align="center" bgcolor="#7c3aed" style="border-radius:10px;padding:0;">
                                            <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml"
                                 xmlns:w="urn:schemas-microsoft-com:office:word"
                                 href="${frontendUrl}/jobseeker/profile"
                                 style="height:50px;v-text-anchor:middle;width:220px;"
                                 arcsize="20%" strokecolor="#7c3aed" fillcolor="#7c3aed">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:sans-serif;font-size:15px;font-weight:bold;">
                        Complete My Profile &#8594;
                      </center>
                    </v:roundrect>
                    <![endif]-->
                                            <!--[if !mso]><!-->
                                            <a href="${frontendUrl}/jobseeker/profile" target="_blank" style="display:inline-block;padding:14px 32px;background-color:#7c3aed;
                              color:#ffffff;text-decoration:none;border-radius:10px;
                              font-weight:700;font-size:15px;line-height:1;
                              font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Inter',Arial,sans-serif;">
                                                Complete My Profile &#8594;
                                            </a>
                                            <!--<![endif]-->
                                        </td>
                                    </tr>
                                </table>

                            </td>
                        </tr>

                        <!-- ── FOOTER ── -->
                        <tr>
                            <td class="footer-pad"
                                style="padding:20px 30px;border-top:1px solid #f1f5f9;text-align:center;">
                                <p style="margin:0 0 6px;font-size:12px;color:#94a3b8;
                        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Inter',Arial,sans-serif;">
                                    You received this because your JobSpark profile is incomplete.
                                </p>
                                <p style="margin:0;font-size:12px;color:#94a3b8;
                        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Inter',Arial,sans-serif;">
                                    <a href="${frontendUrl}" target="_blank"
                                        style="color:#7c3aed;text-decoration:underline;">Visit JobSpark</a>
                                    &nbsp;&#183;&nbsp;
                                    <!-- Unsubscribe link — required by CAN-SPAM and GDPR -->
                                    <a href="${unsubscribeUrl}" target="_blank"
                                        style="color:#94a3b8;text-decoration:underline;">Unsubscribe</a>
                                </p>
                            </td>
                        </tr>

                    </table>
                    <!-- /email card -->

                </td>
            </tr>
        </table>

    </body>

</html>`;
}

// ── helper ───────────────────────────────────────────────────────────────────

/** Escape user-supplied strings so they can't inject HTML into the email. */
function escapeHtml(str: string): string {
return str
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;' ) .replace( />/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&#39;');
}