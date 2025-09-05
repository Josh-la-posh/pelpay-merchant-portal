import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';

const SettingsContext = createContext({});

export const SettingsProvider = ({children}) => {

    const [settingsTitle, setSettingsTitle] = useState(() => {
        const title = localStorage.getItem('settingsTitle');
        return title ? JSON.parse(title) : '';
    });

    useEffect(() => {
        localStorage.setItem('settingsTitle', JSON.stringify(settingsTitle));
    }, [settingsTitle]);

    return (
        <SettingsContext.Provider value={{settingsTitle, setSettingsTitle}}>
            {children}
        </SettingsContext.Provider>
    )
}

export default SettingsContext;

SettingsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};