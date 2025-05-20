
import { FaSearch } from 'react-icons/fa';
import Filterbar from './Filterbar/Filterbar';
import JobLayout from './JobLayout/JobLayout';

const Job = () => {
    return (
        <div>
            <div className='rounded-2xl p-4'>
                <div className='flex justify-between items-center px-5'>

                    <div className='flex flex-1 gap-8 '>
                        <select defaultValue="Jobs" className="select select-primary">
                            <option disabled={true}>Jobs</option>
                            <option>VScode</option>
                            <option>VScode fork</option>
                            <option>Another VScode fork</option>
                        </select>


                        <select defaultValue="Location" className="select select-secondary">
                            <option disabled={true}>Location</option>
                            <option>VScode</option>
                            <option>VScode fork</option>
                            <option>Another VScode fork</option>
                        </select>

                        <select defaultValue="Amount" className="select select-info">
                            <option disabled={true}>Amount</option>
                            <option>VScode</option>
                            <option>VScode fork</option>
                            <option>Another VScode fork</option>
                        </select>
                    </div>

                    <div className=''>
                        <FaSearch size={25} />

                    </div>

                </div>
            </div>
            <div className="flex flex-col md:flex-row px-4 md:px-8 py-6 gap-6">
                <div className="w-72">
                    <Filterbar />
                </div>
                <div className="flex-1">
                    <JobLayout />
                </div>
            </div>
        </div >
    );
};

export default Job;
