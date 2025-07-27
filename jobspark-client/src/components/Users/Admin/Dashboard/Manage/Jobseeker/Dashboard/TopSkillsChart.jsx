import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';

const TopSkillsChart = ({ data }) => {
    const theme = useTheme();
    const chartData = data.map(skill => ({
        skill: skill.skill,
        x: Math.random() * 100, // Random position for bubble spread
        y: Math.random() * 100,
        z: skill.count * 2, // Bubble size based on count
        count: skill.count
    }));

    return (
        <Box sx={{ height: 400 }}>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                        <XAxis type="number" dataKey="x" name=" " hide />
                        <YAxis type="number" dataKey="y" name=" " hide />
                        <ZAxis type="number" dataKey="z" range={[60, 400]} />
                        <Tooltip
                            contentStyle={{
                                background: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 4
                            }}
                            formatter={(value, name, props) => [
                                props.payload.skill,
                                `Job Seekers: ${props.payload.count}`
                            ]}
                        />
                        <Scatter
                            data={chartData}
                            fill={theme.palette.primary.main}
                            fillOpacity={0.6}
                        >
                            {chartData.map((entry, index) => (
                                <text
                                    key={`label-${index}`}
                                    x={entry.x}
                                    y={entry.y}
                                    textAnchor="middle"
                                    fill={theme.palette.getContrastText(theme.palette.primary.main)}
                                    fontSize={10 + (entry.z / 50)}
                                    fontWeight="bold"
                                >
                                    {entry.skill}
                                </text>
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body1" color="text.secondary">
                        No skills data available
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default TopSkillsChart;