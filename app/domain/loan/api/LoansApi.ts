import {Loan} from "../types/Loan";
import client from "../../../common/api/BaseClient";
import moment, {Moment} from 'moment';

export type LoanResponse = Omit<Loan, 'returnTo' | 'returnedAt'> & { returnTo: string, returnedAt?: string | null }

export const responseToLoan: (data: LoanResponse) => Loan = (data: LoanResponse) => ({
    ...data,
    returnTo: moment(data.returnTo),
    returnedAt: data.returnedAt === null || data.returnedAt === undefined ? data.returnedAt : moment(data.returnedAt)
});

export type EditLoanReq = {
    loanId: string
    libraryId: string
    returnTo: Moment
    returnedAt?: Moment | null
    books: Array<string | null>
}

export default {
    fetchActiveLoans(): Promise<Loan[]> {
        return client.get<LoanResponse[]>('/loans/active').then(resp => resp.data.map(responseToLoan))
    },
    finishLoan(loanId: string): Promise<Loan> {
        return client.delete<Loan>(`/loans/${loanId}`).then(resp => resp.data)
    },
    createLoan(libraryId: string, books: Array<string | null>, allowLimitOverrun?: boolean): Promise<Loan> {
        const params = allowLimitOverrun !== undefined ? {allowLimitOverrun} : {};
        return client.post<Loan>('/loans', {libraryId, books}, {params}).then(resp => resp.data)
    },
    editLoan(loanData: EditLoanReq, allowLimitOverrun?: boolean): Promise<Loan> {
        const params = allowLimitOverrun !== undefined ? {allowLimitOverrun} : {};
        const {loanId, ...req} = loanData;
        return client.put<Loan>(`/loans/${loanId}`, req, {params}).then(resp => resp.data)
    }
}
