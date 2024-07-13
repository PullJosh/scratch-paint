import React from 'react';
import messages from '../../lib/messages';
import ToolSelectComponent from '../tool-select-base/tool-select-base';

import reshapeIcon from './reshape.svg';

interface ReshapeModeComponentProps {
    isSelected: boolean;
    onMouseDown: () => void;
}

const ReshapeModeComponent = (props: ReshapeModeComponentProps) => (
    <ToolSelectComponent
        imgDescriptor={messages.reshape}
        imgSrc={reshapeIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

export default ReshapeModeComponent;
