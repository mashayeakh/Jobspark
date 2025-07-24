import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Collapse, Pagination, Paper } from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon, KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';
import { AdminDashboardContext } from '../../../Context/AdminContext/AdminDashboardContextProvider';

// Variants for motion animations
const rowVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.3 }
    }
};

const collapseVariants = {
    open: {
        opacity: 1,
        height: "auto",
        transition: { duration: 0.3 }
    },
    closed: {
        opacity: 0,
        height: 0,
        transition: { duration: 0.3 }
    }
};

// Row for displaying each recruiter's data
const RecruiterRow = ({ row }) => {
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <motion.tr variants={rowVariants} className="hover:bg-gray-50">
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{row.details.find(d => d.label === 'Company')?.value || 'N/A'}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.status || 'N/A'}</TableCell>
                <TableCell>{row.jobsPosted}</TableCell>
                <TableCell>{row.lastActivity}</TableCell>
                <TableCell>
                    <button className="text-sm px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors">
                        Manage
                    </button>
                </TableCell>
            </motion.tr>
            <TableRow>
                <TableCell className="p-0" colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box className="p-4 bg-gray-50">
                            <Typography variant="subtitle1" className="font-medium mb-2">
                                Recruiter Details
                            </Typography>
                            <div className="grid grid-cols-2 gap-4">
                                {row.details.map((detail, idx) => (
                                    <div key={idx} className="bg-white p-3 rounded-lg shadow-xs">
                                        <p className="text-xs text-gray-500">{detail.label}</p>
                                        <p className="font-medium">{detail.value}</p>
                                    </div>
                                ))}
                            </div>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};


RecruiterRow.propTypes = {
    row: PropTypes.shape({
        company: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        jobsPosted: PropTypes.number.isRequired,
        lastActivity: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        contact: PropTypes.string.isRequired,
        jobHistory: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired,
};




// Table Component for displaying all recruiters
const Admin_DashboardRecruiterTable = ({ data, title }) => {
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    // Check if data is available before trying to map
    if (!data || data.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm"
            >
                <p className="text-gray-500">No {title.toLowerCase()} data available</p>
            </motion.div>
        );
    }

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    console.log("DATA ", data);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            </div>
            <TableContainer className="max-h-[500px] overflow-auto">
                <Table stickyHeader className="min-w-full">
                    <TableHead>
                        <TableRow className="bg-gray-50">
                            <TableCell className="w-12 border-0"></TableCell>
                            <TableCell className="border-0 font-medium">Company Name</TableCell>
                            <TableCell className="border-0 font-medium">Recruiter Name</TableCell>
                            <TableCell className="border-0 font-medium">Profile Status</TableCell>
                            <TableCell className="border-0 font-medium">Jobs Posted</TableCell>
                            <TableCell className="border-0 font-medium">Last Activity</TableCell>
                            <TableCell className="border-0 font-medium">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data
                            .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                            .map((row, index) => (
                                <RecruiterRow key={`${row.name}-${index}`} row={row} />
                            ))}

                    </TableBody>
                </Table>
            </TableContainer>
            <div className="p-4 border-t border-gray-100 flex justify-center">
                <Pagination
                    count={Math.ceil(data.length / rowsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                    shape="rounded"
                    color="primary"
                />
            </div>
        </motion.div>
    );
};

Admin_DashboardRecruiterTable.propTypes = {
    data: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired
};

export default Admin_DashboardRecruiterTable;
