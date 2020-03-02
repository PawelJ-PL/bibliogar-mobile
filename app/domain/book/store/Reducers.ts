import {createReducer} from "../../../common/store/async/AsyncReducerCreator";
import {
    createBookAction,
    fetchIsbnSuggestionsAction,
    fetchMultipleBooksDetailsAction,
    resetCreateBookStatusAction, resetIsbnSuggestionStatusAction
} from "./Actions";
import {combineReducers} from "redux";

const fetchMultipleBooksDetailsReducer = createReducer(fetchMultipleBooksDetailsAction);
const fetchIsbnSuggestionsReducer = createReducer(fetchIsbnSuggestionsAction, resetIsbnSuggestionStatusAction);
const createBookReducer = createReducer(createBookAction, resetCreateBookStatusAction);

export const booksReducer = combineReducers({
    lastFetchedBooks: fetchMultipleBooksDetailsReducer,
    lastFetchedIsbnSuggestions: fetchIsbnSuggestionsReducer,
    createBookStatus: createBookReducer
});
