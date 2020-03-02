import {ActionsObservable, Epic} from "redux-observable";
import {AnyAction, AsyncActionCreators} from "typescript-fsa";
import {catchError, filter, ignoreElements, map, mergeMap, tap} from "rxjs/operators";
import {EMPTY, from, ObservableInput, of} from "rxjs";
import {AppState} from "../index";
import AsyncStorage from "@react-native-community/async-storage";

export const createEpic = <Params, Result, Error, Deps = any>(asyncActions: AsyncActionCreators<Params, Result, Error>, requestCreator: (params: Params, dependencies: Deps) => ObservableInput<Result>) => {
    return (actions$: ActionsObservable<AnyAction>, _: any, dependencies: Deps) =>
        actions$
            .pipe(
                filter(asyncActions.started.match),
                mergeMap(action =>
                    from(requestCreator(action.payload, dependencies)).pipe(
                        map(resp => asyncActions.done({result: resp, params: action.payload})),
                        catchError((err: Error) => [asyncActions.failed({params: action.payload, error: err})])
                    )
                )
            );
};

export const createLocalFallbackEpic = <Params, Result, Error>(
    asyncAction: AsyncActionCreators<Params, Result, Error>,
    storageKey: string, fallbackParams: Params,
    serialize?: (result: Result | undefined) => string,
    deserialize?: (data: string) => Result
) => {
    const serializeFn = serialize || ((result: Result | undefined) => JSON.stringify(result));
    const deserializeFn = deserialize || ((data: string) => JSON.parse(data) as Result);

    const saveDataOnSuccess: Epic<any, any, AppState> = action$ =>
        action$.pipe(
            filter(asyncAction.done.match),
            tap(a => AsyncStorage.setItem(storageKey, serializeFn(a.payload.result))),
            ignoreElements()
        );

    const loadDataOnFailure: Epic<any, any, AppState> = action$ => action$
        .pipe(
            filter(asyncAction.failed.match),
            mergeMap(
                () =>
                    from(AsyncStorage.getItem(storageKey)).pipe(
                        mergeMap(result => {
                            if (result) {
                                try {
                                    const loadedData = deserializeFn(result);
                                    return of(asyncAction.done({params: fallbackParams, result: loadedData}))
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

    return [saveDataOnSuccess, loadDataOnFailure]
};
