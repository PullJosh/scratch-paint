import React from 'react';
import messages from '../../lib/messages';
import ToolSelectComponent from '../tool-select-base/tool-select-base';

import eraserIcon from './eraser.svg';

interface BitEraserComponentProps {
    isSelected: boolean;
    onMouseDown: () => void;
}

const BitEraserComponent = (props: BitEraserComponentProps) => (
    <ToolSelectComponent
        imgDescriptor={messages.eraser}
        imgSrc={eraserIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

export default BitEraserComponent;
