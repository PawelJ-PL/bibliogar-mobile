import {createEpic} from "../../../common/store/async/AsyncActionEpicCreator";
import {Library} from "../types/Library";
import {
    createLibraryAction,
    deleteLibraryAction,
    fetchSingleLibraryDataAction,
    fetchUserLibrariesAction,
    updateLibraryAction
} from "./Actions";
import LibrariesApi from "../api/LibrariesApi";
import {combineEpics, Epic} from "redux-observable";
import {AppState} from "../../../common/store";
import {filter, ignoreElements, mergeMap, tap, map} from "rxjs/operators";
import AsyncStorage from "@react-native-community/async-storage";
import {EMPTY, from, of} from "rxjs";
import {LibraryFormValues} from "../components/single_library/EditLibraryForm";

const LIBRARIES_DATA_STORAGE_KEY = 'librariesData';

const fetchUserLibrariesEpic = createEpic<void, Library[], Error>(fetchUserLibrariesAction, () => LibrariesApi.fetchMyLibraries());
const updateLibraryEpic = createEpic<LibraryFormValues & { libraryId: string }, Library, Error>(updateLibraryAction, params => LibrariesApi.updateLibrary(params.libraryId, params.name, params.loanDurationValue, params.loanDurationUnit, params.booksLimit));
const deleteLibraryEpic = createEpic<string, void, Error>(deleteLibraryAction, params => LibrariesApi.deleteLibrary(params));
const createLibraryEpic = createEpic<LibraryFormValues, Library, Error>(createLibraryAction, params => LibrariesApi.createLibrary(params.name, params.loanDurationValue, params.loanDurationUnit, params.booksLimit));
const fetchLibraryDataEpic = createEpic<string, Library | null, Error>(fetchSingleLibraryDataAction, params => LibrariesApi.fetchLibraryData(params));

const saveLibrariesEpic: Epic<any, any, AppState> = action$ =>
    action$.pipe(
        filter(fetchUserLibrariesAction.done.match),
        tap(a => AsyncStorage.setItem(LIBRARIES_DATA_STORAGE_KEY, JSON.stringify(a.payload.result))),
        ignoreElements()
    );

const fallbackToSavedLibrariesEpic: Epic<any, any, AppState> = action$ => action$
    .pipe(
        filter(fetchUserLibrariesAction.failed.match),
        mergeMap(
            () =>
                from(AsyncStorage.getItem(LIBRARIES_DATA_STORAGE_KEY)).pipe(
                    mergeMap(result => {
                        if (result) {
                            try {
                                const userData = JSON.parse(result) as Library[];
                                return of(fetchUserLibrariesAction.done({params: undefined, result: userData}))
                            } catch (e) {
                                return EMPTY
                            }
                        } else {
                            return EMPTY
                        }
                    })
                )
        )
    );

const refreshLibrariesAfterEditOrUpdate: Epic<any, any, AppState> = action$ => action$
    .pipe(
        filter(action => [updateLibraryAction.done.type, deleteLibraryAction.done.type, createLibraryAction.done.type].includes(action.type)),
        map(() => fetchUserLibrariesAction.started())
    );

export const librariesEpic = combineEpics(fetchUserLibrariesEpic, saveLibrariesEpic, fallbackToSavedLibrariesEpic, updateLibraryEpic, refreshLibrariesAfterEditOrUpdate, deleteLibraryEpic, createLibraryEpic, fetchLibraryDataEpic);
