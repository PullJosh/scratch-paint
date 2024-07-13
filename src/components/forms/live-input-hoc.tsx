import bindAll from 'lodash.bindall';
import React from 'react';

/**
 * Higher Order Component to manage inputs that submit on change and <enter>
 * @param {React.Component} Input text input that consumes onChange, onBlur, onKeyPress
 * @returns {React.Component} Live input that calls onSubmit on change and <enter>
 */
type InputComponent = React.Component<{
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}>;
export default function (Input: InputComponent) {
    interface LiveInputProps {
        max?: number;
        min?: number;
        onSubmit: (value: number | string) => void;
        value?: number | string;
    }

    interface LiveInputState {
        value: number | string;
    }
    
    class LiveInput extends React.Component<LiveInputProps, LiveInputState> {
        constructor (props: LiveInputProps) {
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
                this.handleChange(e);
                e.currentTarget.blur();
            }
        }
        handleFlush () {
            this.setState({value: null});
        }
        handleChange (e: React.KeyboardEvent<HTMLInputElement>) {
            const isNumeric = typeof this.props.value === 'number';
            const validatesNumeric = isNumeric ? !isNaN(Number(e.currentTarget.value)) : true;
            if (e.currentTarget.value !== null && validatesNumeric) {
                let val = Number(e.currentTarget.value);
                if (typeof this.props.max !== 'undefined' && val > Number(this.props.max)) {
                    val = this.props.max;
                }
                if (typeof this.props.min !== 'undefined' && val < Number(this.props.min)) {
                    val = this.props.min;
                }
                this.props.onSubmit(val);
            }
            this.setState({value: e.currentTarget.value});
        }
        render () {
            const liveValue = this.state.value === null ? this.props.value : this.state.value;
            return (
                <Input
                    {...this.props}
                    value={liveValue}
                    onBlur={this.handleFlush}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                />
            );
        }
    }

    return LiveInput;
}
