import React, { forwardRef } from 'react';
import ReactionView from './ReactionView';
import ReactionViewModal from './ReactionViewModal';
import type { ReactionViewProps } from './types';
import { GlobalConstants } from '../../constants';

export type ReactionRefType = {
    longPressHandler: () => void;
    pressHandler: () => void;
};

const RootReaction = forwardRef<ReactionRefType, ReactionViewProps>(
    (props, ref) => {
        const { type } = props;
        return type === GlobalConstants.modal ? (
            <ReactionViewModal ref={ref} {...props} />
        ) : (
            <ReactionView ref={ref} {...props} />
        );
    }
);
RootReaction.displayName = 'RootReaction';

export default RootReaction;
