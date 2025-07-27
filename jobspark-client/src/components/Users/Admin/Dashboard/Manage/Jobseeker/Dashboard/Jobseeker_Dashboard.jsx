import React, { useContext } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import {
    People as PeopleIcon,
    Person as PersonIcon,
    PersonAdd as PersonAddIcon,
    Code as CodeIcon,
    LocationOn as LocationIcon,
    Category as CategoryIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { JobSeekerDashboardContext } from '../../../../../../Context/AdminContext/JobSeekerDashboardContextProvider';
import StatsCard from './StatsCard';
import SkillsRadarChart from './SkillsRadarChart';
import TopLocationsMap from './TopLocationsMap';
import JobCategoriesChart from './JobCategoriesChart';
import MiniBarChart from './MiniBarChart';
// import { StarIcon } from 'flowbite-react';
import TopSkillsChart from './TopSkillsChart'; // No curly braces for default import
import { Star as StarIcon } from '@mui/icons-material';

// import StatsCard from './components/StatsCard';
// import MiniBarChart from './components/MiniBarChart';
// import MiniPieChart from './components/MiniPieChart';
// import TopLocationsMap from './components/TopLocationsMap';
// import SkillsRadarChart from './components/SkillsRadarChart';
// import JobCategoriesChart from './components/JobCategoriesChart';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10
        }
    }
};

const JobSeeker_Dashboard = () => {
    const {
        total_JobSeeker,
        active_profile,
        new_Registration,
        skills_distribution,
        top_skills,
        top_loc,
        top_job_categories
    } = useContext(JobSeekerDashboardContext);

    // Process data
    const totalJobSeeker = total_JobSeeker?.total || 0;
    const activeProfile = active_profile?.count || 0;
    const newRegistration = new_Registration?.count || 0;

    const topSkills = top_skills?.topSkills?.slice(0, 5) || [];
    const topLocations = top_loc?.topLocations?.slice(0, 5) || [];
    const topJobCategories = top_job_categories?.topJobCategories?.slice(0, 5) || [];

    // Format data for charts
    const skillsData = topSkills.map(skill => ({
        name: skill.skill,
        value: skill.count
    }));

    const locationsData = topLocations.map(loc => ({
        name: loc.location,
        value: loc.count
    }));

    const categoriesData = topJobCategories.map(cat => ({
        name: cat.name,
        value: cat.count
    }));

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            style={{ padding: '24px' }}
        >
            <motion.div variants={itemVariants}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
                    Job Seeker Dashboard
                </Typography>
            </motion.div>

            {/* Key Metrics Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <StatsCard
                        title="Total Job Seekers"
                        value={totalJobSeeker}
                        icon={<PeopleIcon fontSize="large" />}
                        color="#4e79a7"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatsCard
                        title="Active Profiles"
                        value={activeProfile}
                        icon={<PersonIcon fontSize="large" />}
                        color="#f28e2b"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatsCard
                        title="New Registrations"
                        value={newRegistration}
                        icon={<PersonAddIcon fontSize="large" />}
                        color="#e15759"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <motion.div variants={itemVariants}>
                        <Box sx={{
                            bgcolor: 'background.paper',
                            p: 3,
                            borderRadius: 2,
                            boxShadow: 1,
                            height: '100%'
                        }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <StarIcon color="primary" sx={{ mr: 1 }} /> Top Skills
                            </Typography>
                            <TopSkillsChart data={topSkills} />
                        </Box>
                    </motion.div>
                </Grid>
            </Grid>

            {/* Visualizations Row 1 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Flex Row Wrapper */}
                <Grid item xs={12} sx={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>

                    {/* Top Skills Distribution */}
                    <Box sx={{ flex: 1, minWidth: 300, display: 'flex' }}>
                        <motion.div variants={itemVariants} style={{ flex: 1 }}>
                            <Box
                                sx={{
                                    bgcolor: 'background.paper',
                                    p: 3,
                                    borderRadius: 2,
                                    boxShadow: 1,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flex: 1,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                                >
                                    <CodeIcon color="primary" sx={{ mr: 1 }} />
                                    Top Skills Distribution
                                </Typography>
                                <Box sx={{ flex: 1, minHeight: 300 }}>
                                    <SkillsRadarChart data={skillsData} />
                                </Box>
                            </Box>
                        </motion.div>
                    </Box>

                    {/* Top Locations */}
                    <Box sx={{ flex: 1, minWidth: 300, display: 'flex' }}>
                        <motion.div variants={itemVariants} style={{ flex: 1 }}>
                            <Box
                                sx={{
                                    bgcolor: 'background.paper',
                                    p: 3,
                                    borderRadius: 2,
                                    boxShadow: 1,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flex: 1,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                                >
                                    <LocationIcon color="primary" sx={{ mr: 1 }} />
                                    Top Locations
                                </Typography>
                                <Box sx={{ flex: 1, minHeight: 300 }}>
                                    <TopLocationsMap data={locationsData} />
                                </Box>
                            </Box>
                        </motion.div>
                    </Box>

                </Grid>
            </Grid>

            {/* Visualizations Row 2 */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <motion.div variants={itemVariants}>
                        <Box sx={{
                            bgcolor: 'background.paper',
                            p: 3,
                            borderRadius: 2,
                            boxShadow: 1,
                            height: '100%'
                        }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <CategoryIcon color="primary" sx={{ mr: 1 }} /> Job Categories Popularity
                            </Typography>
                            <JobCategoriesChart data={categoriesData} />
                        </Box>
                    </motion.div>
                </Grid>
                <Grid item xs={12} md={6}>
                    <motion.div variants={itemVariants}>
                        <Box sx={{
                            bgcolor: 'background.paper',
                            p: 3,
                            borderRadius: 2,
                            boxShadow: 1,
                            height: '100%'
                        }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <TrendingUpIcon color="primary" sx={{ mr: 1 }} /> Activity Trends
                            </Typography>
                            <MiniBarChart />
                        </Box>
                    </motion.div>
                </Grid>
            </Grid>
        </motion.div>
    );
};

export default JobSeeker_Dashboard;