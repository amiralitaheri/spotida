import {calculateTopGenres, fetchToJson, getAverageFromAudioFeatures, getLeastPopular, getTrackIds} from "../../utils";
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

const getAudioFeatures = async (trackIds, options) => {
    const chunks = [];
    for (let i = 0; i < trackIds.length; i += 100) {
        chunks.push(trackIds.slice(i, i + 100));
    }
    const responses = await Promise.all(chunks.map(ids =>
        fetch(`https://api.spotify.com/v1/audio-features?ids=${ids.join(',')}`, options).then(fetchToJson)
    ));
    const audioFeatures = responses.flatMap(response => response.audio_features).filter(Boolean);
    return audioFeatures.length > 0 ? audioFeatures : null;
}

export const getData = () => (dispatch, getState) => {
    const {token} = getState().data;
    const options = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    };

    Promise.all([
            fetch('https://api.spotify.com/v1/me', options).then(fetchToJson),
            fetch('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50', options).then(fetchToJson),
            fetch('https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50', options).then(fetchToJson),
            fetch('https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50', options).then(fetchToJson),
            fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50', options).then(fetchToJson),
            fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50', options).then(fetchToJson),
            fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50', options).then(fetchToJson),
        ]
    ).then(async ([me, artistsS, artistsM, artistsL, tracksS, tracksM, tracksL]) => {
        const topGenres = calculateTopGenres([artistsS, artistsM, artistsL]);
        const trackIds = getTrackIds([tracksS, tracksM, tracksL]);
        const leastPopularTrack = getLeastPopular(tracksL);
        const leastPopularArtist = getLeastPopular(artistsL);

        // Spotify has deprecated the recommendations and audio-features endpoints and
        // returns 403/404 for most apps. Load them optionally so the rest of the
        // dashboard still works; features that need them are hidden when missing.
        const [genres, audioFeatures] = await Promise.all([
            fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', options)
                .then(fetchToJson)
                .then(json => json.genres)
                .catch(() => null),
            getAudioFeatures(trackIds, options).catch(() => null),
        ]);
        const audioFeaturesAverage = audioFeatures ? getAverageFromAudioFeatures(audioFeatures) : null;

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
