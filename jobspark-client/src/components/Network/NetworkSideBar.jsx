import React, { useContext, useEffect } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { NetworkContext } from './../Context/NetworkContextProvider';
import { Link } from 'react-router';

const NetworkSideBar = () => {

    const { pendingUser } = useContext(NetworkContext);

    console.log("pending from sidebar", pendingUser.count);
    useEffect(() => {
        console.log("Sidebar count updated:", pendingUser.count);
    }, [pendingUser.count]);

    return (
        <>
            <div className="max-w-4xl mx-auto">
                {/* Main container with subtle outer glow */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-gray-50 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]">
                    {/* Title with text glow */}
                    <h2 className="text-4xl font-bold pb-6 text-center text-blue-800 [text-shadow:_0_0_8px_rgba(59,130,246,0.2)]">
                        Manage My Network
                    </h2>

                    {/* Card container with inner glow */}
                    <div className="w-full rounded-xl bg-white shadow-inner border border-gray-100 overflow-hidden relative">
                        {/* Inner glow effect */}
                        <div className="absolute inset-0 rounded-xl pointer-events-none border-[3px] border-white/50 shadow-[inset_0_0_20px_0_rgba(59,130,246,0.1)]" />

                        <div className="p-8 space-y-6 relative z-10">
                            {/* Connection Card */}
                            <div className="relative group">
                                <div className="absolute inset-0 rounded-lg bg-blue-100/30 blur-md opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                <div className="relative flex items-center justify-between p-5 bg-blue-50 rounded-lg border border-blue-100 hover:border-blue-200 transition-all">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-white rounded-full shadow-sm ring-1 ring-blue-200">
                                            <span className="text-2xl">👥</span>
                                        </div>
                                        <span className="text-xl font-medium text-gray-700">Total Connections</span>
                                    </div>
                                    <span className="text-2xl font-bold text-blue-600 [text-shadow:_0_0_10px_rgba(59,130,246,0.3)]">
                                        {32}
                                    </span>
                                </div>
                            </div>

                            {/* Pending Requests Card */}
                            {/* Pending Requests Card with Heartbeat Animation */}
                            <div className="relative group">
                                {/* Background glow that pulses */}
                                <div className={`absolute inset-0 rounded-lg bg-amber-200/50 blur-md ${pendingUser.count > 0
                                    ? 'opacity-100 animate-[pulseGlow_2s_ease-in-out_infinite]'
                                    : 'opacity-0 group-hover:opacity-100'
                                    } transition-all duration-300`} />

                                {/* Main card with more pronounced animation */}

                                <div
                                    className={`relative flex items-center justify-between p-5 bg-amber-50 rounded-lg border transition-all
    ${pendingUser.count > 0
                                            ? 'border-amber-300 shadow-lg animate-[gentleBounce_2s_ease-in-out_infinite]'
                                            : 'border-amber-100 hover:border-amber-200'
                                        }`}
                                >
                                    <div className="flex items-center space-x-4">
                                        {/* Icon with conditional heartbeat effect */}
                                        <div
                                            className={`p-3 rounded-full shadow-sm
        ${pendingUser.count > 0
                                                    ? 'bg-amber-100 ring-2 ring-amber-400 animate-[iconPulse_1.5s_ease-in-out_infinite]'
                                                    : 'bg-white ring-1 ring-amber-200'
                                                }`}
                                        >
                                            <span className="text-2xl">⏳</span>
                                        </div>
                                        <span className="text-xl font-medium text-gray-700">Pending Requests</span>
                                    </div>

                                    {/* Count with pulse animation if pending > 0 */}
                                    <span
                                        className={`text-2xl font-bold
      ${pendingUser.count > 0
                                                ? 'text-amber-700 animate-[counterPulse_1s_ease-in-out_infinite]'
                                                : 'text-amber-600'
                                            }`}
                                    >
                                        {pendingUser.count}
                                    </span>
                                </div>

                            </div>

                            {/* Companies Followed Card */}
                            <div className="relative group">
                                <div className="absolute inset-0 rounded-lg bg-green-100/30 blur-md opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                <div className="relative flex items-center justify-between p-5 bg-green-50 rounded-lg border border-green-100 hover:border-green-200 transition-all">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-white rounded-full shadow-sm ring-1 ring-green-200">
                                            <span className="text-2xl">🏢</span>
                                        </div>
                                        <span className="text-xl font-medium text-gray-700">Companies Followed</span>
                                    </div>
                                    <span className="text-2xl font-bold text-green-600 [text-shadow:_0_0_10px_rgba(16,185,129,0.3)]">
                                        {34}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Button with animated glow */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-right">
                            <button className="relative px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium shadow-lg overflow-hidden group">
                                <span className="relative z-10">View All Connections</span>
                                {/* Animated glow */}
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                {/* Pulse animation */}
                                <span className="absolute inset-0 rounded-lg shadow-[0_0_15px_5px_rgba(59,130,246,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NetworkSideBar