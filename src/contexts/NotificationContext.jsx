import { createContext, useContext } from 'react';
import { useNotifications } from '../hooks/useNotifications';

const NotificationContext = createContext();

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotificationContext debe usarse dentro de NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const notificationMethods = useNotifications();

    return (
        <NotificationContext.Provider value={notificationMethods}>
            {children}
        </NotificationContext.Provider>
    );
};