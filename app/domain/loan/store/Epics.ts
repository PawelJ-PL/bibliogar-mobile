import {createEpic, createLocalFallbackEpic} from "../../../common/store/async/AsyncActionEpicCreator";
import {Loan} from "../types/Loan";
import {createLoanAction, editLoanAction, fetchActiveLoansAction, finishLoanAction} from "./Actions";
import LoansApi, {EditLoanReq, LoanResponse, responseToLoan} from "../api/LoansApi";
import {combineEpics, Epic} from "redux-observable";
import {AppState} from "../../../common/store";
import {filter, ignoreElements, map, tap} from "rxjs/operators";
import {updateLoanNotificationsOnAction} from "../utils/notificationsRepositoryHelpers";

const fetchActiveLoansEpic = createEpic<void, Loan[], Error>(fetchActiveLoansAction, () => LoansApi.fetchActiveLoans());
const finishLoanEpic = createEpic<string, Loan, Error>(finishLoanAction, params => LoansApi.finishLoan(params));
const createLoanEpic = createEpic<{ libraryId: string, books: Array<string | null>, allowLimitOverrun?: boolean }, Loan, Error>(createLoanAction, params => LoansApi.createLoan(params.libraryId, params.books, params.allowLimitOverrun));
const editLoanEpic = createEpic<EditLoanReq & { allowLimitOverrun?: boolean }, Loan, Error>(editLoanAction, params => {
    const {allowLimitOverrun, ...data} = params;
    return LoansApi.editLoan(data, allowLimitOverrun)
});

const deserializeLoan: (data: string) => Loan[] = data => {
    const jsonData = JSON.parse(data) as LoanResponse[];
    return jsonData.map(responseToLoan)
};

const refreshActiveLoansOnEventsEpic: Epic<any, any, AppState> = action$ => action$
    .pipe(
        filter(action => [finishLoanAction.done.type, createLoanAction.done.type, editLoanAction.done.type].includes(action.type)),
        map(() => fetchActiveLoansAction.started())
    );

const updateLoanNotificationsEpic: Epic<any, any, AppState> = action$ => action$
    .pipe(
        filter(fetchActiveLoansAction.done.match),
        tap(updateLoanNotificationsOnAction),
        ignoreElements()
    )

const [saveActiveLoansEpic, loadActiveLoansEpic] = createLocalFallbackEpic(fetchActiveLoansAction, '', undefined, undefined, deserializeLoan);

export const loansEpic = combineEpics(fetchActiveLoansEpic, saveActiveLoansEpic, loadActiveLoansEpic, finishLoanEpic, refreshActiveLoansOnEventsEpic, createLoanEpic, editLoanEpic, updateLoanNotificationsEpic);
