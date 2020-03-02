import React, {useEffect} from "react";
import {View} from "react-native";
import {AppState} from "../../../common/store";
import {Dispatch} from "redux";
import {fetchUserLibrariesAction} from "../../library/store/Actions";
import {connect} from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import {OperationStatus} from "../../../common/store/async/AsyncOperationResult";
import OperationErrorMessageBox from "../../../common/components/messagebox/OperationErrorMessageBox";
import EditLoanForm, {ModifyLoanData} from "./EditLoanForm";
import NoLibraryView from "./NoLibraryView";
import {
    createLoanAction,
    editLoanAction,
    fetchActiveLoansAction,
    resetCreateLoanStatusAction,
    resetEditLoanStatusAction
} from "../store/Actions";
import {StackNavigationProp} from "@react-navigation/stack";
import {LoansStackParamsProps} from "../../../common/components/navigation/panels/LoansStack";
import {RouteProp} from "@react-navigation/native";
import MessageBox from "../../../common/components/messagebox/MessageBox";
import {fetchMultipleBooksDetailsAction} from "../../book/store/Actions";
import {EditLoanReq} from "../api/LoansApi";

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & {
    navigation: StackNavigationProp<LoansStackParamsProps, 'modifyLoanScreen'>
    route: RouteProp<LoansStackParamsProps, 'modifyLoanScreen'>
}

const ModifyLoanScreen: React.FC<Props> = ({libraries, libraryFetchStatus, fetchLibraries, createLoan, cleanCreateStatus, createLoanStatus, createLoanResult, navigation, route, fetchBooksData, fetchBooksStatus, lastRequestedBooks, relatedBooks, activeLoans, fetchActiveLoans, fetchActiveLoansStatus, editLoan, editLoanStatus, cleanEditStatus}) => {
    const loan = activeLoans?.find(l => l.id === route.params?.loanId);
    const loanBooks = loan?.books || [];
    const loanBookIds = [...new Set(loanBooks.filter((bookId: string | null): bookId is string => bookId !== null))];
    const hasActualBooks = (relatedBooks !== undefined && loanBookIds.every(x => (lastRequestedBooks || []).includes(x)));

    useEffect(() => {
        if (!libraries && libraryFetchStatus !== OperationStatus.PENDING) {
            fetchLibraries()
        }
    }, []);

    useEffect(() => {
        if (route.params?.loanId && !activeLoans?.find(l => l.id === route.params.loanId) && fetchActiveLoansStatus !== OperationStatus.PENDING) {
            fetchActiveLoans()
        }
    }, []);

    useEffect(() => {
        cleanCreateStatus();
        cleanEditStatus()
    }, []);

    useEffect(() => {
        if (createLoanStatus === OperationStatus.FINISHED && createLoanResult !== undefined) {
            cleanCreateStatus();
            navigation.replace('loanPreviewScreen', {loanId: createLoanResult.id})
        }
    }, [createLoanStatus, createLoanResult]);

    useEffect(() => {
        if (loan) {
            if (!hasActualBooks && fetchBooksStatus !== OperationStatus.PENDING) {
                fetchBooksData(loanBookIds)
            }
        }
    }, [activeLoans, fetchBooksStatus, relatedBooks, lastRequestedBooks]);

    const onSubmit = (updatedLoan: ModifyLoanData) => {
        const allowLimitOverrun = updatedLoan.library.booksLimit && updatedLoan.books.length > updatedLoan.library.booksLimit ? true : undefined;
        const bookIds = updatedLoan.books.map(b => b === null ? null : b.id);
        if (updatedLoan.type === 'CREATE') {
            createLoan(updatedLoan.library.id, bookIds, allowLimitOverrun)
        } else {
            const {library, books, ...data} = updatedLoan;
            editLoan({...data, libraryId: library.id, books: bookIds}, allowLimitOverrun)
        }
    };

    if (libraryFetchStatus === OperationStatus.PENDING || fetchActiveLoansStatus === OperationStatus.PENDING || fetchBooksStatus === OperationStatus.PENDING || (route.params?.loanId && !hasActualBooks)) {
        return <Spinner visible={true} textContent='Wczytywanie danych'/>
    } else if (libraryFetchStatus === OperationStatus.FAILED) {
        return <View><OperationErrorMessageBox visible={true}/></View>
    } else if (!Boolean(libraries?.length)) {
        return <NoLibraryView/>
    } else if (route.params?.loanId && !activeLoans?.find(l => l.id === route.params?.loanId)) {
        return <View><MessageBox visible={true} message='Nie odnaleziono wypożyczenia' type='warning'/></View>
    } else {
        const initData = (loan && relatedBooks) ?
            {
                libraryId: loan.libraryId || null,
                books: loan.books.map(bookId => bookId === null ? null : (relatedBooks.find(b => b?.id === bookId) || null)),
                returnTo: loan.returnTo,
                loanId: loan.id
            } :
            undefined;
        return (
            <View>
                <EditLoanForm
                    initialData={initData}
                    availableLibraries={libraries || []}
                    onSubmit={onSubmit}
                    submitError={[createLoanStatus, editLoanStatus].includes(OperationStatus.FAILED)}
                    processingSubmit={[createLoanStatus, editLoanStatus].includes(OperationStatus.PENDING)}
                />
            </View>
        )
    }
};

const mapStateToProps = (state: AppState) => ({
    libraries: state.libraries.librariesStatus.data,
    libraryFetchStatus: state.libraries.librariesStatus.status,
    createLoanStatus: state.loans.createLoanStatus.status,
    createLoanResult: state.loans.createLoanStatus.data,
    activeLoans: state.loans.activeLoansStatus.data,
    fetchActiveLoansStatus: state.loans.activeLoansStatus.status,
    relatedBooks: state.books.lastFetchedBooks.data,
    fetchBooksStatus: state.books.lastFetchedBooks.status,
    lastRequestedBooks: state.books.lastFetchedBooks.params,
    editLoanStatus: state.loans.editLoanStatus.status
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    fetchLibraries() {
        dispatch(fetchUserLibrariesAction.started())
    },
    createLoan(libraryId: string, books: Array<string | null>, allowLimitOverrun?: boolean) {
        dispatch(createLoanAction.started({libraryId, books, allowLimitOverrun}))
    },
    cleanCreateStatus() {
        dispatch(resetCreateLoanStatusAction())
    },
    fetchActiveLoans() {
        dispatch(fetchActiveLoansAction.started())
    },
    fetchBooksData(bookIds: string[]) {
        dispatch(fetchMultipleBooksDetailsAction.started(bookIds))
    },
    editLoan(data: EditLoanReq, allowLimitOverrun?: boolean) {
        dispatch(editLoanAction.started({...data, allowLimitOverrun}))
    },
    cleanEditStatus() {
        dispatch(resetEditLoanStatusAction())
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ModifyLoanScreen)
