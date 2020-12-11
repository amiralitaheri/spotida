import {ActionTypes} from "../actions";

const tabInitialState = {
    selectedTab: 'stats'
};
const tabReducer = (state = tabInitialState, action) => {
    switch (action.type) {
        case ActionTypes.LOGIN:
            return tabInitialState;
        case ActionTypes.CHANGE_TAB:
            return {
                ...state,
                selectedTab: action.payload.selectedTab
            }
        case ActionTypes.LOGOUT:
            return tabInitialState;
        default:
            return state;
    }
};

export default tabReducer;