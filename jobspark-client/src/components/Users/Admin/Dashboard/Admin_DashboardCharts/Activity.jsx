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
    const [startDate, setStartDate] = useState(new Date("2025-07-21"));
    const [endDate, setEndDate] = useState(new Date("2025-07-30"));
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const url = `http://localhost:5000/api/v1/admin/dashboard/job-seekers/activity-trends?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
            const response = await getMethod(url);
            const activityData = response.data;

            const firstData = activityData.map(item => item.registered);
            const secondData = activityData.map(item => item.applied);

            setFirstData(firstData);
            setSecondData(secondData);
        } catch (error) {
            console.error("Error fetching activity data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    React.useEffect(() => {
        if (!running) {
            return undefined;
        }
        const intervalId = setInterval(() => {
            // Generate more realistic fluctuations around the current values
            setFirstData(prev => {
                if (prev.length === 0) return prev;
                return prev.map(value => {
                    const fluctuation = Math.floor(Math.random() * 100) - 50; // -50 to +50
                    return Math.max(0, value + fluctuation); // Ensure we don't go below 0
                });
            });
            setSecondData(prev => {
                if (prev.length === 0) return prev;
                return prev.map(value => {
                    const fluctuation = Math.floor(Math.random() * 100) - 50; // -50 to +50
                    return Math.max(0, value + fluctuation); // Ensure we don't go below 0
                });
            });
        }, 1000); // Changed to update every second instead of every 100ms

        return () => {
            clearInterval(intervalId);
        };
    }, [running]);

    const handleDateChange = (dateRange) => {
        const [newStartDate, newEndDate] = dateRange;
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    // Generate x-axis labels based on the selected date range
    const generateXAxisData = () => {
        const daysDiff = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
        return Array.from({ length: daysDiff + 1 }, (_, i) => addDays(startDate, i));
    };

    return (
        <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
            <Stack spacing={3}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    Job Seeker Activity Trends
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
                                    fetchData(); // Simply refetch the original data
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
                                    label: 'New Registrations',
                                    color: '#f28e2b',
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
                            yAxis={[
                                {
                                    label: 'Count',
                                }
                            ]}
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