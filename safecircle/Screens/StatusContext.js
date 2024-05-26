import React, { createContext, useState } from 'react';

export const StatusContext = createContext();

export const StatusProvider = ({ children }) => {
    const [status, setStatus] = useState('Safe');
    const [statusColor, setStatusColor] = useState('#92BDA6');

    const toggleStatus = () => {
        if (status === 'Safe') {
            setStatus('Feelng Unsafe');
            setStatusColor('#F2B7B7');
        } else {
            setStatus('Safe');
            setStatusColor('#92BDA6');
        }
    };

    return (
        <StatusContext.Provider value={{ status, statusColor, toggleStatus }}>
            {children}
        </StatusContext.Provider>
    );
};