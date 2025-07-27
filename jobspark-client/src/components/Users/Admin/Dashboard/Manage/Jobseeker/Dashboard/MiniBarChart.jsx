import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', applications: 4000, interviews: 2400 },
    { name: 'Feb', applications: 3000, interviews: 1398 },
    { name: 'Mar', applications: 2000, interviews: 9800 },
    { name: 'Apr', applications: 2780, interviews: 3908 },
    { name: 'May', applications: 1890, interviews: 4800 },
    { name: 'Jun', applications: 2390, interviews: 3800 },
];

const MiniBarChart = () => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applications" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="interviews" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default MiniBarChart;