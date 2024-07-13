import React from 'react';

import styles from './scrollable-canvas.css';

interface ScrollableCanvasComponent {
    children: React.ReactNode;
    hideScrollbars?: boolean;
    horizontalScrollLengthPercent?: number;
    horizontalScrollStartPercent?: number;
    onHorizontalScrollbarMouseDown: () => void;
    onVerticalScrollbarMouseDown: () => void;
    style?: string;
    verticalScrollLengthPercent?: number;
    verticalScrollStartPercent?: number;
};

const ScrollableCanvasComponent = (props: ScrollableCanvasComponent) => (
    <div
        className={props.style}
    >
        {props.children}
        <div
            className={styles.horizontalScrollbarWrapper}
            style={{pointerEvents: 'none'}}
        >
            <div
                className={styles.horizontalScrollbarHitbox}
                style={{
                    width: `${props.horizontalScrollLengthPercent}%`,
                    left: `${props.horizontalScrollStartPercent}%`,
                    pointerEvents: 'auto',
                    display: `${props.hideScrollbars ||
                        Math.abs(props.horizontalScrollLengthPercent - 100) < 1e-8 ? 'none' : 'block'}`
                }}
                onMouseDown={props.onHorizontalScrollbarMouseDown}
                onTouchStart={props.onHorizontalScrollbarMouseDown}
            >
                <div
                    className={styles.horizontalScrollbar}
                />
            </div>
        </div>
        <div
            className={styles.verticalScrollbarWrapper}
            style={{pointerEvents: 'none'}}
        >
            <div
                className={styles.verticalScrollbarHitbox}
                style={{
                    height: `${props.verticalScrollLengthPercent}%`,
                    top: `${props.verticalScrollStartPercent}%`,
                    pointerEvents: 'auto',
                    display: `${props.hideScrollbars ||
                        Math.abs(props.verticalScrollLengthPercent - 100) < 1e-8 ? 'none' : 'block'}`
                }}
                onMouseDown={props.onVerticalScrollbarMouseDown}
                onTouchStart={props.onVerticalScrollbarMouseDown}
            >
                <div
                    className={styles.verticalScrollbar}
                />
            </div>
        </div>
    </div>
);

export default ScrollableCanvasComponent;
