import React from 'react';
import messages from '../../lib/messages';
import ToolSelectComponent from '../tool-select-base/tool-select-base';

import textIcon from './text.svg';

interface TextModeComponentProps {
    isSelected: boolean;
    onMouseDown: () => void;
}

const TextModeComponent = (props: TextModeComponentProps) => (
    <ToolSelectComponent
        imgDescriptor={messages.text}
        imgSrc={textIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

export default TextModeComponent;
