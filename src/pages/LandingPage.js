import React from 'react';
import LoginButton from '../components/LoginButton';
import styles from './LandingPage.module.scss';
import Footer from "../components/Footer";
import Card from "../components/Card";
import Container from "../components/Container";

export default () => {
    return <Container>
        <main className={styles.main}>
            <Card className={styles.card}>
                <div><h1>Spotify Data</h1></div>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A cupiditate fugit illo iusto mollitia
                    repellat
                    rerum tenetur, vel. Delectus ea eveniet in officia perspiciatis praesentium sed sequi vero? Aperiam,
                    aspernatur.</p>
                <LoginButton/>
            </Card>
        </main>
        <Footer/>
    </Container>;
}
