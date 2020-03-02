import {createReducer} from "../../../common/store/async/AsyncReducerCreator";
import {
    createLoanAction, editLoanAction,
    fetchActiveLoansAction,
    finishLoanAction,
    resetCreateLoanStatusAction, resetEditLoanStatusAction,
    resetFinishLoanStatusAction
} from "./Actions";
import {combineReducers} from "redux";

const fetchActiveLoansReducer = createReducer(fetchActiveLoansAction);
const finishLoanReducer = createReducer(finishLoanAction, resetFinishLoanStatusAction);
const createLoanReducer = createReducer(createLoanAction, resetCreateLoanStatusAction);
const editLoanReducer = createReducer(editLoanAction, resetEditLoanStatusAction);

export const loansReducer = combineReducers({
    activeLoansStatus: fetchActiveLoansReducer,
    finishLoanStatus: finishLoanReducer,
    createLoanStatus: createLoanReducer,
    editLoanStatus: editLoanReducer
});
