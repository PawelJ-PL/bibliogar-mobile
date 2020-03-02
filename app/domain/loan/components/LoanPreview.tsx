import React, {useEffect, useState} from "react";
import {Button, Card, ListItem} from "react-native-elements";
import {Loan} from "../types/Loan";
import {Library} from "../../library/types/Library";
import {ActivityIndicator, ScrollView, StyleSheet, View} from "react-native";
import {brand} from "../../../common/styles/Colors";
import {AppState} from "../../../common/store";
import {Dispatch} from "redux";
import {fetchMultipleBooksDetailsAction} from "../../book/store/Actions";
import {connect} from "react-redux";
import {OperationStatus} from "../../../common/store/async/AsyncOperationResult";
import OperationErrorMessageBox from "../../../common/components/messagebox/OperationErrorMessageBox";
import Collapsible from "react-native-collapsible";
import {useModal} from "../../../common/components/modals/ModalHook";
import Confirmation from "../../../common/components/modals/Confirmation";
import {useNavigation} from "@react-navigation/native";
import {finishLoanAction} from "../store/Actions";
import BookListItem from "../../book/components/BookListItem";

type Props = {
    loan: Loan
    library?: Library
} & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

const LoanPreview: React.FC<Props> = ({loan, library, fetchBooksDetails, lastFetchedBooks, lastRequestedBooks, bookDetailsFetchStatus, finishLoan}) => {
    const bookIds = [...new Set(loan.books.filter((bookId: string | null): bookId is string => bookId !== null))];
    const hasActualBooks = (lastFetchedBooks !== undefined && bookIds.every(x => (lastRequestedBooks || []).includes(x)));

    useEffect(() => {
        if (!hasActualBooks && bookDetailsFetchStatus !== OperationStatus.PENDING) {
            fetchBooksDetails(bookIds);
        }
    }, []);

    const [booksCollapsed, setBooksCollapsed] = useState(true);

    const navigation = useNavigation();

    const onReturn = () => {
        navigation.goBack();
        finishLoan(loan.id)
    };

    const [returnConfirmation, showReturnConfirmation] = useModal(Confirmation, {
        content: 'Czy zakończyć bieżące wypożyczenie?',
        onConfirm: onReturn
    });

    const renderBookItem = (bookId: string | null, key: number) => {
        const book = lastFetchedBooks?.find(b => b !== null && b.id === bookId);
        return <BookListItem book={book || null} key={key} />
    };

    return (
        <Card>
            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                <ListItem title='Szczegóły wypożyczenia' titleStyle={styles.header} bottomDivider={true}/>
                <ListItem
                    title={library?.name || ''}
                    subtitle='Biblioteka'
                    bottomDivider={true}
                    leftIcon={{name: 'book', type: 'entypo'}}
                />
                <ListItem
                    title={loan.returnTo.fromNow() + ` (${loan.returnTo.format('dddd, D MMMM YYYY')})`}
                    subtitle='Termin zwrotu'
                    leftIcon={{name: 'calendar', type: 'antdesign'}}
                />
                <View>
                    <ListItem
                        title={`Wypożyczone książki (${loan.books.length})`}
                        titleStyle={styles.header}
                        bottomDivider={true}
                        chevron={{type: 'entypo', name: booksCollapsed ? 'chevron-down' : 'chevron-up'}}
                        onPress={() => setBooksCollapsed(prev => !prev)}
                    />
                    <Collapsible collapsed={booksCollapsed}>
                        <View>
                            <OperationErrorMessageBox visible={bookDetailsFetchStatus === OperationStatus.FAILED}/>
                            {hasActualBooks ?
                                loan.books.map((bookId, idx) => renderBookItem(bookId, idx)) :
                                <ActivityIndicator/>
                            }
                        </View>
                    </Collapsible>
                </View>
                {returnConfirmation}
                <Button title='Edytuj' onPress={() => navigation.navigate('modifyLoanScreen', {loanId: loan.id})} />
                <Button title='Zwróć' onPress={showReturnConfirmation}/>
            </ScrollView>
        </Card>
    )
};

const styles = StyleSheet.create({
    header: {
        color: brand,
        fontWeight: 'bold'
    },
    cover: {
        width: 60,
        height: 90
    }
});

const mapStateToProps = (state: AppState) => {
    return {
        lastFetchedBooks: state.books.lastFetchedBooks.data,
        lastRequestedBooks: state.books.lastFetchedBooks.params,
        bookDetailsFetchStatus: state.books.lastFetchedBooks.status
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        fetchBooksDetails(bookIds: string[]) {
            dispatch(fetchMultipleBooksDetailsAction.started(bookIds))
        },
        finishLoan(loanId: string) {
            dispatch(finishLoanAction.started(loanId))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(LoanPreview)
