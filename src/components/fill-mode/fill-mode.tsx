import React from 'react';
import ToolSelectComponent from '../tool-select-base/tool-select-base';
import messages from '../../lib/messages';
import fillIcon from './fill.svg';

interface FillModeComponentProps {
    isSelected: boolean;
    onMouseDown: () => void;
}

const FillModeComponent = (props: FillModeComponentProps) => (
    <ToolSelectComponent
        imgDescriptor={messages.fill}
        imgSrc={fillIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

export default FillModeComponent;
