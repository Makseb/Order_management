/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App.js';
import { name as appName } from './app.json';


import { store } from './src/shared/index.js';
import { persistor } from './src/shared/index.js';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const AppWithRedux = () => (
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
);

// Register the main component
AppRegistry.registerComponent(appName, () => AppWithRedux);