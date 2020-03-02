import React, {useEffect, useState} from "react";
import Modal from "react-native-modal";
import {Card} from "react-native-elements";
import {Dimensions, ScrollView, StyleSheet, View} from "react-native";
import {Book} from "../../types/Book";
import MatchingBooksView from "./MatchingBooksView";
import IsbnForm from "./IsbnForm";
import EditBookForm, {BookFormValues} from "../EditBookForm";
import {IsbnModalViews} from "./IsbnModalViews";
import {AppState} from "../../../../common/store";
import {Dispatch} from "redux";
import {createBookAction, resetCreateBookStatusAction} from "../../store/Actions";
import {connect} from "react-redux";
import {OperationStatus} from "../../../../common/store/async/AsyncOperationResult";

type Props = {
    visible: boolean
    onClose: () => void
    onFinish: (book: Book) => void
} & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

const BooksFinderModal: React.FC<Props> = ({visible, onClose, onFinish, cleanupStatus, createBookResult, createBookStatus, createBook}) => {
    const [isbn, setIsbn] = useState('');
    const [scannerEnabled, setScannerEnabled] = useState(false);
    const [viewWithIsbn, setViewWithIsbn] = useState(IsbnModalViews.FindResult);
    const [bookToEdit, setBookToEdit] = useState<Book | null>(null);

    useEffect(() => {
        if (createBookStatus === OperationStatus.FINISHED && createBookResult !== undefined) {
            onFinish(createBookResult);
            onClose()
        }
    }, [createBookStatus, createBookResult]);

    const selectBook = (book: Book) => {
        onFinish(book);
        onClose()
    };

    const beforeShow = () => {
        setScannerEnabled(true);
    };

    const onHide = () => {
        cleanupStatus();
        setIsbn('');
        setBookToEdit(null);
        setViewWithIsbn(IsbnModalViews.FindResult);
        setScannerEnabled(false);
    };

    const renderWithIsbn = () => {
        if (bookToEdit !== null) {
            return <EditBookForm
                initialData={bookToEdit}
                submitTitle='Zmień'
                onCancel={() => {
                    setViewWithIsbn(IsbnModalViews.FindResult);
                    setBookToEdit(null)
                }
                }
                inProgress={createBookStatus === OperationStatus.PENDING}
                onSubmit={(formData: BookFormValues) => createBook(formData)}
                submitError={createBookStatus === OperationStatus.FAILED}
            />
        }
        switch (viewWithIsbn) {
            case IsbnModalViews.FindResult:
                return <MatchingBooksView
                    isbn={isbn}
                    onSelect={selectBook}
                    switchView={setViewWithIsbn}
                    setEditingBook={(book: Book) => setBookToEdit(book)}
                />;
            case IsbnModalViews.NewDescription:
                return <EditBookForm
                    initialData={{isbn}}
                    submitTitle={'Stwórz'}
                    onCancel={() => setViewWithIsbn(IsbnModalViews.FindResult)}
                    inProgress={createBookStatus === OperationStatus.PENDING}
                    onSubmit={(formData: BookFormValues) => createBook(formData)}
                    submitError={createBookStatus === OperationStatus.FAILED}
                />;
            default:
                return null;
        }
    };

    return (
        <Modal
            onBackButtonPress={onClose}
            onBackdropPress={onClose}
            isVisible={visible}
            onModalWillShow={beforeShow}
            onModalHide={onHide}
        >
            <View style={styles.contentContainer}>
                <Card containerStyle={styles.cardContainer}>
                    <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                        {isbn ?
                            renderWithIsbn() :
                            <IsbnForm onSubmit={setIsbn} scannerEnabled={scannerEnabled}/>}
                    </ScrollView>
                </Card>
            </View>
        </Modal>
    )
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        marginTop: 10
    },
    cardContainer: {
        height: Dimensions.get('window').height * 0.7
    }
});

const mapStateToProps = (state: AppState) => ({
    createBookResult: state.books.createBookStatus.data,
    createBookStatus: state.books.createBookStatus.status
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    cleanupStatus() {
        dispatch(resetCreateBookStatusAction());
    },
    createBook(bookData: BookFormValues) {
        dispatch(createBookAction.started(bookData))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(BooksFinderModal)
