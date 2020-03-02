import React, {useEffect} from "react";
import {ActivityIndicator, View} from "react-native";
import {AppState} from "../../../../common/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {fetchIsbnSuggestionsAction} from "../../store/Actions";
import {OperationStatus} from "../../../../common/store/async/AsyncOperationResult";
import OperationErrorMessageBox from "../../../../common/components/messagebox/OperationErrorMessageBox";
import BookListItem from "../BookListItem";
import {Book} from "../../types/Book";
import MessageBox from "../../../../common/components/messagebox/MessageBox";
import {Button} from "react-native-elements";
import {IsbnModalViews} from "./IsbnModalViews";

type Props = {
    isbn: string,
    onSelect: (book: Book) => void,
    switchView: (name: IsbnModalViews) => void,
    setEditingBook: (book: Book) => void
} & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

const MatchingBooksView: React.FC<Props> = ({isbn, suggestionsFetchStatus, lastRequestedIsbn, getSuggestionsForIsbn, suggestionsResult, onSelect, switchView, setEditingBook}) => {
    useEffect(() => {
        if ((suggestionsFetchStatus !== OperationStatus.PENDING) && (lastRequestedIsbn !== isbn || suggestionsFetchStatus !== OperationStatus.FINISHED)) {
            getSuggestionsForIsbn(isbn)
        }
    }, []);

    const fetchFinished = suggestionsFetchStatus === OperationStatus.FINISHED && lastRequestedIsbn === isbn;

    const renderBookItem = (book: Book, idx: number) => {
        const editIcon = {
            name: 'edit',
            type: 'font-awesome',
            onPress: () => setEditingBook(book),
            size: 30
        };
        return <BookListItem book={book} key={idx} rightIcon={editIcon} onPress={() => onSelect(book)}/>
    };

    return (
        <View>
            <OperationErrorMessageBox
                visible={lastRequestedIsbn === isbn && suggestionsFetchStatus === OperationStatus.FAILED}
            />
            {fetchFinished && !Boolean(suggestionsResult?.length) && <MessageBox visible={true} message='Nie znaleziono pasujących pozycji' type='info'/>}
            {suggestionsFetchStatus === OperationStatus.PENDING && <ActivityIndicator size="large"/>}
            <Button title='Dodaj własny opis' disabled={suggestionsFetchStatus === OperationStatus.PENDING} onPress={() => switchView(IsbnModalViews.NewDescription)}/>
            {fetchFinished && suggestionsResult?.map((book, idx) => renderBookItem(book, idx))}
        </View>
    )
};

const mapStateToProps = (state: AppState) => ({
    lastRequestedIsbn: state.books.lastFetchedIsbnSuggestions.params,
    suggestionsFetchStatus: state.books.lastFetchedIsbnSuggestions.status,
    suggestionsResult: state.books.lastFetchedIsbnSuggestions.data
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    getSuggestionsForIsbn(isbn: string) {
        dispatch(fetchIsbnSuggestionsAction.started(isbn))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchingBooksView)
