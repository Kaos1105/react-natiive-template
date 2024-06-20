import * as yup from 'yup';
import { Dayjs } from 'dayjs';

declare module 'yup' {
  interface StringSchema<TType, TContext, TDefault, TFlags> {
    maxEditor(length: number): this;

    nullableMin(min: number): this;

    nullableMax(max: number): this;
  }

  interface DateSchema<TType, TContext, TDefault, TFlags> {
    isDateBefore(otherDate: string): this;

    isSameOrBefore(otherDate: string): this;

    requiredIfNotNull(otherDate: string): this;

    isDateAfter(otherDate: string): this;

    isDateAfter(otherDate: Dayjs): this;
  }

  interface MixedSchema<TType, TContext, TDefault, TFlags> {
    isValidRepairDetail(): this;
  }

  //
  // interface ArraySchema<TIn, TContext> {
  //     isCheckRepairData(): this;
  // }
}

export default yup;
