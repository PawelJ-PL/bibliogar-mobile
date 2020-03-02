import {Library, LoanDurationUnit} from "../types/Library";
import client from "../../../common/api/BaseClient";

export default {
    fetchMyLibraries(): Promise<Library[]> {
        return client.get<Library[]>('/libraries').then(resp => resp.data)
    },
    updateLibrary(libraryId: string, name: string, loanDurationValue: number, loanDurationUnit: LoanDurationUnit, booksLimit?: number | null): Promise<Library> {
        return client.put<Library>(`/libraries/${libraryId}`, {
            name,
            loanDurationValue,
            loanDurationUnit,
            booksLimit
        }).then(resp => resp.data)
    },
    deleteLibrary(libraryId: string): Promise<void> {
        return client.delete<void>(`/libraries/${libraryId}`).then(resp => resp.data)
    },
    createLibrary(name: string, loanDurationValue: number, loanDurationUnit: LoanDurationUnit, booksLimit?: number | null): Promise<Library> {
        return client.post<Library>('/libraries', {
            name,
            loanDurationValue,
            loanDurationUnit,
            booksLimit
        }).then(resp => resp.data)
    },
    fetchLibraryData(libraryId: string): Promise<Library | null> {
        return client.get<Library>(`/libraries/${libraryId}`)
            .then(resp => resp.data)
            .catch(err => {
                if (err.response?.status === 400 || err.response?.status === 403) {
                    return null
                } else {
                    return Promise.reject(err)
                }
            })
    }
}

