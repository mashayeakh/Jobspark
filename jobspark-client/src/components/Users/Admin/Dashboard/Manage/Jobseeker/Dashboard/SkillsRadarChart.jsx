import React from 'react';
import {
    Box,
    Stack,
    FormControlLabel,
    Checkbox,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Radar,
} from 'recharts';

const SkillsRadarChart = ({ data }) => {
    const [hideMark, setHideMark] = React.useState(false);
    const [fillArea, setFillArea] = React.useState(true);

    // Theme-aware responsiveness
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const radarData = data.map((item) => ({
        subject: item.name,
        value: item.value,
    }));

    return (
        <Box sx={{ width: '100%', px: 2 }}>
            <Stack
                direction="row"
                flexWrap="wrap"
                gap={2}
                sx={{ mb: 2, justifyContent: 'center' }}
            >
                <FormControlLabel
                    checked={!hideMark}
                    control={
                        <Checkbox onChange={(event) => setHideMark(!event.target.checked)} />
                    }
                    label="Show marks"
                />
                <FormControlLabel
                    checked={fillArea}
                    control={
                        <Checkbox onChange={(event) => setFillArea(event.target.checked)} />
                    }
                    label="Fill area"
                />
            </Stack>

            {/* Full width, centered chart with max width cap */}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ width: isSmallScreen ? '100%' : 600, height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart
                            cx="50%"
                            cy="50%"
                            outerRadius="80%"
                            data={radarData}
                        >
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis />
                            <Radar
                                name="Skills"
                                dataKey="value"
                                stroke="#4e79a7"
                                fill="#4e79a7"
                                fillOpacity={fillArea ? 0.6 : 0}
                                dot={!hideMark}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </Box>
    );
};

export default SkillsRadarChart;
