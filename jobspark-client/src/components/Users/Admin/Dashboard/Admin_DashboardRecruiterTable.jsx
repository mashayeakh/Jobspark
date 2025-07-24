import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Collapse,
    Pagination,
    Paper
} from '@mui/material';
import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material';

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

const RecruiterRow = ({ row }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <motion.tr
                variants={rowVariants}
                className="hover:bg-gray-50"
            >
                <TableCell className="border-0">
                    <IconButton
                        size="small"
                        onClick={() => setOpen(!open)}
                        className="text-gray-500 hover:bg-gray-200"
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell className="border-0 font-medium">{row.name}</TableCell>
                <TableCell className="border-0 text-gray-600">{row.email}</TableCell>
                <TableCell className="border-0">{row.location}</TableCell>
                <TableCell className="border-0">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {row.status}
                    </span>
                </TableCell>
                <TableCell className="border-0">{row.jobsPosted}</TableCell>
                <TableCell className="border-0">
                    <button className="text-sm px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors">
                        Manage
                    </button>
                </TableCell>
            </motion.tr>
            <TableRow>
                <TableCell className="p-0 border-0" colSpan={7}>
                    <motion.div
                        initial="closed"
                        animate={open ? "open" : "closed"}
                        variants={collapseVariants}
                    >
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box className="p-4 bg-gray-50">
                                <Typography variant="subtitle1" className="font-medium mb-2">
                                    Recruiter Details
                                </Typography>
                                <div className="grid grid-cols-2 gap-4">
                                    {row.details.map((detail, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-white p-3 rounded-lg shadow-xs"
                                        >
                                            <p className="text-xs text-gray-500">{detail.label}</p>
                                            <p className="font-medium">{detail.value}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </Box>
                        </Collapse>
                    </motion.div>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};

RecruiterRow.propTypes = {
    row: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        jobsPosted: PropTypes.number.isRequired,
        details: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
            })
        ).isRequired,
    }).isRequired,
};

const Admin_DashboardRecruiterTable = ({ data, title }) => {
    const [page, setPage] = React.useState(1);
    const rowsPerPage = 5;

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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col"
        >
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            </div>
            <TableContainer className="flex-1 overflow-auto">
                <Table stickyHeader className="min-w-full">
                    <TableHead>
                        <TableRow className="bg-gray-50">
                            <TableCell className="w-12 border-0"></TableCell>
                            <TableCell className="border-0 font-medium">Name</TableCell>
                            <TableCell className="border-0 font-medium">Email</TableCell>
                            <TableCell className="border-0 font-medium">Company</TableCell>
                            <TableCell className="border-0 font-medium">Status</TableCell>
                            <TableCell className="border-0 font-medium">Jobs Posted</TableCell>
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