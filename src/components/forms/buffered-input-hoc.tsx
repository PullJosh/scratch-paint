/* DO NOT EDIT
@todo This file is copied from GUI and should be pulled out into a shared library.
See https://github.com/LLK/scratch-paint/issues/13 */

import bindAll from 'lodash.bindall';
import React from 'react';

/**
 * Higher Order Component to manage inputs that submit on blur and <enter>
 * @param {React.Component} Input text input that consumes onChange, onBlur, onKeyPress
 * @returns {React.Component} Buffered input that calls onSubmit on blur and <enter>
 */
type InputComponent = React.Component<{
    value: string | number;
    onChange: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}>;
export default function (Input: InputComponent) {
    interface BufferedInputProps {
        onSubmit: (value: string | number) => void;
        value?: string | number;
    }

    interface BufferedInputState {
        value: string | number;
    }
    
    class BufferedInput extends React.Component<BufferedInputProps, BufferedInputState> {
        constructor (props: BufferedInputProps) {
            super(props);
            bindAll(this, [
                'handleChange',
                'handleKeyPress',
                'handleFlush'
            ]);
            this.state = {
                value: null
            };
        }
        handleKeyPress (e: React.KeyboardEvent<HTMLInputElement>) {
            if (e.key === 'Enter') {
                this.handleFlush();
                e.currentTarget.blur();
            }
        }
        handleFlush () {
            const isNumeric = typeof this.props.value === 'number';
            const validatesNumeric = isNumeric ? !isNaN(this.state.value as number) : true;
            if (this.state.value !== null && validatesNumeric) {
                this.props.onSubmit(isNumeric ? Number(this.state.value) : this.state.value);
            }
            this.setState({value: null});
        }
        handleChange (e: React.KeyboardEvent<HTMLInputElement>) {
            this.setState({value: e.currentTarget.value});
        }
        render () {
            const bufferedValue = this.state.value === null ? this.props.value : this.state.value;
            return (
                <Input
                    {...this.props}
                    value={bufferedValue}
                    onBlur={this.handleFlush}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                />
            );
        }
    }

    return BufferedInput;
}
