import React from 'react';

import Input from './forms/input';
import InputGroup from './input-group/input-group';
import LiveInputHOC from './forms/live-input-hoc';

import {MAX_STROKE_WIDTH} from '../reducers/stroke-width';

interface StrokeWidthIndicatorComponentProps {
    disabled: boolean;
    onChangeStrokeWidth: (strokeWidth: number) => void;
    strokeWidth?: number;
}

const LiveInput = LiveInputHOC(Input);
const StrokeWidthIndicatorComponent = (props: StrokeWidthIndicatorComponentProps) => (
    <InputGroup disabled={props.disabled}>
        <LiveInput
            range
            small
            disabled={props.disabled}
            max={MAX_STROKE_WIDTH}
            min="0"
            type="number"
            value={props.strokeWidth ? props.strokeWidth : 0}
            onSubmit={props.onChangeStrokeWidth}
        />
    </InputGroup>
);

export default StrokeWidthIndicatorComponent;
