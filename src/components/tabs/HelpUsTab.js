import React, {useCallback, useEffect, useRef, useState} from "react";
import Card from "../Card";
import styles from './HelpUsTab.module.scss';
import Button from "../Button";
import {Countries, EducationLevels, MBTITypes} from "../../utils";
import {firestore} from "../../utils/firebase";
import {useSelector} from "react-redux";
import firebase from "firebase/app";


export default () => {
    const {expireDate, token, topGenres, isDataLoaded, audioFeaturesAverage, leastPopularTrack, leastPopularArtist, genres, ...data} = useSelector(state => state.data);
    const [share, setShare] = useState(false);
    const [count, setCount] = useState('');
    useEffect(() => {
        firestore.collection('meta').doc('counter').get().then(
            doc => {
                setCount(doc.data().counter);
            }
        )
    }, [])
    const saveData = useCallback(event => {
        event.preventDefault();
        if (!share) return;
        setShare('PENDING');
        firestore.collection('data').add({
            ...data,
            age: age.current.value,
            gender: gender.current.value,
            mbti: mbti.current.value,
            education: education.current.value,
            country: country.current.value,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(
            response => {
                setShare(true);
                firestore.collection('meta').doc('counter').update({
                    counter: firebase.firestore.FieldValue.increment(1)
                })
            }
        )
    }, [data, share]);
    const age = useRef();
    const gender = useRef();
    const mbti = useRef();
    const education = useRef();
    const country = useRef();
    return <div className={styles.container}>
        <Card>
            <h1>Help Us</h1>
            <p>As we mentioned earlier, we take your privacy seriously because your data is precious. But we would
                appreciate it if you share your data with us to create an open-source dataset.</p>
            <p>Your Spotify data (Top tracks, Top artists) is more than enough, but you could help us even more by
                filling the form below.</p>
            <p className={styles.hint}>We don't store anything that could connect you with data that you share with us
                to accomplish anonymity.
                So this action can't be undone.</p>
            <form className={styles.form}>
                <label htmlFor='age'>Age</label>
                <input ref={age} min={0} max={110} type='number' id='age' name='age'/>

                <label htmlFor='gender'>Gender</label>
                <select ref={gender} id='gender' name='gender'>
                    <option value=''>Decline to say</option>
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                    <option value='other'>Other</option>
                </select>

                <label htmlFor='mbti'>MBTI type</label>
                <select ref={mbti} id='mbti' name='mbti'>
                    <option value=''>Decline to say</option>
                    {MBTITypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>

                <label htmlFor='education'>Education</label>
                <select ref={education} id='education' name='education'>
                    <option value=''>Decline to say</option>
                    {EducationLevels.map(education => <option key={education} value={education}>{education}</option>)}
                </select>
                <label htmlFor='country'>Country</label>
                <select ref={country} id='country' name='country'>
                    <option value=''>Decline to say</option>
                    {Countries.map(Country => <option key={Country.code} value={Country.name}>{Country.name}</option>)}
                </select>

                <Button onClick={saveData}>Share your data</Button>
                <p className={styles.counter}>Number of peoples who helped us: {count} {share === true ?
                    <span>+ YOU <span role='img' aria-label='love'>❤️ </span></span> : null}</p>
            </form>
        </Card>
    </div>
}