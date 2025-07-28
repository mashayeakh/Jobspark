import React from 'react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
        return (
            <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                <p className="font-semibold">{payload[0].payload.name}</p>
                <p className="text-sm">
                    {payload[0].value} {payload[0].value === 1 ? 'profile' : 'profiles'}
                </p>
            </div>
        );
    }
    return null;
};

export default CustomTooltip;
