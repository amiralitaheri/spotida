import {combineReducers} from 'redux';
import dataReducer from "./dataReducer";
import tabReducer from "./tabReducer";

const rootReducer = combineReducers({
    data: dataReducer,
    tab: tabReducer
});
export default rootReducer;