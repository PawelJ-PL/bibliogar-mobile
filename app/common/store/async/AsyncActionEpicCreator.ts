import {ActionsObservable} from "redux-observable";
import {AnyAction, AsyncActionCreators} from "typescript-fsa";
import {catchError, filter, map, mergeMap} from "rxjs/operators";
import {from, ObservableInput} from "rxjs";

export const createEpic = <Params, Result, Error, Deps=any>(asyncActions: AsyncActionCreators<Params, Result, Error>, requestCreator: (params: Params, dependencies: Deps) => ObservableInput<Result>) => {
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
