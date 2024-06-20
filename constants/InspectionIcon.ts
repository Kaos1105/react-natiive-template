import DisplayNoneIcon from '../assets/svgs/display_ana1.svg';
import SelectNoneIcon from '../assets/svgs/select_ana1.svg';
import DisplaySmallIcon from '../assets/svgs/display_ana2.svg';
import SelectSmallIcon from '../assets/svgs/select_ana2.svg';
import DisplayMediumIcon from '../assets/svgs/display_ana3.svg';
import SelectMediumIcon from '../assets/svgs/select_ana3.svg';
import DisplayLargeIcon from '../assets/svgs/display_ana4.svg';
import SelectLargeIcon from '../assets/svgs/select_ana4.svg';
import DisplayExtraLargeIcon from '../assets/svgs/display_ana5.svg';
import SelectExtraLargeIcon from '../assets/svgs/select_ana5.svg';
import { SvgProps } from 'react-native-svg';
import { FC } from 'react';

export type IGapImage = {
    displayIcon: FC<SvgProps>;
    selectIcon: FC<SvgProps>;
};

export type InspectionIconType = {
    NONE: IGapImage;
    SMALL: IGapImage;
    MEDIUM: IGapImage;
    LARGE: IGapImage;
    EXTRA_LARGE: IGapImage;
    UNKNOWN: IGapImage;
};

const InspectionIcon: InspectionIconType = {
    NONE: {
        displayIcon: DisplayNoneIcon,
        selectIcon: SelectNoneIcon
    },
    SMALL: {
        displayIcon: DisplaySmallIcon,
        selectIcon: SelectSmallIcon
    },
    MEDIUM: {
        displayIcon: DisplayMediumIcon,
        selectIcon: SelectMediumIcon
    },
    LARGE: {
        displayIcon: DisplayLargeIcon,
        selectIcon: SelectLargeIcon
    },
    EXTRA_LARGE: {
        displayIcon: DisplayExtraLargeIcon,
        selectIcon: SelectExtraLargeIcon
    },
    UNKNOWN: {
        displayIcon: DisplayExtraLargeIcon,
        selectIcon: SelectExtraLargeIcon
    }
};

export { InspectionIcon };
