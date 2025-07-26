import React, { useState, useEffect, useContext } from 'react';
import {
    Typography,
    Grid,
    Paper,
    Box,
    Stack,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip,
    useTheme,
    Skeleton
} from '@mui/material';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    AreaChart,
    Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
    People as PeopleIcon,
    CheckCircle as CheckCircleIcon,
    PersonAdd as PersonAddIcon,
    Description as DescriptionIcon,
    VerifiedUser as VerifiedUserIcon,
    LocationOn as LocationIcon
} from '@mui/icons-material';
import { JobSeekerDashboardContext } from '../../../../../Context/AdminContext/JobSeekerDashboardContextProvider';

// Sample data
const metrics = {
    totalJobSeekers: 1250,
    activeProfiles: 980,
    newRegistrations: 145,
    applicationsSubmitted: 1120,
    profileCompletion: 82,
    applicationsPerSeeker: 4.2,
    verifiedProfiles: 850
};

const pieData = [
    { name: 'JavaScript', value: 35 },
    { name: 'Python', value: 25 },
    { name: 'React', value: 20 },
    { name: 'Node.js', value: 15 },
    { name: 'SEO', value: 5 },
];

const barData = [
    { name: 'Jan', applications: 120, profiles: 80 },
    { name: 'Feb', applications: 210, profiles: 120 },
    { name: 'Mar', applications: 180, profiles: 95 },
    { name: 'Apr', applications: 280, profiles: 150 },
    { name: 'May', applications: 320, profiles: 180 },
];

const activityData = [
    { day: 'Mon', active: 4000, applications: 2400 },
    { day: 'Tue', active: 3000, applications: 1398 },
    { day: 'Wed', active: 2000, applications: 9800 },
    { day: 'Thu', active: 2780, applications: 3908 },
    { day: 'Fri', active: 1890, applications: 4800 },
    { day: 'Sat', active: 2390, applications: 3800 },
    { day: 'Sun', active: 3490, applications: 4300 },
];

const topSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript'];
const topLocations = ['Dhaka', 'Chattogram', 'Sylhet', 'Khulna', 'Rajshahi'];
const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F97316', '#10B981'];

// Animation variants
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const StatCard = ({ title, value, trend, icon, loading }) => (
    <Paper
        component={motion.div}
        variants={item}
        elevation={0}
        sx={{
            p: 3,
            borderRadius: 4,
            bgcolor: 'background.paper',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            height: '100%',
            border: '1px solid rgba(0,0,0,0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'
            }
        }}
    >
        <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" color="text.secondary">
                    {title}
                </Typography>
                <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main'
                }}>
                    {icon}
                </Box>
            </Stack>

            {loading ? (
                <Skeleton variant="text" width="60%" height={40} />
            ) : (
                <Stack direction="row" alignItems="flex-end" spacing={1}>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        {value}
                    </Typography>
                    {trend && (
                        <Chip
                            label={trend.value}
                            size="small"
                            color={trend.positive ? 'success' : 'error'}
                            sx={{
                                height: 20,
                                fontSize: '0.75rem',
                                fontWeight: 600
                            }}
                        />
                    )}
                </Stack>
            )}
        </Stack>
    </Paper>
);





