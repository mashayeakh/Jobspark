import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, color }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Card sx={{
                borderRadius: 2,
                boxShadow: 3,
                height: '100%',
                background: `linear-gradient(135deg, ${color}20, #ffffff)`,
                borderLeft: `4px solid ${color}`
            }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="subtitle1" color="textSecondary">
                                {title}
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {value}
                            </Typography>
                        </Box>
                        <Box sx={{
                            bgcolor: `${color}20`,
                            p: 1.5,
                            borderRadius: '50%',
                            color: color
                        }}>
                            {icon}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default StatsCard;