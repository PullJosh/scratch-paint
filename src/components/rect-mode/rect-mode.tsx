import React from 'react';
import ToolSelectComponent from '../tool-select-base/tool-select-base';
import messages from '../../lib/messages';
import rectIcon from './rectangle.svg';

interface RectModeComponentProps {
    isSelected: boolean;
    onMouseDown: () => void;
}

const RectModeComponent = (props: RectModeComponentProps) => (
    <ToolSelectComponent
        imgDescriptor={messages.rect}
        imgSrc={rectIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

export default RectModeComponent;
