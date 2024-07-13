import React from 'react';
import bindAll from 'lodash.bindall';
import classNames from 'classnames';
import {getEventXY} from '../../lib/touch-utils';

import styles from './slider.css';

const CONTAINER_WIDTH = 150;
const HANDLE_WIDTH = 26;

interface SliderComponentProps {
    background?: string;
    lastSlider?: boolean;
    onChange: (value: number) => void;
    value: number;
};

class SliderComponent extends React.Component<SliderComponentProps> {
    handleClickOffset: number;
    handle: HTMLDivElement;
    background: HTMLDivElement;
    
    constructor (props: SliderComponentProps) {
        super(props);
        bindAll(this, [
            'handleMouseDown',
            'handleMouseUp',
            'handleMouseMove',
            'handleClickBackground',
            'setBackground',
            'setHandle'
        ]);

        // Distance from the left edge of the slider handle to the mouse down/click event
        this.handleClickOffset = 0;
    }

    handleMouseDown (event: React.MouseEvent | React.TouchEvent) {
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
        document.addEventListener('touchmove', this.handleMouseMove, {passive: false});
        document.addEventListener('touchend', this.handleMouseUp);

        this.handleClickOffset = getEventXY(event).x - this.handle.getBoundingClientRect().left;
    }

    handleMouseUp () {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        document.removeEventListener('touchmove', this.handleMouseMove, {passive: false});
        document.removeEventListener('touchend', this.handleMouseUp);
    }

    handleMouseMove (event: MouseEvent | TouchEvent) {
        event.preventDefault();
        this.props.onChange(this.scaleMouseToSliderPosition(event));
    }

    handleClickBackground (event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) {
        // Because the slider handle is a child of the "background" element this handler is registered to, it calls this
        // when clicked as well. We only want to change the slider value if the user clicked on the background itself.
        if (event.target !== this.background) return;
        // Move slider handle's center to the cursor
        this.handleClickOffset = HANDLE_WIDTH / 2;
        this.props.onChange(this.scaleMouseToSliderPosition(event));
    }

    scaleMouseToSliderPosition (event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) {
        const {x} = getEventXY(event);
        const backgroundBBox = this.background.getBoundingClientRect();
        const scaledX = x - backgroundBBox.left - this.handleClickOffset;
        return Math.max(0, Math.min(100, 100 * scaledX / (backgroundBBox.width - HANDLE_WIDTH)));
    }

    setBackground (ref: HTMLDivElement) {
        this.background = ref;
    }

    setHandle (ref: HTMLDivElement) {
        this.handle = ref;
    }

    render () {
        const halfHandleWidth = HANDLE_WIDTH / 2;
        const pixelMin = halfHandleWidth;
        const pixelMax = CONTAINER_WIDTH - halfHandleWidth;
        const handleOffset = pixelMin +
            ((pixelMax - pixelMin) * (this.props.value / 100)) -
            halfHandleWidth;
        return (
            <div
                className={classNames({
                    [styles.container]: true,
                    [styles.last]: this.props.lastSlider
                })}
                ref={this.setBackground}
                style={{
                    backgroundImage: this.props.background ?? 'yellow'
                }}
                onClick={this.handleClickBackground}
            >
                <div
                    className={styles.handle}
                    ref={this.setHandle}
                    style={{
                        left: `${handleOffset}px`
                    }}
                    onMouseDown={this.handleMouseDown}
                    onTouchStart={this.handleMouseDown}
                />
            </div>
        );
    }
}

export default SliderComponent;
export {CONTAINER_WIDTH, HANDLE_WIDTH};
