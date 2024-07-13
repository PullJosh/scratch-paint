import React from 'react';
import ToolSelectComponent from '../tool-select-base/tool-select-base';
import messages from '../../lib/messages';
import eraserIcon from './eraser.svg';

interface EraserModeComponentProps {
    isSelected: boolean;
    onMouseDown: () => void;
}

const EraserModeComponent = (props: EraserModeComponentProps) => (
    <ToolSelectComponent
        imgDescriptor={messages.eraser}
        imgSrc={eraserIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

export default EraserModeComponent;
