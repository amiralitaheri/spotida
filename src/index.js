import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LandingPage from './pages/LandingPage'
import * as serviceWorker from './serviceWorker';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Switch>
                <Route path='/' component={LandingPage}/>
            </Switch>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
