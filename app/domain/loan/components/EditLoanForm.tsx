import React, { useState } from "react"
import { Picker, View, Text, StyleSheet, ScrollView } from "react-native"
import { Library } from "../../library/types/Library"
import { Button, Card, Divider, Input } from "react-native-elements"
import CommonStyles from "../../../common/styles/CommonStyles"
import { Book } from "../../book/types/Book"
import BookListItem from "../../book/components/BookListItem"
import { useModal } from "../../../common/components/modals/ModalHook"
import Confirmation from "../../../common/components/modals/Confirmation"
import OperationErrorMessageBox from "../../../common/components/messagebox/OperationErrorMessageBox"
import BooksFinderModal from "../../book/components/books_finder/BooksFinderModal"
import { errorDark } from "../../../common/styles/Colors"
import { Moment } from "moment"
import moment from "moment"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { EditLoanReq } from "../api/LoansApi"

export type ModifyLoanInitialData = Omit<EditLoanReq, "libraryId" | "books"> & {
    libraryId: string | null
    books: Array<Book | null>
}
export type ModifyLoanData =
    | { library: Library; books: Array<Book | null>; type: "CREATE" }
    | (Omit<ModifyLoanInitialData, "libraryId"> & { library: Library; type: "UPDATE" })

type Props = {
    initialData?: ModifyLoanInitialData
    availableLibraries: Library[]
    onSubmit: (data: ModifyLoanData) => void
    submitError: boolean
    processingSubmit: boolean
}

const EditLoanForm: React.FC<Props> = ({
    availableLibraries,
    onSubmit,
    submitError,
    processingSubmit,
    initialData,
}) => {
    const selectCurrentLibrary = () => {
        if (availableLibraries.length < 1) {
            return undefined
        }
        const initialLib = availableLibraries.find((l) => l.id === initialData?.libraryId)
        return initialLib ? initialLib : availableLibraries[0]
    }

    const [currentLibrary, setCurrentLibrary] = useState(selectCurrentLibrary())
    const [books, setBooks] = useState<Array<Book | null>>(initialData?.books || [])
    const [returnTo, setReturnTo] = useState<Moment | null>(initialData?.returnTo || null)
    const [returnToModalVisible, setReturnToModalVisible] = useState(false)
    const [booksFinderVisible, setBooksFinderVisible] = useState(false)

    const [confirmOverrun, showConfirmOverrun] = useModal(Confirmation, {
        content: "Przekroczono limit wypożyczeń. Kontynuować?",
        onConfirm: () => finishEdition(),
    })

    const removeBook = (index: number) => setBooks((prev) => prev.filter((_, i) => i !== index))

    const canSubmit = Boolean(currentLibrary) && books.length > 0 && !processingSubmit

    const submit = () => {
        if (currentLibrary?.booksLimit && currentLibrary.booksLimit < books.length) {
            showConfirmOverrun()
        } else {
            finishEdition()
        }
    }

    const finishEdition = () => {
        if (!currentLibrary) {
            return
        } else if (currentLibrary?.id && initialData?.loanId) {
            onSubmit({
                loanId: initialData.loanId,
                books,
                library: currentLibrary,
                returnedAt: initialData.returnedAt,
                returnTo: returnTo || moment(),
                type: "UPDATE",
            })
        } else {
            onSubmit({ library: currentLibrary, books, type: "CREATE" })
        }
    }

    const renderBookItem = (book: Book | null, idx: number) => {
        const removeIcon = {
            name: "remove",
            type: "font-awesome",
            onPress: () => removeBook(idx),
            size: 18,
            color: errorDark,
        }
        return <BookListItem book={book} key={idx} rightIcon={removeIcon} />
    }

    const renderReturnToSection = (date: Moment) => (
        <View>
            <DateTimePickerModal
                onConfirm={(d) => {
                    setReturnToModalVisible(false)
                    const now = moment()
                    const currentHours = now.hours()
                    const currentMinutes = now.minutes()
                    const updatedMoment = moment(d).clone().add(currentHours, "hours").add(currentMinutes, "minutes")
                    setReturnTo(updatedMoment)
                }}
                onCancel={() => setReturnToModalVisible(false)}
                isVisible={returnToModalVisible}
                mode="date"
                date={date.clone().startOf("date").toDate()}
            />
            <Text style={CommonStyles.inputLabel}>Termin zwrotu</Text>
            <Input
                value={date.format("dddd, D MMMM YYYY").toString()}
                rightIcon={{ type: "antdesign", name: "calendar", onPress: () => setReturnToModalVisible(true) }}
            />
        </View>
    )

    return (
        <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
            <BooksFinderModal
                visible={booksFinderVisible}
                onClose={() => setBooksFinderVisible(false)}
                onFinish={(book: Book) => setBooks((prev) => [...prev, book])}
            />
            {confirmOverrun}
            <OperationErrorMessageBox visible={submitError} />
            <Card>
                <View style={styles.sectionContainer}>
                    <Text style={CommonStyles.inputLabel}>Biblioteka</Text>
                    <Picker
                        mode="dropdown"
                        selectedValue={currentLibrary?.id}
                        onValueChange={(value) => {
                            setCurrentLibrary(availableLibraries.find((l) => l.id === value) || undefined)
                        }}
                    >
                        {availableLibraries.map((lib) => (
                            <Picker.Item label={lib.name} value={lib.id} key={lib.id} />
                        ))}
                    </Picker>
                    <Divider />
                </View>
                {returnTo && renderReturnToSection(returnTo)}
                <View style={styles.sectionContainer}>
                    <Text style={CommonStyles.inputLabel}>Książki</Text>
                    <View style={styles.addButtonsContainer}>
                        <Button
                            title="Znajdź opis i dodaj"
                            containerStyle={styles.addBookButtonContainer}
                            titleStyle={styles.addBookButtonTitle}
                            onPress={() => setBooksFinderVisible(true)}
                        />
                        <View style={styles.addBookSeparator} />
                        <Button
                            title="Dodaj bez opisu"
                            containerStyle={styles.addBookButtonContainer}
                            titleStyle={styles.addBookButtonTitle}
                            onPress={() => setBooks((prev) => [...prev, null])}
                        />
                    </View>
                    <View>{books.map((book, idx) => renderBookItem(book, idx))}</View>
                </View>
                <Button title="Zapisz" disabled={!canSubmit} onPress={submit} loading={processingSubmit} />
            </Card>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginVertical: 10,
    },
    addButtonsContainer: {
        flexDirection: "row",
    },
    addBookButtonContainer: {
        flex: 2,
    },
    addBookButtonTitle: {
        fontSize: 12,
    },
    addBookSeparator: {
        flex: 1,
    },
})

export default EditLoanForm
