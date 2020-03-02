import React, {useCallback, useEffect} from "react";
import {FlatList, View} from "react-native";
import {AppState} from "../../../common/store";
import {connect} from "react-redux";
import {useFocusEffect} from '@react-navigation/native';
import {Dispatch} from "redux";
import {fetchActiveLoansAction, resetFinishLoanStatusAction} from "../store/Actions";
import OperationErrorMessageBox from "../../../common/components/messagebox/OperationErrorMessageBox";
import {OperationStatus} from "../../../common/store/async/AsyncOperationResult";
import {Loan} from "../types/Loan";
import {Button, ListItem} from "react-native-elements";
import {fetchUserLibrariesAction} from "../../library/store/Actions";
import {error, warning} from "../../../common/styles/Colors";
import moment from "moment";
import {StackNavigationProp} from "@react-navigation/stack";
import {LoansStackParamsProps} from "../../../common/components/navigation/panels/LoansStack";
import Toast from "react-native-root-toast";

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & {
    navigation: StackNavigationProp<LoansStackParamsProps, 'loansScreen'>
}

const LoansScreen: React.FC<Props> = ({activeLoans, fetchActiveLoans, loansFetchStatus, libraries, fetchLibraries, isLoading, navigation, loanFinishingStatus, cleanFinishLoanStatus}) => {
    useFocusEffect(useCallback(() => {
        if (!activeLoans) {
            fetchActiveLoans();
        }
    }, [activeLoans]));

    useFocusEffect(useCallback(() => {
        if (!libraries) {
            fetchLibraries();
        }
    }, [libraries]));

    useEffect(() => {
        if (loanFinishingStatus === OperationStatus.FAILED) {
            Toast.show('Zakończenie wypożyczenia nieudane');
            cleanFinishLoanStatus()
        }
    }, [loanFinishingStatus]);

    const refresh = () => {
        fetchLibraries();
        fetchActiveLoans()
    };

    const loanAsElement = (data: { item: Loan }) =>
        <ListItem
            title={data.item.returnTo.fromNow()}
            subtitle={subtitle(data.item)}
            bottomDivider={true}
            chevron={true}
            badge={{value: data.item.books?.length}}
            containerStyle={itemStyleName(data.item)}
            onPress={() => navigation.navigate('loanPreviewScreen', {loanId: data.item.id})}
        />;

    const subtitle = (loan: Loan) => libraries?.find(lib => lib.id === loan.libraryId)?.name || '';

    const itemStyleName = (loan: Loan) => {
        if (loan.returnTo.isBefore(moment())) {
            return {
                backgroundColor: error + '30'
            }
        } else if (loan.returnTo.clone().subtract(3, 'days').isBefore(moment())) {
            return {
                backgroundColor: warning + '50'
            }
        } else {
            return undefined
        }
    };

    const renderFooter = (
        <View>
            <Button title='Nowe wypożyczenie' onPress={() => navigation.navigate('modifyLoanScreen')}/>
        </View>
    );

    return (
        <View>
            <OperationErrorMessageBox visible={loansFetchStatus === OperationStatus.FAILED}/>
            <FlatList
                data={activeLoans || []}
                renderItem={loanAsElement}
                keyExtractor={i => i.id}
                onRefresh={refresh}
                refreshing={isLoading}
                ListFooterComponent={renderFooter}
            />
        </View>
    )
};

const mapStateToProps = (state: AppState) => {
    return {
        activeLoans: state.loans.activeLoansStatus.data?.sort((a, b) => a.returnTo.valueOf() - b.returnTo.valueOf()),
        libraries: state.libraries.librariesStatus.data,
        loansFetchStatus: state.loans.activeLoansStatus.status,
        isLoading: [state.loans.activeLoansStatus.status, state.libraries.librariesStatus.status, state.loans.finishLoanStatus.status].includes(OperationStatus.PENDING),
        loanFinishingStatus: state.loans.finishLoanStatus.status
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        fetchActiveLoans() {
            dispatch(fetchActiveLoansAction.started())
        },
        fetchLibraries() {
            dispatch(fetchUserLibrariesAction.started())
        },
        cleanFinishLoanStatus() {
            dispatch(resetFinishLoanStatusAction())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(LoansScreen)
