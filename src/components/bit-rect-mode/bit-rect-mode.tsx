import React from 'react';
import ToolSelectComponent from '../tool-select-base/tool-select-base';
import messages from '../../lib/messages';
import rectIcon from './rectangle.svg';

interface BitRectComponentProps {
    isSelected: boolean;
    onMouseDown: () => void;
}

const BitRectComponent = (props: BitRectComponentProps) => (
    <ToolSelectComponent
        imgDescriptor={messages.rect}
        imgSrc={rectIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

export default BitRectComponent;
