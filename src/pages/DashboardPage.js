import React from "react";
import {useSelector} from 'react-redux';
import {Redirect} from "react-router";
import Nav from "../components/Nav";
import Container from "../components/Container";
import Footer from "../components/Footer";

export default () => {
    const isDataLoaded = useSelector(state => state.data.isDataLoaded);
    return (isDataLoaded || true) ?
        <>
            <Nav/>
            <Container>
                <Footer/>
            </Container>
        </> : <Redirect to='/'/>
}
