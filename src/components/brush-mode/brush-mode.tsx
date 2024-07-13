import React from 'react';
import ToolSelectComponent from '../tool-select-base/tool-select-base';
import messages from '../../lib/messages';
import brushIcon from './brush.svg';

interface BrushModeComponentProps {
    isSelected: boolean;
    onMouseDown: () => void;
}

const BrushModeComponent = (props: BrushModeComponentProps) => (
    <ToolSelectComponent
        imgDescriptor={messages.brush}
        imgSrc={brushIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

export default BrushModeComponent;
