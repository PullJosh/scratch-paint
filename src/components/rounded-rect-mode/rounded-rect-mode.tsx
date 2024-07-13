import React from 'react';
import messages from '../../lib/messages';
import ToolSelectComponent from '../tool-select-base/tool-select-base';

import roundedRectIcon from './rounded-rectangle.svg';

interface RoundedRectModeComponentProps {
    isSelected: boolean;
    onMouseDown: () => void;
}

const RoundedRectModeComponent = (props: RoundedRectModeComponentProps) => (
    <ToolSelectComponent
        imgDescriptor={messages.roundedRect}
        imgSrc={roundedRectIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

export default RoundedRectModeComponent;
