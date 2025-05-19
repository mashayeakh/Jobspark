
import Filterbar from './Filterbar/Filterbar';
import JobLayout from './JobLayout/JobLayout';

const Job = () => {
    return (
        <div className="flex px-8 py-6 gap-6">
            <Filterbar />
            <JobLayout />
        </div>
    );
};

export default Job;
