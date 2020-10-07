import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
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


const persistConfig = {
    key: 'root',
    storage
}
const persistedReducer = persistReducer(persistConfig, rootReducer)


const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(ReduxThunk)));
const persistor = persistStore(store);


ReactDOM.render(
    <React.StrictMode>
        <ErrorBoundary>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Router>
                        <Switch>
                            <Route path='/' exact component={LandingPage}/>
                            <Route path='/callback' component={CallbackPage}/>
                            <Route path='/dashboard' component={DashboardPage}/>
                        </Switch>
                    </Router>
                </PersistGate>
            </Provider>
        </ErrorBoundary>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
