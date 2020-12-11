import {ActionTypes} from "../actions";

const dataInitialState = {
    token: null,
    isDataLoaded: false,
    me: null,
    artistsS: null,
    artistsM: null,
    artistsL: null,
    tracksS: null,
    tracksM: null,
    tracksL: null
};

const dataReducer = (state = dataInitialState, action) => {
    switch (action.type) {
        case ActionTypes.ERROR:
            return {
                ...state,
                dataLoadError: true,
                dataLoadErrorMessage: action.payload.message
            }
        case ActionTypes.LOGIN:
            return {
                ...state,
                dataLoadError: false,
                token: action.payload.token,
                expireDate: Date.now() + 3600000,
                isDataLoaded: false,
            };
        case ActionTypes.SAVE_DATA:
            return {
                ...state,
                me: action.payload.me,
                artistsS: action.payload.artistsS,
                artistsM: action.payload.artistsM,
                artistsL: action.payload.artistsL,
                tracksS: action.payload.tracksS,
                tracksM: action.payload.tracksM,
                tracksL: action.payload.tracksL,
                topGenres: action.payload.topGenres,
                audioFeatures: action.payload.audioFeatures,
                audioFeaturesAverage: action.payload.audioFeaturesAverage,
                leastPopularArtist: action.payload.leastPopularArtist,
                leastPopularTrack: action.payload.leastPopularTrack,
                genres: action.payload.genres,
                isDataLoaded: true,
            }
        case ActionTypes.LOGOUT:
            return dataInitialState;
        default:
            return state;
    }
};

export default dataReducer;