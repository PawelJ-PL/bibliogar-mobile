import React, {useEffect} from "react";
import {ActivityIndicator, RefreshControl, ScrollView} from "react-native";
import {AppState} from "../../store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {OperationStatus} from "../../store/async/AsyncOperationResult";
import {fetchActiveLoansAction} from "../../../domain/loan/store/Actions";
import {Card} from "react-native-elements";
import NextReturnView from "./NextReturnView";
import OperationErrorMessageBox from "../messagebox/OperationErrorMessageBox";
import DashboardSection from "./DashboardSection";
import {useNavigation} from "@react-navigation/native";
import NoLoansView from "./NoLoansView";
import OutdatedLoansView from "./OutdatedLoansView";
import moment from "moment";
import BooksNumberView from "./BooksNumberView";

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

const DashboardScreen: React.FC<Props> = ({activeLoans, loadLoansStatus, loadActiveLoans}) => {
    useEffect(() => {
        if (![OperationStatus.FINISHED, OperationStatus.PENDING].includes(loadLoansStatus)) {
            loadActiveLoans()
        }
    }, []);

    const navigation = useNavigation();

    const nextReturnLoan = Boolean(activeLoans?.length) ? activeLoans?.reduce((prev, current) => prev.returnTo.isBefore(current.returnTo) ? prev : current) : undefined;

    const renderNextReturn = () => {
        if (loadLoansStatus === OperationStatus.FAILED) {
            return <OperationErrorMessageBox visible={true}/>
        } else if (activeLoans && activeLoans.length < 1) {
            return (
                <NoLoansView/>
            )
        } else if (nextReturnLoan) {
            return (
                <NextReturnView loan={nextReturnLoan}
                />
            )
        } else if (loadLoansStatus === OperationStatus.PENDING) {
            return <ActivityIndicator size='large'/>
        } else {
            return null
        }
    };

    const isViewRefreshing = [loadLoansStatus].includes(OperationStatus.PENDING);

    const refreshView = () => {
        loadActiveLoans()
    };

    const refreshControl = <RefreshControl refreshing={isViewRefreshing} onRefresh={refreshView}/>;

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            refreshControl={refreshControl}
        >
            <DashboardSection
                onPress={nextReturnLoan !== undefined ?
                    () => navigation.navigate('loans', {
                        screen: 'loanPreviewScreen',
                        params: {loanId: nextReturnLoan.id}
                    }) :
                    () => navigation.navigate('loans')}
            >
                <Card>
                    {renderNextReturn()}
                </Card>
            </DashboardSection>
            <DashboardSection onPress={() => navigation.navigate('loans')}>
                <Card>
                    <OperationErrorMessageBox visible={loadLoansStatus === OperationStatus.FAILED}/>
                    {
                        loadLoansStatus !== OperationStatus.FAILED &&
                        [OperationStatus.NOT_STARTED, OperationStatus.PENDING].includes(loadLoansStatus) ?
                            <ActivityIndicator size='large'/> :
                            <OutdatedLoansView loans={activeLoans?.filter(l => l.returnTo.isBefore(moment())) || []}/>
                    }
                </Card>
            </DashboardSection>
            <DashboardSection onPress={() => navigation.navigate('loans')}>
                <Card>
                    <OperationErrorMessageBox visible={loadLoansStatus === OperationStatus.FAILED}/>
                    {
                        loadLoansStatus !== OperationStatus.FAILED &&
                        [OperationStatus.NOT_STARTED, OperationStatus.PENDING].includes(loadLoansStatus) ?
                            <ActivityIndicator size='large'/> :
                            <BooksNumberView loans={activeLoans || []}/>
                    }
                </Card>
            </DashboardSection>
        </ScrollView>
    )
};

const mapStateToProps = (state: AppState) => ({
    activeLoans: state.loans.activeLoansStatus.data,
    loadLoansStatus: state.loans.activeLoansStatus.status
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    loadActiveLoans() {
        dispatch(fetchActiveLoansAction.started())
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen)
