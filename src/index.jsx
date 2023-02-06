import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import {BrowserRouter as Router} from "react-router-dom";
import {
    Routes,
    Route
} from "react-router";
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import rootReducer from "./redux/reducers";
import {persistStore, persistReducer} from 'redux-persist'
import {PersistGate} from 'redux-persist/integration/react'
import storage from 'redux-persist/lib/storage'
import LandingPage from './pages/LandingPage'
import CallbackPage from "./pages/CallbackPage";
import DashboardPage from "./pages/DashboardPage";
import {ErrorBoundary} from "./components/ErrorBoundary";
import * as Sentry from "@sentry/react";


const persistConfig = {
    key: 'root',
    storage
}
const persistedReducer = persistReducer(persistConfig, rootReducer)


const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(ReduxThunk)));
const persistor = persistStore(store);

Sentry.init({
    dsn: "https://cf703810f80544ab81a28d62b0585f12@o4504632718786560.ingest.sentry.io/4504632721014784",
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <React.StrictMode>
            <ErrorBoundary>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <Router>
                            <Routes>
                                <Route path='/' exact element={<LandingPage/>}/>
                                <Route path='/callback' element={<CallbackPage/>}/>
                                <Route path='/dashboard' element={<DashboardPage/>}/>
                            </Routes>
                        </Router>
                    </PersistGate>
                </Provider>
            </ErrorBoundary>
        </React.StrictMode>
    </React.StrictMode>
)
