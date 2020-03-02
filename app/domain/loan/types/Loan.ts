import {Moment} from "moment";

export interface Loan {
    version: string
    id: string
    libraryId?: string | null
    returnTo: Moment,
    returnedAt?: Moment | null
    books: Array<string | null>
}
