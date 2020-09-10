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
}

const dataReducer = (state = dataInitialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                token: action.payload.token,
                isDataLoaded: false,
            };
        case 'SAVE_DATA':
            return {
                ...state,
                me: action.payload.me,
                artistsS: action.payload.artistsS,
                artistsM: action.payload.artistsM,
                artistsL: action.payload.artistsL,
                tracksS: action.payload.tracksS,
                tracksM: action.payload.tracksM,
                tracksL: action.payload.tracksL,
                isDataLoaded: true,
            }
        default:
            return state;
    }
}

export default dataReducer;