import React from 'react'
// Dummy Data
const stats = [
    { title: "Total Recruiters", value: 1250 },
    { title: "Active Recruiters (30d)", value: 340 },
    { title: "New Registrations (This Month)", value: 120 },
    { title: "Verified Recruiters", value: "980 / 1250" },
];


const jobActivity = [
    { name: "Active Jobs", value: 400 },
    { name: "Expired Jobs", value: 150 },
];


const industries = [
    { name: "IT", value: 300 },
    { name: "Healthcare", value: 200 },
    { name: "Finance", value: 150 },
    { name: "Education", value: 100 },
    { name: "Other", value: 80 },
];


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC"];


const recruiterList = [
    { id: 1, name: "Tech Corp", jobs: 25, verified: true },
    { id: 2, name: "MediHealth", jobs: 12, verified: false },
    { id: 3, name: "FinSolve", jobs: 40, verified: true },
    { id: 4, name: "EduWorld", jobs: 7, verified: false },
];
const Recruiter_Dashboard = () => {
    return (
        <div className="p-6 space-y-6">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="card bg-base-200 shadow">
                        <div className="card-body items-center text-center">
                            <p className="text-sm opacity-70">{stat.title}</p>
                            <h2 className="text-2xl font-bold">{stat.value}</h2>
                        </div>
                    </div>
                ))}
            </div>


            {/* Job Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200 shadow">
                    <div className="card-body">
                        <h3 className="text-lg font-semibold mb-2">Job Activity</h3>
                        <ul className="list-disc list-inside">
                            {jobActivity.map((j, i) => (
                                <li key={i}>
                                    {j.name}: <span className="font-bold">{j.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>


                <div className="card bg-base-200 shadow">
                    <div className="card-body">
                        <h3 className="text-lg font-semibold mb-2">Top Industries</h3>
                        <ul className="list-disc list-inside">
                            {industries.map((ind, i) => (
                                <li key={i}>
                                    {ind.name}: <span className="font-bold">{ind.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>


            {/* Recruiter List */}
            <div className="card bg-base-200 shadow">
                <div className="card-body">
                    <h3 className="text-lg font-semibold mb-2">Recruiter Management</h3>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Recruiter</th>
                                    <th>Jobs Posted</th>
                                    <th>Verified</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recruiterList.map((r) => (
                                    <tr key={r.id}>
                                        <td>{r.name}</td>
                                        <td>{r.jobs}</td>
                                        <td>{r.verified ? "✅" : "❌"}</td>
                                        <td className="space-x-2">
                                            <button className="btn btn-sm">View</button>
                                            <button className="btn btn-sm btn-error">Ban</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Recruiter_Dashboard