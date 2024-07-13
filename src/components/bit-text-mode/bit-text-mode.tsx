import React from 'react';
import ToolSelectComponent from '../tool-select-base/tool-select-base';
import messages from '../../lib/messages';
import textIcon from './text.svg';

interface BitTextComponentProps {
    isSelected: boolean;
    onMouseDown: () => void;
}

const BitTextComponent = (props: BitTextComponentProps) => (
    <ToolSelectComponent
        imgDescriptor={messages.text}
        imgSrc={textIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

export default BitTextComponent;
