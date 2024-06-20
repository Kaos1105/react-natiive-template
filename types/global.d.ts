import { Params } from 'react-router-dom';
import { ReactNode } from 'react';

declare function useParams<K extends string = string>(): Readonly<Params<K>>;

export type ReactionItem = {
    id: number;
    emoji: ReactNode | string;
    title: string;
};

export type FormDataConvertible =
    | Array<FormDataConvertible>
    | {
          [key: string]: FormDataConvertible;
      }
    | Blob
    | FormDataEntryValue
    | Date
    | boolean
    | number
    | null
    | undefined;
export type RequestPayload =
    | Record<string, FormDataConvertible>
    | FormData
    | URLSearchParams;
