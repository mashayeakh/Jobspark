import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../Context/AuthContextProvider';

const ShowProfileModal = () => {
    const modalRef = useRef(null);

    const { user } = useContext(AuthContext);

    console.log("USER ", user);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (modalRef.current) {
                modalRef.current.showModal(); // Show modal after 5 seconds
            }
        }, 5000);

        return () => clearTimeout(timer); // Clean up
    }, []);

    return (
        <dialog id="complete_profile_modal" className="modal" ref={modalRef}>
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-lg">Complete Your Profile</h3>
                <p className="py-4">We noticed your profile is incomplete. Please complete it to get better job recommendations.</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">Close</button>
                    </form>
                    <button className="btn btn-primary">Go to Profile</button>
                </div>
            </div>
        </dialog>
    );
};

export default ShowProfileModal;
