import { useState } from 'react';
import './AdminLayout.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from '~/theme';
import Sidebar from '~/layouts/global/Sidebar';
import Topbar from '~/layouts/global/Topbar';

function AdminLayout({ children }) {
    const [theme, colorMode] = useMode();
    const [isSidebar, setIsSidebar] = useState(true);
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="app">
                    <Sidebar isSidebar={isSidebar}></Sidebar>
                    <main className="content">
                        <Topbar setIsSidebar={setIsSidebar} />
                        {children}
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default AdminLayout;
