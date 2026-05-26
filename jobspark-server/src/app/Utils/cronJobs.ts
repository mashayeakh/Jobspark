import cron from 'node-cron';
import { JobService } from '../module/job/job.service';
import { NewsletterService } from '../module/newsletter/newsletter.service';

export const initCronJobs = () => {
    // ── Expire old jobs (every hour) ─────────────────────────────────
    cron.schedule('0 * * * *', async () => {
        console.log('[Cron] Checking for expired jobs...');
        try {
            await JobService.updateExpiredJobs();
        } catch (error) {
            console.error('[Cron Error] Failed to update expired jobs:', error);
        }
    });

    // ── Weekly Digest — every Monday at 9:00 AM ───────────────────────
    cron.schedule('0 9 * * 1', async () => {
        console.log('[Cron] Sending weekly job digests...');
        try {
            await NewsletterService.sendWeeklyDigests();
        } catch (error) {
            console.error('[Cron Error] Weekly digest failed:', error);
        }
    });

    // ── Profile Completion Reminders — every Wednesday at 10:00 AM ───
    cron.schedule('0 10 * * 3', async () => {
        console.log('[Cron] Sending profile completion reminders...');
        try {
            await NewsletterService.sendProfileReminders();
        } catch (error) {
            console.error('[Cron Error] Profile reminders failed:', error);
        }
    });

    // ── Inactivity Engagement — every Friday at 11:00 AM ─────────────
    cron.schedule('0 11 * * 5', async () => {
        console.log('[Cron] Sending inactivity engagement emails...');
        try {
            await NewsletterService.sendInactivityEmails();
        } catch (error) {
            console.error('[Cron Error] Inactivity emails failed:', error);
        }
    });

    // ── Sync expired jobs on startup ─────────────────────────────────
    JobService.updateExpiredJobs().catch(err => console.error('[Startup Error] Job sync failed:', err));

    console.log('✅ Cron jobs initialized (expired jobs, weekly digest, profile reminders, inactivity).');
};
