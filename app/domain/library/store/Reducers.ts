import {createReducer} from "../../../common/store/async/AsyncReducerCreator";
import {
    createLibraryAction,
    deleteLibraryAction, fetchSingleLibraryDataAction,
    fetchUserLibrariesAction, resetCreateLibraryStatusAction, resetDeleteLibraryStatusAction,
    resetUpdateLibraryStatusAction,
    updateLibraryAction
} from "./Actions";
import {combineReducers} from "redux";

const fetchUserLibrariesReducer = createReducer(fetchUserLibrariesAction);
const updateLibraryReducer = createReducer(updateLibraryAction, resetUpdateLibraryStatusAction);
const deleteLibraryReducer = createReducer(deleteLibraryAction, resetDeleteLibraryStatusAction);
const createLibraryReducer = createReducer(createLibraryAction, resetCreateLibraryStatusAction);
const fetchSinglLibraryReducer = createReducer(fetchSingleLibraryDataAction);

export const libraryReducers = combineReducers({
    librariesStatus: fetchUserLibrariesReducer,
    updateStatus: updateLibraryReducer,
    deleteStatus: deleteLibraryReducer,
    createStatus: createLibraryReducer,
    libraryStatus: fetchSinglLibraryReducer
});
