import React from 'react';
import ToolSelectComponent from '../tool-select-base/tool-select-base';
import messages from '../../lib/messages';
import lineIcon from './line.svg';

interface LineModeComponentProps {
    isSelected: boolean;
    onMouseDown: () => void;
}

const LineModeComponent = (props: LineModeComponentProps) => (
    <ToolSelectComponent
        imgDescriptor={messages.line}
        imgSrc={lineIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

export default LineModeComponent;
