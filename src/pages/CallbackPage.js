import React, {useEffect, useState} from "react";
import {login, getData} from '../redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import {Redirect} from "react-router";
import Container from "../components/Container";
import styles from './CallbackPage.module.scss';
import Card from "../components/Card";
import {parseUrl} from "../utils";
import ErrorCard from "../components/ErrorCard";
import LoginButton from "../components/LoginButton";

export default (props) => {
    const isDataLoaded = useSelector(state => state.data.isDataLoaded);
    const dataLoadError = useSelector(state => state.data.dataLoadError);
    const dataLoadErrorMessage = useSelector(state => state.data.dataLoadErrorMessage);
    const dispatch = useDispatch();
    const [accessDeniedError, setAccessDeniedError] = useState(false);

    useEffect(() => {
        const urlHashParameters = parseUrl(props.location.hash);
        const urlQueryParameters = parseUrl(props.location.search);
        if (urlQueryParameters['?error'] === 'access_denied') {
            setAccessDeniedError(true);
        } else {
            dispatch(login(urlHashParameters['#access_token']));
            dispatch(getData());
        }
    }, [dispatch, props.location]);

    if (isDataLoaded === true) {
        return <Redirect to="/dashboard"/>
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
        return <Container className={styles.container}>
            <ErrorCard message='Sorry an error happened while we were trying to load your data, We will look into it.'
                       errorMessage={dataLoadErrorMessage}/>
        </Container>
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