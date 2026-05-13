import cron from 'node-cron';
import { JobService } from '../module/job/job.service';

export const initCronJobs = () => {
    // Run every hour to check for expired jobs
    cron.schedule('0 * * * *', async () => {
        console.log('[Cron] Checking for expired jobs...');
        try {
            await JobService.updateExpiredJobs();
        } catch (error) {
            console.error('[Cron Error] Failed to update expired jobs:', error);
        }
    });

    // Run once on startup to sync
    JobService.updateExpiredJobs().catch(err => console.error('[Startup Error] Job sync failed:', err));

    console.log('✅ Cron jobs initialized.');
};
