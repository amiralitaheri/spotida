import {calculateTopGenres, getAverageFromAudioFeatures, getLeastPopular, getTrackIds} from "../../utils";
import * as ActionTypes from './actionTypes';

export const login = (token) => ({
    type: ActionTypes.LOGIN,
    payload: {
        token
    }
})

export const saveDate = (data) => ({
    type: ActionTypes.SAVE_DATA,
    payload: data
})

export const getData = () => (dispatch, getState) => {
    const {token} = getState().data;
    const options = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    };

    Promise.all([
            fetch('https://api.spotify.com/v1/me', options).then(response => response.json()),
            fetch('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50', options).then(response => response.json()),
            fetch('https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50', options).then(response => response.json()),
            fetch('https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50', options).then(response => response.json()),
            fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50', options).then(response => response.json()),
            fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50', options).then(response => response.json()),
            fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50', options).then(response => response.json()),
            fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', options).then(response => response.json()),
        ]
    ).then(([me, artistsS, artistsM, artistsL, tracksS, tracksM, tracksL, {genres}]) => {
        const topGenres = calculateTopGenres([artistsS, artistsM, artistsL]);
        const trackIds = getTrackIds([tracksS, tracksM, tracksL]);
        const leastPopularTrack = getLeastPopular(tracksL);
        const leastPopularArtist = getLeastPopular(artistsL);

        Promise.all([
            fetch(`https://api.spotify.com/v1/audio-features/?ids=${trackIds.slice(0, 70).join(',')}`, options).then(response => response.json()),
            fetch(`https://api.spotify.com/v1/audio-features/?ids=${trackIds.slice(71, trackIds.length).join(',')}`, options).then(response => response.json()),
        ]).then(response => {
            const audioFeatures = (response[1].audio_features[0] === null) ? response[0].audio_features : response[0].audio_features.concat(response[1].audio_features);
            const audioFeaturesAverage = getAverageFromAudioFeatures(audioFeatures);
            dispatch(saveDate({
                me,
                artistsS,
                artistsM,
                artistsL,
                tracksS,
                tracksM,
                tracksL,
                token,
                topGenres,
                audioFeatures,
                audioFeaturesAverage,
                leastPopularTrack,
                leastPopularArtist,
                genres
            }));
        }).catch(err => {
            dispatch(error(`While getting audio features:\n${err}`));
        });

    }).catch(err => {
        dispatch(error(`While getting music data:\n${err}`));
    });
}

export const error = (err) => ({
    type: ActionTypes.ERROR,
    payload: {
        message: err
    }
})

export const changeTab = (tabName) => ({
    type: ActionTypes.CHANGE_TAB,
    payload: {
        selectedTab: tabName
    }
})

export const logout = () => ({
    type: ActionTypes.LOGOUT
})

export {ActionTypes};
