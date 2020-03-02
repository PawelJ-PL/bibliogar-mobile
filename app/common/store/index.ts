import {Action, applyMiddleware, combineReducers, createStore} from "redux";
import {userReducer} from "../../domain/user/store/Reducers";
import {combineEpics, createEpicMiddleware, Epic} from "redux-observable";
import {deviceReducer} from "../../domain/device/store/Reducers";
import {onKeyChange} from "../api/BaseClient";
import {filter, map} from "rxjs/operators";
import {NotLoggedIn} from "../api/Errors";
import {resetUserDataAction} from "../../domain/user/store/Actions";
import {resetApiKeyAction} from "../../domain/device/store/Actions";
import {devicesEpics} from "../../domain/device/store/Epics";
import {usersEpics} from "../../domain/user/store/Epics";
import {libraryReducers} from "../../domain/library/store/Reducers";
import {librariesEpic} from "../../domain/library/store/Epics";
import {loansReducer} from "../../domain/loan/store/Reducers";
import {loansEpic} from "../../domain/loan/store/Epics";
import {booksReducer} from "../../domain/book/store/Reducers";
import {booksEpic} from "../../domain/book/store/Epics";

const rootReducer = combineReducers({
    user: userReducer,
    device: deviceReducer,
    libraries: libraryReducers,
    loans: loansReducer,
    books: booksReducer
});

const resetUserOnNotLoggedInEpic: Epic<any, any, AppState> = (action$) =>
    action$
        .pipe(
            filter(a => a.payload?.error instanceof NotLoggedIn),
            map(() => resetUserDataAction())
        );

const resetKeyOnNotLoggedInEpic: Epic<any, any, AppState> = (action$) =>
    action$
        .pipe(
            filter(a => a.payload?.error instanceof NotLoggedIn),
            map(() => resetApiKeyAction.started())
        );

const rootEpic = combineEpics(
    resetUserOnNotLoggedInEpic,
    resetKeyOnNotLoggedInEpic,
    usersEpics,
    devicesEpics,
    librariesEpic,
    loansEpic,
    booksEpic
);

export type AppState = ReturnType<typeof rootReducer>

function configure() {
    const epicMiddleware = createEpicMiddleware<Action, Action, AppState>();

    const store = createStore(rootReducer, applyMiddleware(epicMiddleware));

    epicMiddleware.run(rootEpic);

    store.subscribe(() => onKeyChange(store.getState().device.loadApiKeyStatus.data));

    return store;
}

const applicationStore = configure();

export default applicationStore;
