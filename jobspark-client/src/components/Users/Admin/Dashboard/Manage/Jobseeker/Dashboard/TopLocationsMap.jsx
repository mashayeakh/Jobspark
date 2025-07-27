import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

const CustomizedContent = ({ root, depth, x, y, width, height, index, colors, name, value }) => {
    const textColor = depth < 2 ? '#fff' : 'transparent';
    const fontSize = Math.min(12, Math.max(8, width / 10)); // Smaller font size

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: depth < 2 ? colors[index % colors.length] : 'rgba(255,255,255,0)',
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                    rx: 4,
                    ry: 4
                }}
            />
            {depth === 1 && width > 30 && height > 30 ? ( // Adjusted minimum size for text
                <>
                    <text
                        x={x + width / 2}
                        y={y + height / 2 - 4} // Adjusted positioning
                        textAnchor="middle"
                        fill={textColor}
                        fontSize={fontSize}
                        fontWeight={600}
                    >
                        {name}
                    </text>
                    <text
                        x={x + width / 2}
                        y={y + height / 2 + 8} // Adjusted positioning
                        textAnchor="middle"
                        fill={textColor}
                        fontSize={fontSize - 2}
                        fontWeight={500}
                    >
                        {value.toLocaleString()}
                    </text>
                </>
            ) : null}
        </g>
    );
};

const TopLocationsMap = ({ data }) => {
    const colors = [
        '#4E79A7', '#F28E2B', '#E15759', '#76B7B2',
        '#59A14F', '#EDC948', '#B07AA1', '#FF9DA7',
        '#9C755F', '#BAB0AC'
    ];

    const sortedData = [...data].sort((a, b) => b.value - a.value);

    return (
        <div style={{
            width: '100%',
            height: '100%', // Changed to 100% to fit container
            minHeight: 400, // Minimum height
            position: 'relative',
            backgroundColor: '#f9f9f9',
            borderRadius: 8,
            padding: '16px', // Reduced padding
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
            <h3 style={{
                textAlign: 'center',
                marginBottom: 16, // Reduced margin
                color: '#2c3e50',
                fontSize: '1.1rem', // Slightly smaller font
                fontWeight: 600
            }}>
                Top Locations Distribution
            </h3>

            <ResponsiveContainer width="100%" height="75%">
                <Treemap
                    data={sortedData}
                    dataKey="value"
                    aspectRatio={4 / 3}
                    stroke="#fff"
                    content={<CustomizedContent colors={colors} />}
                    animationDuration={1000}
                >
                    <Tooltip
                        formatter={(value, name) => [
                            <span key="value" style={{ fontWeight: 600 }}>{value.toLocaleString()}</span>,
                            <span key="name">{name}</span>
                        ]}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.98)',
                            border: '1px solid #e0e0e0',
                            borderRadius: '6px',
                            padding: '10px', // Reduced padding
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            color: '#333',
                            fontSize: '13px' // Slightly smaller font
                        }}
                    />
                </Treemap>
            </ResponsiveContainer>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 16, // Reduced margin
                flexWrap: 'wrap',
                gap: '8px' // Reduced gap
            }}>
                {sortedData.map((entry, index) => (
                    <div key={`legend-${index}`} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '3px 6px', // Reduced padding
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        borderRadius: 12,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{
                            width: 12, // Smaller icon
                            height: 12,
                            backgroundColor: colors[index % colors.length],
                            marginRight: 6, // Reduced margin
                            borderRadius: 2
                        }} />
                        <span style={{
                            fontSize: 11, // Smaller font
                            color: '#2c3e50',
                            fontWeight: 500
                        }}>
                            {entry.name} ({entry.value.toLocaleString()})
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopLocationsMap;