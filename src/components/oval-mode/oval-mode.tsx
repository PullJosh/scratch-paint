import React from 'react';
import ToolSelectComponent from '../tool-select-base/tool-select-base';
import messages from '../../lib/messages';
import ovalIcon from './oval.svg';

interface OvalModeComponentProps {
    isSelected: boolean;
    onMouseDown: () => void;
}

const OvalModeComponent = (props: OvalModeComponentProps) => (
    <ToolSelectComponent
        imgDescriptor={messages.oval}
        imgSrc={ovalIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

export default OvalModeComponent;
