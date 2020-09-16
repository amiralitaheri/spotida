export const login = (token) => ({
    type: 'LOGIN',
    payload: {
        token
    }
})

export const saveDate = (data) => ({
    type: 'SAVE_DATA',
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
            const audioFeatures = response[0].audio_features.concat(response[1].audio_features);
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
        }).catch((err) => {
            console.log(err);
        });

    }).catch((err) => {
        console.log(err);
    });
}

const getLeastPopular = (list) => {
    let result = null;
    let resultPopularity = 100;
    list.items.forEach(item => {
        if (item.popularity < resultPopularity) {
            resultPopularity = item.popularity;
            result = item;
        }
    });
    return result;
};

const getAverageFromAudioFeatures = (audioFeatures) => {
    const average = {
        danceability: 0.0,
        energy: 0.0,
        loudness: 0.0,
        speechiness: 0.0,
        acousticness: 0.0,
        instrumentalness: 0.0,
        liveness: 0.0,
        valence: 0.0,
        tempo: 0.0,
        duration_ms: 0.0,
    };
    audioFeatures.forEach(af => {
        Object.keys(average).forEach(key => {
            average[key] += af[key]
        })
    })
    Object.keys(average).forEach(key => {
        average[key] /= audioFeatures.length;
    })
    return average;
}
const getTrackIds = (listTracks) => {
    const result = new Set();
    listTracks.forEach(list => {
        list.items.forEach(track => {
            result.add(track.id);
        })
    });
    return Array.from(result);
}
const calculateTopGenres = (listArtists) => {
    const topGenres = {}
    listArtists.forEach(list => {
        list.items.forEach(artist => {
            artist.genres.forEach(genre => {
                if (genre in topGenres) {
                    topGenres[genre] += 1;
                } else {
                    topGenres[genre] = 1;
                }
            })
        })
    });
    const items = Object.keys(topGenres).map(function (key) {
        return [key, topGenres[key]];
    });
    items.sort(function (first, second) {
        return second[1] - first[1];
    });
    const result = []
    const others = ['others', 0]
    items.forEach(item => {
        if (item[1] > 10) {
            result.push(item);
        } else {
            others[1] += item[1];
        }
    })
    result.push(others)
    return result;
}

export const changeTab = (tabName) => ({
    type: 'CHANGE_TAB',
    payload: {
        selectedTab: tabName
    }
})

export const logout = () => ({
    type: 'LOGOUT'
})

