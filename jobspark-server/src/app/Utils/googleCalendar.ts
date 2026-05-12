import { google } from 'googleapis';
import { envVars } from '../config/env';

const oauth2Client = new google.auth.OAuth2(
  envVars.GOOGLE_CLIENT_ID,
  envVars.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

console.log(`[Google Calendar] Initializing with Client ID: ${envVars.GOOGLE_CLIENT_ID.substring(0, 10)}...`);

oauth2Client.setCredentials({
  refresh_token: envVars.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

/**
 * Generates a Google Meet link by creating a temporary event
 * @param summary Title of the meeting
 * @param startTime Start time (Date object)
 * @param endTime End time (Date object)
 * @returns The Google Meet link
 */
export const generateMeetLink = async (summary: string, startTime: Date, durationInMinutes: number = 45) => {
  const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: {
        summary,
        description: 'Interview scheduled via JobSpark platform',
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'UTC',
        },
        conferenceData: {
          createRequest: {
            requestId: `interview-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      },
    });

    return response.data.hangoutLink;
  } catch (error) {
    console.error('[Google Calendar] ❌ Failed to generate Meet link:', error);
    return null;
  }
};