const JobSeeker_Dashboard = () => {
    const { total_JobSeeker, active_profile, new_Registration, profile_completion, skills_distribution, top_skills, top_loc, top_job_categories } = useContext(JobSeekerDashboardContext);
    console.log("total ", total_JobSeeker);
    console.log("active_profile", active_profile);
    console.log("new_Registration", new_Registration);
    console.log("profile_completion", profile_completion);
    console.log("skills_distribution", skills_distribution);
    console.log("Top Skills", top_skills);
    console.log("Top Loc", top_loc);
    console.log("top_job_categories", top_job_categories);

    const theme = useTheme();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, margin: 0 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{
                    fontWeight: 800,
                    mb: 1,
                    background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block'
                }}>
                    Job Seeker Analytics
                </Typography>
                <Typography color="text.secondary" variant="subtitle1">
                    Comprehensive overview of job seeker activities and platform trends
                </Typography>
            </Box>

            {/* Key Metrics */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
            >
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} lg={3}>
                        <StatCard
                            title="Total Job Seekers"
                            value={total_JobSeeker?.total || 0}
                            trend={{ value: '+12%', positive: true }}
                            icon={<PeopleIcon />}
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <StatCard
                            title="Active Profiles"
                            value={active_profile?.count || 0}
                            trend={{ value: '+8%', positive: true }}
                            icon={<CheckCircleIcon />}
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <StatCard
                            title="New Registrations"
                            value={new_Registration?.count || 0}
                            trend={{ value: '+24%', positive: true }}
                            icon={<PersonAddIcon />}
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <StatCard
                            title="Applications"
                            value={profile_completion?.length || 0}
                            trend={{ value: '+18%', positive: true }}
                            icon={<DescriptionIcon />}
                            loading={loading}
                        />
                    </Grid>
                </Grid>
            </motion.div>

            {/* Main Content */}
            {/* Main Content */}
            <Grid container spacing={4} sx={{ width: '100%', margin: 0 }}>
                {/* Left Column - Charts */}
                <Grid item xs={12} xl={9}>
                    <motion.div variants={container} style={{ width: '100%' }}>
                        {/* Profile Completion */}
                        <Paper
                            component={motion.div}
                            variants={item}
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 4,
                                borderRadius: 4,
                                width: '100%',
                                bgcolor: 'background.paper',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                                Profile Completion Rate
                            </Typography>
                            {loading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', height: 200 }}>
                                    <Skeleton variant="circular" width={200} height={200} />
                                    <Box sx={{ ml: 4, width: '100%' }}>
                                        <Skeleton variant="text" width="60%" height={30} />
                                        <Skeleton variant="rectangular" width="100%" height={10} sx={{ mt: 2, borderRadius: 2 }} />
                                        <Skeleton variant="text" width="80%" height={20} sx={{ mt: 2 }} />
                                    </Box>
                                </Box>
                            ) : (
                                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={4}>
                                    <Box sx={{ width: 200, height: 200 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={[{ value: metrics.profileCompletion }, { value: 100 - metrics.profileCompletion }]}
                                                    dataKey="value"
                                                    innerRadius={60}
                                                    outerRadius={90}
                                                    startAngle={90}
                                                    endAngle={-270}
                                                >
                                                    <Cell fill={theme.palette.primary.main} />
                                                    <Cell fill="#F3F4F6" />
                                                </Pie>
                                                <text
                                                    x="50%"
                                                    y="50%"
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    style={{ fontSize: '2rem', fontWeight: 700 }}
                                                >
                                                    {metrics.profileCompletion}%
                                                </text>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                Verified Profiles
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                {metrics.verifiedProfiles} / {metrics.totalJobSeekers}
                                            </Typography>
                                        </Stack>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(metrics.verifiedProfiles / metrics.totalJobSeekers) * 100}
                                            sx={{ height: 8, borderRadius: 4, mb: 2 }}
                                            color="primary"
                                        />
                                        <Typography color="text.secondary" variant="body2">
                                            {metrics.totalJobSeekers - metrics.verifiedProfiles} profiles pending verification
                                        </Typography>
                                    </Box>
                                </Stack>
                            )}
                        </Paper>

                        {/* Activity Charts */}
                        <Grid container spacing={4} sx={{ width: '100%' }}>
                            <Grid item xs={12} md={6}>
                                <Paper
                                    component={motion.div}
                                    variants={item}
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 4,
                                        width: '100%',
                                        height: '100%',
                                        bgcolor: 'background.paper',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                                        border: '1px solid rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                                        Monthly Activity
                                    </Typography>
                                    {loading ? (
                                        <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
                                    ) : (
                                        <Box sx={{ height: 400 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={barData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                                    <XAxis
                                                        dataKey="name"
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />
                                                    <YAxis
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            borderRadius: '8px',
                                                            boxShadow: theme.shadows[3],
                                                            border: 'none'
                                                        }}
                                                    />
                                                    <Legend />
                                                    <Bar
                                                        dataKey="applications"
                                                        name="Applications"
                                                        fill={theme.palette.primary.main}
                                                        radius={[4, 4, 0, 0]}
                                                    />
                                                    <Bar
                                                        dataKey="profiles"
                                                        name="New Profiles"
                                                        fill={theme.palette.secondary.main}
                                                        radius={[4, 4, 0, 0]}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    )}
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper
                                    component={motion.div}
                                    variants={item}
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 4,
                                        width: '100%',
                                        height: '100%',
                                        bgcolor: 'background.paper',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                                        border: '1px solid rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                                        Weekly Activity
                                    </Typography>
                                    {loading ? (
                                        <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
                                    ) : (
                                        <Box sx={{ height: 300 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={activityData}>
                                                    <defs>
                                                        <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                                        </linearGradient>
                                                        <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                                    <XAxis
                                                        dataKey="day"
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />
                                                    <YAxis
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            borderRadius: '8px',
                                                            boxShadow: theme.shadows[3],
                                                            border: 'none'
                                                        }}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="active"
                                                        name="Active Users"
                                                        stroke={theme.palette.primary.main}
                                                        fillOpacity={1}
                                                        fill="url(#colorActive)"
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="applications"
                                                        name="Applications"
                                                        stroke={theme.palette.secondary.main}
                                                        fillOpacity={1}
                                                        fill="url(#colorApplications)"
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>
                    </motion.div>
                </Grid>

                {/* Right Column - Lists */}
                <Grid item xs={12} xl={3}>
                    <motion.div variants={container} style={{ width: '100%' }}>
                        {/* Skills Distribution */}
                        <Paper
                            component={motion.div}
                            variants={item}
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 4,
                                borderRadius: 4,
                                width: '100%',
                                bgcolor: 'background.paper',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                                Top Skills Distribution
                            </Typography>
                            {loading ? (
                                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Skeleton variant="circular" width={240} height={240} />
                                </Box>
                            ) : (
                                <Box sx={{ height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={120}
                                                innerRadius={60}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                labelLine={false}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '8px',
                                                    boxShadow: theme.shadows[3],
                                                    border: 'none'
                                                }}
                                            />
                                            <Legend
                                                layout="vertical"
                                                verticalAlign="middle"
                                                align="right"
                                                wrapperStyle={{
                                                    paddingLeft: '20px'
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            )}
                        </Paper>

                        {/* Top Locations */}
                        <Paper
                            component={motion.div}
                            variants={item}
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                width: '100%',
                                bgcolor: 'background.paper',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}
                        >
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                                <LocationIcon color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Top Locations
                                </Typography>
                            </Stack>
                            {loading ? (
                                <Box>
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <Box key={item} sx={{ mb: 2 }}>
                                            <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <List dense>
                                    {topLocations.map((location, index) => (
                                        <motion.div
                                            key={location}
                                            variants={item}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <ListItem
                                                sx={{
                                                    px: 0,
                                                    py: 1.5,
                                                    borderRadius: 2,
                                                    '&:hover': {
                                                        bgcolor: 'action.hover'
                                                    }
                                                }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Box sx={{
                                                                width: 24,
                                                                height: 24,
                                                                bgcolor: COLORS[index % COLORS.length],
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: 'white',
                                                                fontSize: 12,
                                                                fontWeight: 700
                                                            }}>
                                                                {index + 1}
                                                            </Box>
                                                            <Typography sx={{ fontWeight: 600 }}>{location}</Typography>
                                                            <Box sx={{ flexGrow: 1 }} />
                                                            <Chip
                                                                label={`${(100 - index * 15)}%`}
                                                                size="small"
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    bgcolor: 'action.selected'
                                                                }}
                                                            />
                                                        </Stack>
                                                    }
                                                />
                                            </ListItem>
                                            {index < topLocations.length - 1 && (
                                                <Divider sx={{ my: 0.5, opacity: 0.5 }} />
                                            )}
                                        </motion.div>
                                    ))}
                                </List>
                            )}
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default JobSeeker_Dashboard;