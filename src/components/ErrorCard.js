import React from "react";
import styles from "./ErrorCard.module.scss";
import Card from "./Card";

export default (props) => <Card className={styles.card}>
    <span role='img' aria-label='sad and sorry'>😓</span>
    <h5 className={styles.text}>{props.message}</h5>
    <code className={styles.error}>{props.errorMessage}</code>
</Card>