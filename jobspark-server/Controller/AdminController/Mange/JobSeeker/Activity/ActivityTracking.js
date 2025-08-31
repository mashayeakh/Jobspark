// Correct ESM imports
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

// Correct ESM imports
import UserModel from "../../../../../Model/AccountModel/UserModel.js";
import JobApplicationModel from "../../../../../Model/JobApplicationModel/JobApplicationModel.js";
import ActiveJobs from "../../../../../Model/RecruiterModel/ActiveJobsModel.js";


// GET - admin/jobseeker/active
const jobSeekerActivity = async (req, res) => {
    try {
        // Aggregate JobApplications to count applications per user
        const topUsers = await JobApplicationModel.aggregate([
            {
                $group: {
                    _id: "$user",             // group by user
                    totalApplications: { $sum: 1 } // count applications
                }
            },
            { $sort: { totalApplications: -1 } }, // sort descending
            { $limit: 5 },                        // get top 5
            {
                $lookup: {                          // join with UserModel to get user info
                    from: "users",                     // name of the User collection
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            { $unwind: "$userInfo" },             // flatten array
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    name: "$userInfo.name",
                    email: "$userInfo.email",
                    totalApplications: 1
                }
            }
        ]);

        res.json(topUsers);
        // res.status(200).json({
        //     success: true,
        //     message: `Inactive users for last ${days} days`,
        //     data: topUsers
        // });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


//get - get inactive seekers more thatn 30+
const getInactiveSeekers = async (req, res) => {
    try {
        // Optional: let admin provide number of days via query, default 30
        const days = parseInt(req.query.days) || 30;
        if (days <= 0) {
            return res.status(400).json({ success: false, message: "Days must be greater than 0" });
        }

        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - days);

        // Aggregate JobApplications to get last applied date per user
        const inactiveApplications = await JobApplicationModel.aggregate([
            {
                $group: {
                    _id: "$user",
                    lastApplied: { $max: "$appliedAt" }
                }
            },
            {
                $match: {
                    lastApplied: { $lte: thresholdDate } // inactive for given days
                }
            }
        ]);

        if (!inactiveApplications.length) {
            return res.status(200).json({ success: true, message: `No inactive users for last ${days} days`, data: [] });
        }

        // Fetch full user info
        const inactiveUsers = await UserModel.find({
            _id: { $in: inactiveApplications.map(a => a._id) }
        }).select("name email createdAt");

        // Add inactiveDays to each user
        const today = new Date();
        const result = inactiveUsers.map(user => {
            const lastAppliedRecord = inactiveApplications.find(a => a._id.toString() === user._id.toString());
            const lastApplied = lastAppliedRecord ? new Date(lastAppliedRecord.lastApplied) : null;
            const inactiveDays = lastApplied ? Math.floor((today - lastApplied) / (1000 * 60 * 60 * 24)) : null;

            return {
                ...user.toObject(),
                inactiveDays
            };
        });

        res.status(200).json({
            success: true,
            message: `Inactive users for last ${days} days`,
            data: result
        });

    } catch (error) {
        console.error("Error fetching inactive seekers:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

//daily activity - week wise
// get - admin/jobseeker/daily
const getDailyActiveSeekers = async (req, res) => {
    try {
        const dailyStats = await JobApplicationModel.aggregate([
            {
                $group: {
                    _id: {
                        dayOfWeek: { $dayOfWeek: "$appliedAt" } // 1 = Sunday, 7 = Saturday
                    },
                    active: { $addToSet: "$user" }, // unique active seekers
                    totalApps: { $sum: 1 }, // total applications
                    avgTime: { $avg: { $hour: "$appliedAt" } } // example: avg applied hour
                }
            },
            {
                $project: {
                    dayOfWeek: "$_id.dayOfWeek",
                    active: { $size: "$active" }, // convert users set to count
                    avgTime: 1,
                    totalApps: 1,
                    _id: 0
                }
            },
            { $sort: { dayOfWeek: 1 } }
        ]);

        // Map numeric day → string label
        const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const formatted = dailyStats.map(stat => ({
            day: daysMap[stat.dayOfWeek - 1],
            active: stat.active,
            avgTime: Math.round(stat.avgTime) || 0, // avg application hour as placeholder
            totalApps: stat.totalApps
        }));

        res.status(200).json({
            success: true,
            message: "Daily active seekers",
            data: formatted
        });
    } catch (err) {
        console.error("Error fetching daily activity:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

//get top most skills
//get - jobseeker/top-skills
const topSkills = async (req, res) => {
    try {
        const jobs = await ActiveJobs.find({}, "skills");

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ success: false, message: "No jobs found" });
        }

        // Step 1: Flatten all skills into one array
        let allSkills = [];
        jobs.forEach(job => {
            if (job.skills) {
                const all = job.skills.split(",").map(s => s.trim().toLowerCase())
                allSkills.push(...all);
            }
        })

        console.log("ALLLLL ", allSkills);

        // Step 2: Count frequencies
        const skillCount = {};
        allSkills.forEach(skill => {
            skillCount[skill] = (skillCount[skill] || 0) + 1;
        });

        // Step 3: Convert to sorted array
        const sortedSkills = Object.entries(skillCount)
            .map(([skill, count]) => ({ skill, count }))
            .sort((a, b) => b.count - a.count);

        res.status(200).json({
            success: true,
            message: "Top skills",
            data: sortedSkills.slice(0, 10) // top 10
        });
    } catch (err) {
        console.error("Error in topSkills:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

//get experience level
//get - jobseeker/experience-level
const getExperienceLevel = async (req, res) => {
    try {
        const result = await UserModel.aggregate([
            {
                $group: {
                    _id: "$experienceLevel", // group by experienceLevel
                    count: { $sum: 1 }      // count how many
                }
            }
        ]);

        // ✅ validation: no data found
        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No experience level data found",
                data: []
            });
        }

        // map into categories
        const mapped = result.map(item => {
            let category = "Other";

            if (item._id === "Junior" || item._id === "Junior Level (0-1 years)") {
                category = "Junior level Dev";
            } else if (item._id === "Mid" || item._id === "Mid Level (1-3 years)") {
                category = "Mid level Dev";
            } else if (item._id === "Senior" || item._id === "Senior Level (3-5 years)") {
                category = "Senior level Dev";
            }

            return {
                category,
                count: item.count
            };
        });

        // merge duplicates (if multiple DB labels map to same category)
        const merged = Object.values(
            mapped.reduce((acc, cur) => {
                if (!acc[cur.category]) {
                    acc[cur.category] = { category: cur.category, count: 0 };
                }
                acc[cur.category].count += cur.count;
                return acc;
            }, {})
        );

        // ✅ success response
        return res.status(200).json({
            success: true,
            message: "Experience levels fetched successfully",
            data: merged
        });
    } catch (err) {
        console.error("Error fetching experience levels:", err);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching experience levels",
            error: err.message
        });
    }
};

//get the location 
//get - jobseeker/locations
const getLocations = async (req, res) => {
    try {
        const result = await UserModel.aggregate([
            {
                $group: {
                    _id: "$location",   // group by location
                    //count users
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: { count: -1 }   // optional: sort by most users
            }
        ]);

        // map to a cleaner format
        const locations = result.map(item => ({
            location: item._id || "Unknown", // handle null/empty
            count: item.count
        }));

        res.status(200).json({
            success: true,
            message: "fetched users based on location",
            data: locations
        });
    } catch (err) {
        console.error("Error fetching locations:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// popular job categories
//get - jobseeker/popular-job-categories
const popularJobCategories = async (req, res) => {
    try {
        const allJobs = await ActiveJobs.aggregate([
            {
                $group: {
                    _id: "$jobCategory",   // group by jobCategory
                    count: { $sum: 1 }     // count how many jobs per category
                }
            },
            {
                $sort: { count: -1 }      // sort by most jobs
            }
        ]);

        if (!allJobs || allJobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No job categories found"
            });
        }

        // format clean response
        const jobs = allJobs.map(item => ({
            category: item._id || "Unknown",  // handle null/empty
            count: item.count
        }));

        res.status(200).json({
            success: true,
            message: "Job categories fetched successfully",
            totalCategories: jobs.length,
            data: jobs
        });

    } catch (err) {
        console.error("Error fetching job categories:", err);
        res.status(500).json({
            success: false,
            message: "Server error while fetching job categories"
        });
    }
};



//creating a function that returns active profiles info that can be reused for multiple apis
const getActiveProfileData = async () => {
    const profiles = await UserModel.find(
        { lastSignInTime: { $ne: null } },
        "name email experienceLevel location lastSignInTime"
    ).lean();


    if (!profiles || profiles.length === 0) return [];


    return profiles.map((profile) => {
        const lastSignIn = new Date(profile.lastSignInTime);

        const time = lastSignIn.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
        const date = lastSignIn.toLocaleDateString([], {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
        const daysAgo = Math.floor(
            (new Date() - lastSignIn) / (1000 * 60 * 60 * 24)
        );

        return {
            _id: profile._id,
            name: profile.name || "N/A",
            email: profile.email || "N/A",
            experienceLevel: profile.experienceLevel || "Not specified",
            location: profile.location || "Unknown",
            lastActive: `${time}\n${date}\n${daysAgo} days ago`,
        };
    });
}



//active profiles
const activeProfiles = async (req, res) => {
    // try {
    //     // Fetch profiles with non-null lastSignInTime
    //     const profiles = await UserModel.find(
    //         { lastSignInTime: { $ne: null } },
    //         "name email experienceLevel location lastSignInTime"
    //     ).lean();

    //     if (!profiles || profiles.length === 0) {
    //         return res.status(404).json({
    //             success: false,
    //             message: "No active profiles found",
    //             data: [],
    //         });
    //     }

    //     const formattedProfiles = profiles.map((profile) => {
    //         const lastSignIn = new Date(profile.lastSignInTime);

    //         // Format pieces
    //         const time = lastSignIn.toLocaleTimeString([], {
    //             hour: "2-digit",
    //             minute: "2-digit",
    //         });
    //         const date = lastSignIn.toLocaleDateString([], {
    //             weekday: "short",
    //             month: "short",
    //             day: "numeric",
    //         });
    //         const daysAgo = Math.floor(
    //             (new Date() - lastSignIn) / (1000 * 60 * 60 * 24)
    //         );

    //         return {
    //             _id: profile._id,
    //             name: profile.name || "N/A",
    //             email: profile.email || "N/A",
    //             experienceLevel: profile.experienceLevel || "Not specified",
    //             location: profile.location || "Unknown",
    //             lastActive: `${time}\n${date}\n${daysAgo} days ago`,
    //         };
    //     });

    //     return res.status(200).json({
    //         success: true,
    //         count: formattedProfiles.length,
    //         data: formattedProfiles,
    //     });
    // } catch (error) {
    //     console.error("Error fetching active profiles:", error);
    //     return res.status(500).json({
    //         success: false,
    //         message: "Server error while fetching active profiles",
    //     });
    // }
    try {
        //calling the getActiveProfileData function to render active profiles
        const formattedProfiles = await getActiveProfileData();

        if (formattedProfiles.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No active profiles found",
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            count: formattedProfiles.length,
            data: formattedProfiles,
        });
    } catch (error) {
        console.error("Error fetching active profiles:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching active profiles",
        });
    }
};


//csv export api
//get - jobseeker/exports/csv
const exportCsv = async (req, res) => {
    try {
        const formattedProfiles = await getActiveProfileData();
        if (formattedProfiles.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No active profiles found to export",
            });
        }
        //parser
        const json2vsvParser = new Parser();
        const csv = json2vsvParser.parse(formattedProfiles);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=active_profiles.csv");
        res.setHeader("X-Success", "true");
        res.setHeader("X-Message", "CSV exported successfully");

        return res.send(csv);

    } catch (error) {
        console.error("Error exporting active profiles CSV:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while exporting CSV",
        });
    }
}

//export pdf
//get - jobseeker/exports/pdf
const exportPdf = async (req, res) => {
    try {
        const profiles = await getActiveProfileData();

        if (!profiles || profiles.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No active profiles found to export",
            });
        }

        // Setup PDF
        const doc = new PDFDocument({ margin: 30, size: "A4" });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=active_profiles.pdf");
        res.setHeader("X-Success", "true");
        res.setHeader("X-Message", "PDF exported successfully");

        doc.pipe(res);

        doc.fontSize(20).text("Active Profiles Report", { align: "center" });
        doc.moveDown(2);

        // Table config
        const startX = doc.x;
        let y = doc.y;
        const rowPadding = 5;
        const pageHeight = doc.page.height - doc.page.margins.bottom;
        const colWidths = [100, 150, 120, 100, 120]; // Adjust widths

        const headers = ["Name", "Email", "Experience Level", "Location", "Last Active"];

        // Draw table header
        let x = startX;
        headers.forEach((header, i) => {
            doc.rect(x, y, colWidths[i], 20).fillAndStroke("#f0f0f0", "#000");
            doc.fillColor("#000").fontSize(12).text(header, x + rowPadding, y + rowPadding, {
                width: colWidths[i] - rowPadding * 2,
                align: "left",
            });
            x += colWidths[i];
        });

        y += 20;

        // Draw table rows
        profiles.forEach((p) => {
            const rowData = [
                p.name,
                p.email,
                p.experienceLevel,
                p.location,
                p.lastActive,
            ];

            // Calculate dynamic row height
            const cellHeights = rowData.map((text, i) =>
                doc.heightOfString(text, { width: colWidths[i] - rowPadding * 2 })
            );
            const maxHeight = Math.max(...cellHeights) + rowPadding * 2;

            // Page break check
            if (y + maxHeight > pageHeight) {
                doc.addPage();
                y = doc.y;

                // redraw headers on new page
                let xHeader = startX;
                headers.forEach((header, i) => {
                    doc.rect(xHeader, y, colWidths[i], 20).fillAndStroke("#f0f0f0", "#000");
                    doc.fillColor("#000").fontSize(12).text(header, xHeader + rowPadding, y + rowPadding, {
                        width: colWidths[i] - rowPadding * 2,
                        align: "left",
                    });
                    xHeader += colWidths[i];
                });
                y += 20;
            }

            // Draw row
            let x = startX;
            rowData.forEach((text, i) => {
                doc.rect(x, y, colWidths[i], maxHeight).stroke();
                doc.fillColor("#000").fontSize(10).text(text, x + rowPadding, y + rowPadding, {
                    width: colWidths[i] - rowPadding * 2,
                    align: "left",
                });
                x += colWidths[i];
            });

            y += maxHeight;
        });

        doc.end();
    } catch (error) {
        console.error("Error exporting PDF:", error);
        res.status(500).json({
            success: false,
            message: "Server error while exporting PDF",
        });
    }
};


