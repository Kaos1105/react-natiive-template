import * as yup from 'yup';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { t } from 'i18next';
import { RepairDetails } from '@/types/pages/repairHistory';

dayjs.extend(isSameOrBefore);

yup.setLocale({
    mixed: {
        required: () => t('validation.required')
    },
    number: {
        min: (value) => t('validation.min_number', { length: value.min }),
        max: (value) => t('validation.max_number', { length: value.max }),
        positive: () => t('validation.non_negative')
    },
    string: {
        min: (value) => t('validation.min_string', { length: value.min }),
        max: (value) => t('validation.max_string', { length: value.max }),
        email: () => t('validation.email'),
        url: () => t('validation.url')
    }
});

yup.addMethod(yup.string, 'isHiragana', function isHiragana() {
    return this.test((value, testContext) => {
        if (!value?.match(/[\u3040-\u309f]/))
            return testContext.createError({
                path: testContext.path,
                message:
                    'よみがなはひらがな、もしくは全角英数字で入力してください'
            });
        return true;
    });
});

yup.addMethod(yup.string, 'nullableMin', function isHiragana(min: number) {
    return this.test((value, testContext) => {
        if (value) {
            const numericValue = parseFloat(value) < min;
            if (numericValue)
                return testContext.createError({
                    path: testContext.path,
                    message: t('validation.min_number', {
                        length: min
                    })
                });
        }
        return true;
    });
});

yup.addMethod(yup.string, 'nullableMax', function isHiragana(max: number) {
    return this.test((value, testContext) => {
        if (value) {
            const numericValue = parseFloat(value) > max;
            if (numericValue)
                return testContext.createError({
                    path: testContext.path,
                    message: t('validation.max_number', {
                        length: max
                    })
                });
        }
        return true;
    });
});

yup.addMethod(yup.string, 'nullableMin', function isHiragana(min: number) {
    return this.test((value, testContext) => {
        if (value) {
            const numericValue = parseFloat(value) < 50;
            if (numericValue)
                return testContext.createError({
                    path: testContext.path,
                    message: t('validation.min_number', {
                        length: min
                    })
                });
        }
        return true;
    });
});

yup.addMethod(yup.string, 'phone', function isPhone() {
    const rePhoneNumber =
        /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

    return this.test((value, testContext) => {
        if (value && !rePhoneNumber.test(value))
            return testContext.createError({
                path: testContext.path,
                message: '電話番号が無効です'
            });
        return true;
    });
});

yup.addMethod(
    yup.date,
    'isDateBefore',
    function isDateBefore(otherDateKey: string) {
        return this.test((value, testContext) => {
            if (
                !testContext.parent[otherDateKey] ||
                !value ||
                !dayjs(testContext.parent[otherDateKey]).isSameOrBefore(value)
            ) {
                return true;
            } else
                return testContext.createError({
                    path: testContext.path,
                    message: t('validation.must_be_before')
                });
        });
    }
);

yup.addMethod(
    yup.date,
    'isDateAfter',
    function isDateAfter(otherDateKey: string) {
        return this.test((value, testContext) => {
            if (!value) return true;
            if (value) {
                if (!testContext.parent[otherDateKey]) {
                    return true;
                }
                if (!dayjs(value).isAfter(testContext.parent[otherDateKey])) {
                    return testContext.createError({
                        path: testContext.path,
                        message: t('validation.must_be_after')
                    });
                }
                return true;
            }
        });
    }
);

yup.addMethod(yup.mixed, 'isValidRepairDetail', function isCheckRepairData() {
    return this.test((value, testContext) => {
        const item = value as RepairDetails;

        if (!item.repairDate && item.repairRemark) {
            return testContext.createError({
                path: testContext.path,
                message: t('validation.required')
            });
        }

        return true;
    });
});

export default yup;
