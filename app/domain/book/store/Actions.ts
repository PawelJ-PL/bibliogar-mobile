import actionCreatorFactory from "typescript-fsa";
import {Book} from "../types/Book";
import {BookFormValues} from "../components/EditBookForm";

const actionCreator = actionCreatorFactory();

export const fetchMultipleBooksDetailsAction = actionCreator.async<string[], Array<Book | null>, Error>('FETCH_MULTIPLE_BOOKS_DETAILS');
export const fetchIsbnSuggestionsAction = actionCreator.async<string, Book[], Error>('FETCH_ISBN_SUGGESTIONS');
export const resetIsbnSuggestionStatusAction = actionCreator('RESET_ISBN_SUGGESTION_ACTION');
export const createBookAction = actionCreator.async<BookFormValues, Book, Error>('CREATE_BOOK');
export const resetCreateBookStatusAction = actionCreator('RESET_CREATE_BOOK_STATUS');
