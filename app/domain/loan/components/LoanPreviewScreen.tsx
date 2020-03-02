import React from "react";
import {RouteProp} from '@react-navigation/native';
import {LoansStackParamsProps} from "../../../common/components/navigation/panels/LoansStack";
import {AppState} from "../../../common/store";
import {OperationStatus} from "../../../common/store/async/AsyncOperationResult";
import Spinner from "react-native-loading-spinner-overlay";
import FatalErrorScreen from "../../../common/components/FatalErrorScreen";
import {connect} from "react-redux";
import LoanPreview from "./LoanPreview";

type Props = {
    route: RouteProp<LoansStackParamsProps, 'loanPreviewScreen'>
} & ReturnType<typeof mapStateToProps>

const LoanPreviewScreen: React.FC<Props> = ({route, activeLoans, isLoading, myLibraries}) => {
    const currentLoan = activeLoans?.find(l => l.id === route.params.loanId);

    const relatedLibrary = (libraryId?: string | null) => {
        if (!libraryId) {
            return undefined
        } else {
            return myLibraries?.find(lib => lib.id === libraryId)
        }
    };

    if (isLoading) {
        return <Spinner visible={true}/>
    } else if (!currentLoan) {
        return <FatalErrorScreen message={'Nie można załadować podglądu wypożyczenia'}/>
    } else {
        return <LoanPreview loan={currentLoan} library={relatedLibrary(currentLoan.libraryId)} />
    }
};

const mapStateToProps = (state: AppState) => {
    return {
        activeLoans: state.loans.activeLoansStatus.data,
        myLibraries: state.libraries.librariesStatus.data,
        isLoading: state.loans.activeLoansStatus.status === OperationStatus.PENDING || state.libraries.librariesStatus.status === OperationStatus.PENDING
    }
};

export default connect(mapStateToProps)(LoanPreviewScreen)
