import {createEpic} from "../../../common/store/async/AsyncActionEpicCreator";
import {Book} from "../types/Book";
import {
    createBookAction,
    fetchIsbnSuggestionsAction,
    fetchMultipleBooksDetailsAction,
    resetIsbnSuggestionStatusAction
} from "./Actions";
import BooksApi from "../api/BooksApi";
import {combineEpics, Epic} from "redux-observable";
import {BookFormValues} from "../components/EditBookForm";
import {AppState} from "../../../common/store";
import {filter, map} from "rxjs/operators";

const fetchMultipleBooksDetailsEpic = createEpic<string[], Array<Book | null>, Error>(fetchMultipleBooksDetailsAction, params => Promise.all(params.map(bookId => BooksApi.fetchBookDetails(bookId))));
const fetchIsbnSuggestionsEpic = createEpic<string, Book[], Error>(fetchIsbnSuggestionsAction, params => BooksApi.findIsbnSuggestions(params));
const createBookEpic = createEpic<BookFormValues, Book, Error>(createBookAction, params => BooksApi.createBook(params.isbn, params.title, params.authors, params.cover));

const resetSuggestionsOnCreateEpic: Epic<any, any, AppState> = (action$, state$) => action$
    .pipe(
        filter(action => action.type === createBookAction.done.type && state$.value.books.lastFetchedIsbnSuggestions.params === state$.value.books.createBookStatus.params?.isbn),
        map(() => resetIsbnSuggestionStatusAction())
    );

export const booksEpic = combineEpics(fetchMultipleBooksDetailsEpic, fetchIsbnSuggestionsEpic, createBookEpic, resetSuggestionsOnCreateEpic);
