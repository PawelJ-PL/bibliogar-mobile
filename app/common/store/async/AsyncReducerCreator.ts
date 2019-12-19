import AsyncOperationsResult, {OperationStatus} from "./AsyncOperationResult";
import {ActionCreator, AsyncActionCreators} from "typescript-fsa";
import {reducerWithInitialState} from "typescript-fsa-reducers";

export const defaultInitState = {
    status: OperationStatus.NOT_STARTED,
    data: undefined,
    error: undefined,
    params: undefined
};

export const createReducer = <Params, Result, Error = {}>(asyncActions: AsyncActionCreators<Params, Result, Error>, resetAction: ActionCreator<void> | null = null, initialState: AsyncOperationsResult<Result, Error, Params> = defaultInitState) => {
    const baseReducer = reducerWithInitialState(initialState)
        .case(asyncActions.started, (state) => ({
            ...state,
            status: OperationStatus.PENDING,
            data: undefined,
            error: undefined,
            params: undefined
        }))
        .case(asyncActions.done, (state, action) => ({
            ...state,
            status: OperationStatus.FINISHED,
            data: action.result,
            error: undefined,
            params: action.params
        }))
        .case(asyncActions.failed, (state, action) => ({
            ...state,
            status: OperationStatus.FAILED,
            data: undefined,
            error: action.error,
            params: action.params
        }));

    return resetAction === null ?
        baseReducer :
        baseReducer
            .case(resetAction, (state) => ({
                ...state,
                ...defaultInitState
            }))
};
