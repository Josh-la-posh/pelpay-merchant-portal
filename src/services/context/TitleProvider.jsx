import { createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';

const TitleContext = createContext({});

export const TitleProvider = ({ children }) => {
    const [appTitle, setAppTitle] = useState(() => {
        const storedTitle = localStorage.getItem('appTitle');
        return storedTitle ? JSON.parse(storedTitle) : '';
    });

    useEffect(() => {
        localStorage.setItem('appTitle', JSON.stringify(appTitle));
    }, [appTitle]);

    return (
        <TitleContext.Provider value={{ appTitle, setAppTitle }}>
            {children}
        </TitleContext.Provider>
    )
}

export default TitleContext;

TitleProvider.propTypes = {
    children: PropTypes.node.isRequired,
};