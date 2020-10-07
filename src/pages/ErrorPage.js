import React from "react";
import styles from "./ErrorPage.module.scss";
import ErrorCard from "../components/ErrorCard";
import Container from "../components/Container";

export default (props) => <Container className={styles.container}>
    <ErrorCard message={props.message} errorMessage={props.errorMessage}/>
</Container>