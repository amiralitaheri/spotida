import React, {useEffect} from "react";
import {login, getData} from '../redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import {Redirect} from "react-router";
import Container from "../components/Container";
import styles from './CallbackPage.module.scss';
import Card from "../components/Card";
import {parseUrl} from "../utils";

export default (props) => {
    const isDataLoaded = useSelector(state => state.data.isDataLoaded);
    const dataLoadError = useSelector(state => state.data.dataLoadError);
    const dataLoadErrorMessage = useSelector(state => state.data.dataLoadErrorMessage);
    const dispatch = useDispatch();

    useEffect(() => {
        const urlParameters = parseUrl(props.location.hash);
        dispatch(login(urlParameters['#access_token']));
        dispatch(getData());
    }, [dispatch, props.location.hash]);

    if (isDataLoaded === true) {
        return <Redirect to="/dashboard"/>
    }

    if (dataLoadError) {
        return <Container className={styles.container}>
            <Card className={styles.card}>
                <span role='img' aria-label='sad and sorry'>😓</span>
                <h5 className={styles.text}>Sorry an error happened while we were trying to load your data, We will look into it.</h5>
                <code className={styles.error}>{dataLoadErrorMessage}</code>
            </Card>
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