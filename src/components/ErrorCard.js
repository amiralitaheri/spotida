import React from "react";
import styles from "./ErrorCard.module.scss";
import Card from "./Card";

export default (props) => <Card className={styles.card}>
    <span role='img' aria-label='sad and sorry'>😓</span>
    <h5 className={styles.text}>Sorry an error happened while we were trying to load your data, We will look into
        it.</h5>
    <code className={styles.error}>{props.errorMessage}</code>
</Card>