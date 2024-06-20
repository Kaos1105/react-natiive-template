import { Dayjs } from 'dayjs';
import type { FormikErrors, FormikProps } from 'formik/dist/types';

export type TimeStamps = {
  date: Date | string | Dayjs;
  name: string;
};

export interface IFormikError<T = any> {
  error?: FormikErrors<T>[] | string | string[] | FormikErrors<T>;
}

export type FileContent = {
  fileContent?: File | null;
  fileName: string;
  filePath?: string;
  urlFilePath?: string;
};

export type useFormikType<T extends Record<string, unknown>> = {
  formik: FormikProps<T>;
  handleChange: (prop: keyof T, value: T[keyof T]) => Promise<T[keyof T]>;
  handleBlur: (prop: keyof T) => void;
};

export type DetailContent = string | number | readonly string[] | null;
export type InputContent = string | number | readonly string[] | null;

export type FormErrors = {
  errors: Partial<Record<string, string>>;
};

export interface ServerError {
  statusCode: number;
  message: string;
  details: string;
}
