import actionCreatorFactory from "typescript-fsa";
import {Loan} from "../types/Loan";
import {EditLoanReq} from "../api/LoansApi";

const actionCreator = actionCreatorFactory();

export const fetchActiveLoansAction = actionCreator.async<void, Loan[], Error>('FETCH_ACTIVE_LOANS');
export const finishLoanAction = actionCreator.async<string, Loan, Error>('FINISH_LOAN');
export const resetFinishLoanStatusAction = actionCreator('RESET_FINISH_LOAN_STATUS');
export const createLoanAction = actionCreator.async<{libraryId: string, books: Array<string | null>, allowLimitOverrun?: boolean}, Loan, Error>('CREATE_LOAN');
export const resetCreateLoanStatusAction = actionCreator('RESET_CREATE_LOAN_STATUS');
export const editLoanAction = actionCreator.async<EditLoanReq & {allowLimitOverrun?: boolean}, Loan, Error>('EDIT_LOAN');
export const resetEditLoanStatusAction = actionCreator('RESET_EDIT_LOAN_STATUS');
