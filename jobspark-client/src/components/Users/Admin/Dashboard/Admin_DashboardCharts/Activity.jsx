import React, { useState, useEffect } from 'react';
import {
    Button,
    Box,
    Typography,
    Paper,
    Grid,
    Stack,
    TextField
} from "@mui/material";
import { LineChart } from '@mui/x-charts/LineChart';
import { getMethod } from '../../../../Utils/Api';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays } from 'date-fns';

const dateFormatter = Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
});

function Activity() {
    const [running, setRunning] = useState(false);
    const [firstData, setFirstData] = useState([]);
    const [secondData, setSecondData] = useState([]);
    const [recruiterRegistered, setRecruiterRegistered] = useState([]);
    const [recruiterPostings, setRecruiterPostings] = useState([]);
    const [startDate, setStartDate] = useState(new Date("2025-07-21"));
    const [endDate, setEndDate] = useState(new Date("2025-07-30"));
    const [loading, setLoading] = useState(false);

    // ✅ Separated: Fetch Job Seeker Data
    const fetchJobSeekerData = async () => {
        setLoading(true);
        try {
            const seekerUrl = `http://localhost:5000/api/v1/admin/dashboard/job-seekers/activity-trends?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
            const res = await getMethod(seekerUrl);
            const data = res.data;

            setFirstData(data.map(item => item.registered));
            setSecondData(data.map(item => item.applied));

            console.log("✅ Job Seeker Data", data);
        } catch (error) {
            console.error("❌ Error fetching Job Seeker data:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Separated: Fetch Recruiter Data
    const fetchRecruiterData = async () => {
        try {
            const recruiterUrl = `http://localhost:5000/api/v1/admin/dashboard/recruiter-activity-trends?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
            const res = await getMethod(recruiterUrl);

            const activityArray = res.data; // ✅ Directly the array of recruiter objects

            console.log("✅ Final Recruiter Data:", activityArray);

            setRecruiterRegistered(activityArray.map(item => item.registered));
            setRecruiterPostings(activityArray.map(item => item.jobPostings));
        } catch (error) {
            console.error("❌ Error fetching Recruiter data:", error);
        }
    };

    useEffect(() => {
        fetchJobSeekerData();
        fetchRecruiterData();
    }, [startDate, endDate]);
  
    useEffect(() => {
        if (!running) return;
        const intervalId = setInterval(() => {
            setFirstData(prev => prev.map(v => Math.max(0, v + Math.floor(Math.random() * 100) - 50)));
            setSecondData(prev => prev.map(v => Math.max(0, v + Math.floor(Math.random() * 100) - 50)));
            setRecruiterRegistered(prev => prev.map(v => Math.max(0, v + Math.floor(Math.random() * 100) - 50)));
            setRecruiterPostings(prev => prev.map(v => Math.max(0, v + Math.floor(Math.random() * 100) - 50)));
        }, 1000);
        return () => clearInterval(intervalId);
    }, [running]);

    const handleDateChange = ([newStartDate, newEndDate]) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    const generateXAxisData = () => {
        const daysDiff = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
        return Array.from({ length: daysDiff + 1 }, (_, i) => addDays(startDate, i));
    };

    return (
        <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
            <Stack spacing={3}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    Job Seeker & Recruiter Activity Trends
                </Typography>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateRangePicker
                                startText="Start Date"
                                endText="End Date"
                                value={[startDate, endDate]}
                                onChange={handleDateChange}
                                renderInput={(startProps, endProps) => (
                                    <Stack direction="row" spacing={2}>
                                        <TextField {...startProps} size="small" />
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="body2">to</Typography>
                                        </Box>
                                        <TextField {...endProps} size="small" />
                                    </Stack>
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                color={running ? 'error' : 'primary'}
                                onClick={() => setRunning((p) => !p)}
                                disabled={loading}
                            >
                                {running ? 'Stop Live Update' : 'Start Live Update'}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    fetchJobSeekerData();
                                    fetchRecruiterData();
                                }}
                                disabled={loading || running}
                            >
                                Reset
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                        <Typography>Loading data...</Typography>
                    </Box>
                ) : (
                    <Box sx={{ height: 400 }}>
                        <LineChart
                            height={350}
                            series={[
                                {
                                    data: secondData,
                                    label: 'Job Applications',
                                    color: '#4e79a7',
                                    showMark: false,
                                    area: true,
                                },
                                {
                                    data: firstData,
                                    label: 'Job Seeker Registrations',
                                    color: '#f28e2b',
                                    showMark: false,
                                    area: true,
                                },
                                {
                                    data: recruiterRegistered,
                                    label: 'Recruiter Signups',
                                    color: '#59a14f',
                                    showMark: false,
                                    area: true,
                                },
                                {
                                    data: recruiterPostings,
                                    label: 'Job Postings',
                                    color: '#e15759',
                                    showMark: false,
                                    area: true,
                                },
                            ]}
                            xAxis={[
                                {
                                    scaleType: 'point',
                                    data: generateXAxisData(),
                                    valueFormatter: (value) => dateFormatter.format(value),
                                    label: 'Date',
                                },
                            ]}
                            yAxis={[{ label: 'Count' }]}
                            margin={{ left: 70, right: 30, top: 30, bottom: 50 }}
                            slotProps={{
                                legend: {
                                    direction: 'row',
                                    position: { vertical: 'top', horizontal: 'right' },
                                    padding: 0,
                                },
                            }}
                        />
                    </Box>
                )}

                <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        Data range: {format(startDate, 'MMM d, yyyy')} to {format(endDate, 'MMM d, yyyy')}
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );
}

export default Activity;
