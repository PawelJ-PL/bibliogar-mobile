import React from "react";
import {StyleSheet, View} from "react-native";
import {Book} from "../types/Book";
import * as yup from "yup";
import {Button, Input} from "react-native-elements";
import {FormikHelpers, useFormik} from "formik";
import {errorDark} from "../../../common/styles/Colors";
import OperationErrorMessageBox from "../../../common/components/messagebox/OperationErrorMessageBox";

type Props = {
    initialData?: Partial<Book>,
    submitTitle: string,
    onCancel: () => void,
    inProgress: boolean,
    onSubmit: (formData: BookFormValues) => void
    submitError: boolean
}

export type BookFormValues = {
    isbn: string
    title: string
    authors?: string | null
    cover?: string | null
}

const allowedUrlPattern = /^(?:https:\/\/books\.google\.com\/books|https:\/\/covers\.openlibrary\.org\/).*$/;
export const IsbnPattern = /^(97([89]))?\d{9}(\d|X)$/;

const formSchema = yup.object().shape({
    isbn: yup.string()
        .required('Pole wymagane')
        .matches(IsbnPattern, 'Nieprawidłowy ISBN'),
    title: yup.string()
        .trim()
        .required('Pole wymagane')
        .max(200, 'Maksymalnie ${max} znaków'),
    authors: yup.string()
        .trim()
        .max(200, 'Maksymalnie ${max} znaków'),
    cover: yup.string()
        .trim()
        .url('Nieprawidłowy URL')
        .matches(allowedUrlPattern, 'Niedozwolony URL')
});

const EditBookForm: React.FC<Props> = ({initialData, submitTitle, onCancel, inProgress, onSubmit, submitError}) => {
    const initialValues = {
        isbn: initialData?.isbn ?? '',
        title: initialData?.title ?? '',
        authors: initialData?.authors ?? undefined,
        cover: initialData?.cover ?? undefined
    };

    const setTextOrUndefined = (text: string, fieldName: string) => text ? formik.setFieldValue(fieldName, text) : formik.setFieldValue(fieldName, undefined);

    const handleSubmit = (values: BookFormValues, formikHelpers: FormikHelpers<BookFormValues>) => {
        onSubmit(values);
        formikHelpers.setSubmitting(false)
    };

    const formik = useFormik<BookFormValues>({initialValues, onSubmit: handleSubmit, validationSchema: formSchema});

    return (
        <View>
            <OperationErrorMessageBox visible={submitError}/>
            <Input
                containerStyle={styles.inputContainer}
                label='ISBN'
                onChangeText={formik.handleChange('isbn') as (text: string) => void}
                onBlur={formik.handleBlur('isbn') as (event: any) => void}
                value={formik.values.isbn}
                errorMessage={(formik.touched.isbn && formik.errors.isbn) || undefined}
            />
            <Input
                containerStyle={styles.inputContainer}
                label='Tytuł'
                onChangeText={formik.handleChange('title') as (text: string) => void}
                onBlur={formik.handleBlur('title') as (event: any) => void}
                value={formik.values.title}
                errorMessage={(formik.touched.title && formik.errors.title) || undefined}
            />
            <Input
                containerStyle={styles.inputContainer}
                label='Autorzy'
                onChangeText={text => setTextOrUndefined(text, 'authors')}
                onBlur={formik.handleBlur('authors') as (event: any) => void}
                value={formik.values.authors || ''}
                errorMessage={(formik.touched.authors && formik.errors.authors) || undefined}
            />
            <Input
                containerStyle={styles.inputContainer}
                label='Okładka (URL)'
                onChangeText={text => setTextOrUndefined(text, 'cover')}
                onBlur={formik.handleBlur('cover') as (event: any) => void}
                value={formik.values.cover || ''}
                errorMessage={(formik.touched.cover && formik.errors.cover) || undefined}
            />

            <Button
                title={submitTitle}
                onPress={formik.handleSubmit}
                disabled={!formik.isValid || formik.isSubmitting || inProgress}
                loading={inProgress}
            />
            <Button title='Anuluj' buttonStyle={styles.cancelButton} onPress={onCancel}/>
        </View>
    )
};

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 10
    },
    cancelButton: {
        backgroundColor: errorDark
    }
});

export default EditBookForm
