import { useContext, useEffect, useState } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import {
    Typography,
    Paper,
    Box,
    useTheme,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { AdminDashboardContext } from '../../../Context/AdminContext/AdminDashboardContextProvider';

// Custom color palette with better contrast and accessibility
const COLORS = [
    '#4e79a7', '#f28e2b', '#e15759', '#76b7b2',
    '#59a14f', '#edc948', '#b07aa1', '#ff9da7',
    '#9c755f', '#bab0ac'
];

const RADIAN = Math.PI / 180;

// Custom label renderer
const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            style={{
                fontSize: 12,
                fontWeight: 'bold',
                filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))'
            }}
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const SkillsPieChart = () => {
    const theme = useTheme();
    const [chartData, setChartData] = useState([]);
    const [maxItems, setMaxItems] = useState(8);
    const [loading, setLoading] = useState(true);
    const { pie } = useContext(AdminDashboardContext);

    useEffect(() => {
        if (pie && pie.data) {
            setLoading(true);
            // Sort by value descending and limit to maxItems
            const sortedData = [...pie.data]
                .sort((a, b) => b.jobPostingsCount - a.jobPostingsCount)
                .slice(0, maxItems);

            const formattedData = sortedData.map(item => ({
                name: item.skill,
                value: item.jobPostingsCount,
            }));

            setChartData(formattedData);
            setLoading(false);
        }
    }, [pie, maxItems]);

    const handleMaxItemsChange = (event) => {
        setMaxItems(event.target.value);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
            }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    Skills Breakdown of Active Jobs
                </Typography>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Max Skills</InputLabel>
                    <Select
                        value={maxItems}
                        label="Max Skills"
                        onChange={handleMaxItemsChange}
                    >
                        <MenuItem value={5}>Top 5</MenuItem>
                        <MenuItem value={8}>Top 8</MenuItem>
                        <MenuItem value={10}>Top 10</MenuItem>
                        <MenuItem value={15}>Top 15</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {loading ? (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 350
                }}>
                    <CircularProgress />
                </Box>
            ) : chartData.length === 0 ? (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 350
                }}>
                    <Typography>No data available</Typography>
                </Box>
            ) : (
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            innerRadius={70}
                            paddingAngle={2}
                            label={renderCustomizedLabel}
                            labelLine={false}
                            animationDuration={1000}
                            animationEasing="ease-out"
                        >
                            {chartData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    stroke={theme.palette.background.paper}
                                    strokeWidth={2}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name, props) => {
                                // Calculate percent based on chartData
                                const total = chartData.reduce((sum, item) => sum + item.value, 0);
                                const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return [value, `${name} (${percent}%)`];
                            }}
                            contentStyle={{
                                backgroundColor: theme.palette.background.paper,
                                border: 'none',
                                borderRadius: theme.shape.borderRadius,
                                boxShadow: theme.shadows[3],
                                padding: theme.spacing(1)
                            }}
                        />
                        <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            wrapperStyle={{
                                paddingLeft: 20
                            }}
                            formatter={(value, entry) => {
                                // Calculate percent based on chartData
                                const total = chartData.reduce((sum, item) => sum + item.value, 0);
                                const percent = total > 0 ? ((entry.payload.value / total) * 100).toFixed(1) : 0;
                                return `${value} (${percent}%)`;
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </Paper>
    );
};

export default SkillsPieChart;