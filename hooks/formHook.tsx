import { ObjectSchema } from "yup";
import { FormikHelpers, FormikProps, FormikValues, useFormik } from "formik";
import { AxiosResponse } from "axios";
import { FormErrors } from "@/types/common/common";

interface FormProp<T extends Record<string, unknown>> {
    initialValue: T;
    validationSchema: ObjectSchema<any>;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
}

export function useCustomForm<T extends Record<string, unknown>>(
    props: FormProp<T>
) {
    const formik: FormikProps<T> = useFormik<T>({
        initialValues: props.initialValue,
        validateOnChange: props.validateOnChange || false,
        validateOnBlur: props.validateOnBlur || false,
        validationSchema: props.validationSchema,
        onSubmit: async (_values: T, _formikHelpers: FormikHelpers<T>) => {}
    });

    const handleChange = async (
        prop: keyof T,
        value: T[keyof T]
    ): Promise<T[keyof T]> => {
        await formik.setFieldValue(prop as string, value);
        return Promise.resolve(value);
    };

    const handleBlur = (prop: keyof T) => {
        formik.validateField(prop as string);
    };

    return { formik, handleChange, handleBlur };
}

export function handleValidationErrs<T>(
    result: AxiosResponse<FormErrors, any>,
    formikHelpers: FormikHelpers<T>,
    values: FormikValues
) {
    for (const key in result.data.errors) {
        if (key in values) {
            formikHelpers.setFieldError(key, result.data.errors[key]);
        } else {
            console.log(result.data.errors[key]);
        }
    }
}