//exported csv

const exportApplicationsCsv = async (req, res) => {
    try {
        const applications = await JobApplicationModel.find()
            .populate("user", "fullName email")
            .populate("job", "jobTitle companyName");

        if (!applications.length) {
            return res.status(404).json({
                success: false,
                message: "No applications found",
            });
        }

        // 🔹 Group applications by user ID
        const grouped = {};
        applications.forEach((app) => {
            const userId = app.user?._id?.toString() || "N/A";

            if (!grouped[userId]) {
                grouped[userId] = {
                    id: userId,
                    jobSeeker: app.user?.fullName || "N/A",
                    email: app.user?.email || "N/A",
                    applied: [], // will hold { job, time }
                };
            }

            grouped[userId].applied.push({
                job: app.job
                    ? `${app.job.jobTitle} (${app.job.companyName})`
                    : "N/A",
                time: app.appliedAt
                    ? new Date(app.appliedAt).toLocaleString()
                    : "N/A",
            });
        });

        // 🔹 Flatten into exportable rows
        const data = Object.values(grouped).map((u) => ({
            id: u.id,
            jobSeeker: u.jobSeeker,
            email: u.email,
            appliedJobs: u.applied.map((a) => a.job).join(" | "),
            appliedTimes: u.applied.map((a) => a.time).join(" | "),
        }));

        // 🔹 Convert JSON to CSV
        const json2csvParser = new Parser({
            fields: ["id", "jobSeeker", "email", "appliedJobs", "appliedTimes"],
        });
        const csv = json2csvParser.parse(data);

        // 🔹 Send CSV file
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=job_applications.csv"
        );
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("X-Message", "Applications exported successfully!");

        res.status(200).end(csv);
    } catch (err) {
        console.error("CSV export error:", err);
        res
            .status(500)
            .json({ success: false, message: "Failed to export applications" });
    }
};


//get all the location only
//get - allLoc
const allLoc = async (req, res) => {
    try {
        const locations = await UserModel.distinct("location").lean();

        if (!locations || locations.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No locations found",
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            count: locations.length,
            data: locations,
        });
    } catch (error) {
        console.error("Error fetching locations:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching locations",
        });
    }
};

// Export multiple functions in ESM
export {
    jobSeekerActivity,
    getInactiveSeekers,
    getDailyActiveSeekers,
    topSkills,
    getExperienceLevel,
    getLocations,
    popularJobCategories,
    activeProfiles,
    allLoc,
    exportCsv,
    exportPdf,
    exportApplicationsCsv
};

