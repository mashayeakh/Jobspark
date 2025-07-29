import React from 'react';
import SuspendedProfileOverview from './SuspendedProfileOverview';
import SuspensionDetails from './SuspensionDetails';
import ApplicationAndActivity from './ApplicationAndActivity';
import ActionSection from './ActionSection';

const SuspendedProfilesPage = () => {
    // Hardcoded profiles data
    const profiles = [
        {
            name: "Karim",
            email: "karim@gmail.com",
            location: "Lahore",
            skills: ["Node.js", "Express.js"],
            experienceLevel: "Junior Level (0-1 years)",
            profileComplete: false,
            suspensionDate: "2025-07-28",
            suspensionReason: "Incomplete profile",
            suspendedBy: "Admin",
            applications: [/* job application data */],
            recentActivity: "No recent activity"
        },
        {
            name: "Nourin",
            email: "nourin@gmail.com",
            location: "Karachi",
            skills: ["React", "Node.js"],
            experienceLevel: "Mid Level (2-3 years)",
            profileComplete: true,
            suspensionDate: "2025-07-20",
            suspensionReason: "Suspicious activity",
            suspendedBy: "Admin",
            applications: [/* job application data */],
            recentActivity: "Applied to 3 jobs"
        },
        {
            name: "Nourin",
            email: "nourin@gmail.com",
            location: "Karachi",
            skills: ["React", "Node.js"],
            experienceLevel: "Mid Level (2-3 years)",
            profileComplete: true,
            suspensionDate: "2025-07-20",
            suspensionReason: "Suspicious activity",
            suspendedBy: "Admin",
            applications: [/* job application data */],
            recentActivity: "Applied to 3 jobs"
        },
        // 3 more profiles...
    ];

    return (
        <div className="suspended-profile-page p-6">
            <h2 className="text-2xl font-semibold mb-6">Suspended Job Seeker Profiles</h2>
            <div className="profiles-list">
                {profiles.map((profile, index) => (
                    <div key={index} className="profile-container mb-8">
                        <SuspendedProfileOverview profile={profile} />
                        <SuspensionDetails profile={profile} />
                        <ApplicationAndActivity profile={profile} />
                        <ActionSection profile={profile} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuspendedProfilesPage;
