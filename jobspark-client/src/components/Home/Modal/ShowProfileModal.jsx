import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../Context/AuthContextProvider';
import { postMethod } from '../../Utils/Api';
import { useNavigate } from 'react-router'; // assuming react-router

const ShowProfileModal = () => {
    const { user } = useContext(AuthContext);
    const isProfileComplete = user?.jobSeekerProfile?.isProfileComplete;
    const modalRef = useRef(null);
    const navigate = useNavigate();

    // Function to create the notification for job seeker
    const createNotification = async () => {
        if (!user?._id) return;

        const url = `http://localhost:5000/api/v1/jobseeker/${user?._id}/notifications`;

        try {
            await postMethod(url, {
                message: 'Please complete your profile to get better job recommendations.',
                type: 'reminder',
            });
            console.log('Notification created successfully');
        } catch (error) {
            console.error('Failed to create notification:', error);
        }
    };

    useEffect(() => {
        // Show modal & create notification after 5 seconds if profile incomplete
        if (!isProfileComplete) {
            const timer = setTimeout(() => {
                if (modalRef.current) {
                    modalRef.current.showModal();
                    createNotification();  // create notification when modal shows
                }
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isProfileComplete, user]);

    const handleGoToProfile = () => {
        if (modalRef.current) modalRef.current.close();
        navigate('/profile'); // Adjust route as needed
    };

    return (
        <dialog id="complete_profile_modal" className="modal" ref={modalRef}>
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-lg">Complete Your Profile</h3>
                <p className="py-4">
                    We noticed your profile is incomplete. Please complete it to get better job recommendations.
                </p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">Close</button>
                    </form>
                    <button onClick={handleGoToProfile} className="btn btn-primary">
                        Go to Profile
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default ShowProfileModal;
