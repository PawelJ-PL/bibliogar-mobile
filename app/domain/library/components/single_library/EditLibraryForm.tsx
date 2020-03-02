import React, {useState} from "react";
import {Picker, StyleSheet, Text, View} from "react-native";
import {Library, LoanDurationUnit} from "../../types/Library";
import {FormikHelpers, useFormik} from "formik";
import * as yup from "yup";
import {Button, CheckBox, Input, withTheme} from "react-native-elements";
import CommonStyles from "../../../../common/styles/CommonStyles";

type Props = {
    initialData?: Library
    submitTitle: string
    onSubmit: (data: LibraryFormValues) => void
    inProgress: boolean
}

export type LibraryFormValues = {
    name: string,
    loanDurationValue: number,
    loanDurationUnit: LoanDurationUnit,
    booksLimit?: number | null
}

const formSchema = yup.object().shape({
    name: yup.string()
        .trim()
        .required('Pole wymagane')
        .max(60, 'Maksymalnie ${max} znaków'),
    loanDurationValue: yup.number()
        .required('Pole wymagane')
        .integer("Wymagana liczba całkowita")
        .min(1, "Minimum 1")
        .max(7300, 'Maksymalnie 7300'),
    loanDurationUnit: yup.string()
        .required('Pole wymagane')
        .oneOf(Object.keys(LoanDurationUnit)),
    booksLimit: yup
        .number()
        .min(1, "Minimum 1")
});

const EditLibraryForm: React.FC<Props> = ({initialData, submitTitle, onSubmit, inProgress}) => {
    const [lastLimit, setLastLimit] = useState(initialData?.booksLimit);
    const [limitEnabled, setLimitEnabled] = useState(Boolean(initialData?.booksLimit));

    const initialValues = {
        name: initialData?.name ?? '',
        loanDurationValue: initialData?.loanDurationValue ?? 1,
        loanDurationUnit: initialData?.loanDurationUnit ?? LoanDurationUnit.Month,
        booksLimit: initialData?.booksLimit ?? undefined
    };

    const handleSubmit = (values: LibraryFormValues, formikHelpers: FormikHelpers<LibraryFormValues>) => {
        onSubmit(values);
        formikHelpers.setSubmitting(false)
    };

    const formik = useFormik<LibraryFormValues>({initialValues, onSubmit: handleSubmit, validationSchema: formSchema});

    const renderUnitItem = (item: string) => (<Picker.Item label={generateUnitName(item)} value={item} key={item}/>);

    const generateUnitName = (unit: string) => {
        switch (unit) {
            case 'Day':
                return 'dni';
            case 'Week':
                return 'tygodni';
            case 'Month':
                return 'miesięcy';
            case 'Year':
                return 'lat';
            default:
                return ''
        }
    };

    const handleNumericInputChange = (value: string, name: string) => {
        const numeric = Number.parseInt(value, 10);
        if (numeric.toString() === value || value === '') {
            const v = Number.isNaN(numeric) ? undefined : numeric;
            formik.setFieldValue(name, v, true);
            return true
        } else {
            return false
        }
    };

    const handleLimitSwitch = () => {
        if (limitEnabled) {
            setLimitEnabled(false);
            setLastLimit(formik.values.booksLimit);
            formik.setFieldValue('booksLimit', undefined, true)
        } else {
            (formik.handleChange('booksLimit') as (text: string) => void)(lastLimit?.toString() || '1');
            formik.setFieldValue('booksLimit', 1, true);
            setLimitEnabled(true)
        }
    };

    const handleLimitChange = (value: string) => {
        if(handleNumericInputChange(value, 'booksLimit')) {
            setLastLimit(Number.parseInt(value, 10))
        }
    };

    return (
        <View>
            <Input
                placeholder='Nazwa'
                label='Nazwa biblioteki'
                onChangeText={formik.handleChange('name') as (text: string) => void}
                onBlur={formik.handleBlur('name') as (event: any) => void}
                value={formik.values.name}
                errorMessage={(formik.touched.name && formik.errors.name) || undefined}
            />
            <View style={styles.sectionContainer}>
                <Input
                    labelStyle={styles.durationLabel}
                    containerStyle={styles.durationValueContainer}
                    label='Czas trwania wypożyczenia'
                    keyboardType='number-pad'
                    onChangeText={value => handleNumericInputChange(value, 'loanDurationValue')}
                    onBlur={formik.handleBlur('loanDurationValue') as (event: any) => void}
                    value={formik.values.loanDurationValue === undefined ? '' : formik.values.loanDurationValue.toString()}
                    errorMessage={(formik.touched.loanDurationValue && formik.errors.loanDurationValue) || undefined}
                />
                <Picker
                    style={styles.durationUnitPicker}
                    selectedValue={formik.values.loanDurationUnit}
                    onValueChange={(value: string) => {
                        if (value in LoanDurationUnit) {
                            const unit = LoanDurationUnit[value as keyof typeof LoanDurationUnit];
                            formik.setFieldValue('loanDurationUnit', unit, true);
                        }
                    }}
                >
                    {Object.keys(LoanDurationUnit).map(renderUnitItem)}
                </Picker>
            </View>
            <View style={styles.limitOuterContainer}>
                <Text style={CommonStyles.inputLabel}>Limit ilości książek</Text>
                <View style={styles.sectionContainer}>
                    <CheckBox
                        checked={limitEnabled}
                        onPress={handleLimitSwitch}
                    />
                    {limitEnabled && <Input
                        containerStyle={styles.limitInputContainer}
                        keyboardType='number-pad'
                        onChangeText={handleLimitChange}
                        onBlur={formik.handleBlur('booksLimit') as (event: any) => void}
                        value={Boolean(formik.values.booksLimit) ? formik.values.booksLimit?.toString() : ''}
                        errorMessage={(formik.touched.booksLimit && formik.errors.booksLimit) || undefined}
                    />}
                </View>
            </View>
            <Button
                title={submitTitle}
                onPress={formik.handleSubmit}
                disabled={!formik.dirty || !formik.isValid || formik.isSubmitting || inProgress}
                loading={inProgress}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    sectionContainer: {
        flexDirection: 'row'
    },
    durationUnitPicker: {
        flex: 2,
        alignSelf: 'flex-end'
    },
    durationLabel: {
        width: 300
    },
    durationValueContainer: {
        flex: 1
    },
    limitOuterContainer: {
        paddingHorizontal: 10,
        paddingTop: 5
    },
    limitInputContainer: {
        flex: 1
    }
});

export default withTheme(EditLibraryForm)
