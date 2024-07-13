import React from 'react';
import ToolSelectComponent from '../tool-select-base/tool-select-base';
import messages from '../../lib/messages';
import lineIcon from './line.svg';

interface BitLineComponentProps {
    isSelected: boolean;
    onMouseDown: () => void;
}

const BitLineComponent = (props: BitLineComponentProps) => (
    <ToolSelectComponent
        imgDescriptor={messages.line}
        imgSrc={lineIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

export default BitLineComponent;
