import actionCreatorFactory from "typescript-fsa";
import {Library} from "../types/Library";
import {LibraryFormValues} from "../components/single_library/EditLibraryForm";

const actionCreator = actionCreatorFactory();

export const fetchUserLibrariesAction = actionCreator.async<void, Library[], Error>('FETCH_USER_LIBRARIES');
export const updateLibraryAction = actionCreator.async<LibraryFormValues & { libraryId: string }, Library, Error>('UPDATE_LIBRARY');
export const resetUpdateLibraryStatusAction = actionCreator('RESET_UPDATE_LIBRARY_STATUS');
export const deleteLibraryAction = actionCreator.async<string, void, Error>('DELETE_LIBRARY');
export const resetDeleteLibraryStatusAction = actionCreator('RESET_DELETE_LIBRARY');
export const createLibraryAction = actionCreator.async<LibraryFormValues, Library, Error>('CREATE_LIBRARY');
export const resetCreateLibraryStatusAction = actionCreator('RESET_CREATE_LIBRARY');
export const fetchSingleLibraryDataAction = actionCreator.async<string, Library | null, Error>('FETCH_SINGLE_LIBRARY');
