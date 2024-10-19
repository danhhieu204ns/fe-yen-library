import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
// import locale from 'antd/locale/vi_VN'
import './index.css';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';

createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <ConfigProvider theme={{ token: { colorPrimary: '#f37423' } }}>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </ConfigProvider>
    // </StrictMode>
);
