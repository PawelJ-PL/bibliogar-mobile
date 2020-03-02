export interface Library {
    version: string
    id: string
    name: string
    loanDurationValue: number
    loanDurationUnit: LoanDurationUnit,
    booksLimit?: number | null
}

export enum LoanDurationUnit {
    Day = "Day",
    Week = "Week",
    Month = "Month",
    Year = "Year"
}
