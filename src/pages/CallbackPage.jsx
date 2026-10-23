import React, {useEffect, useState} from "react";
import {login, getData, error} from '../redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import {Navigate, useLocation} from "react-router";
import Container from "../components/Container";
import styles from './CallbackPage.module.scss';
import Card from "../components/Card";
import {exchangeCodeForToken} from "../utils/spotify";
import LoginButton from "../components/LoginButton";
import ErrorPage from "./ErrorPage";

export default () => {
    const isDataLoaded = useSelector(state => state.data.isDataLoaded);
    const dataLoadError = useSelector(state => state.data.dataLoadError);
    const dataLoadErrorMessage = useSelector(state => state.data.dataLoadErrorMessage);
    const dispatch = useDispatch();
    const [accessDeniedError, setAccessDeniedError] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const authError = params.get('error');
        const code = params.get('code');

        if (authError === 'access_denied') {
            setAccessDeniedError(true);
            return;
        }
        if (authError || !code) {
            dispatch(error(`While signing in with Spotify:\n${authError || 'No authorization code received'}`));
            return;
        }

        let cancelled = false;
        exchangeCodeForToken(code)
            .then(({access_token}) => {
                if (cancelled) return;
                dispatch(login(access_token));
                dispatch(getData());
            })
            .catch(err => {
                if (!cancelled) dispatch(error(`While signing in with Spotify:\n${err.message}`));
            });
        return () => {
            cancelled = true;
        };
    }, [dispatch, location]);

    if (isDataLoaded === true) {
        return <Navigate replace to="/dashboard"/>
    }

    if (accessDeniedError) {
        return <Container className={styles.container}>
            <Card className={styles.card}>
                <h5 className={styles.text}>Access Denied!! <span aria-label='crying' role='img'>😭</span></h5>
                <LoginButton/>
            </Card>
        </Container>
    }

    if (dataLoadError) {
        return <ErrorPage
            message='Sorry an error happened while we were trying to load your data, We will look into it.'
            errorMessage={dataLoadErrorMessage}/>
    }

    return <Container className={styles.container}>
        <Card className={styles.card}>
            <div className={styles.spinner}>
                <span className={styles.bounce1}/>
                <span className={styles.bounce2}/>
                <span/>
            </div>
            <h5 className={styles.text}>Stealing your data <span aria-label='cool guy' role='img'>😎</span></h5>
        </Card>
    </Container>
}