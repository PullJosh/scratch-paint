import React from 'react';
import classNames from 'classnames';

import {MIXED} from '../../helper/style-path';

import noFillIcon from './no-fill.svg';
import mixedFillIcon from './mixed-fill.svg';
import styles from './color-button.css';
import GradientTypes from '../../lib/gradient-types';
import log from '../../log/log';

const colorToBackground = (color: string, color2: string, gradientType: keyof typeof GradientTypes) => {
    if (color === MIXED || (gradientType !== GradientTypes.SOLID && color2 === MIXED)) return 'white';
    if (color === null) color = 'white';
    if (color2 === null) color2 = 'white';
    switch (gradientType) {
    case GradientTypes.SOLID: return color;
    case GradientTypes.HORIZONTAL: return `linear-gradient(to right, ${color}, ${color2})`;
    case GradientTypes.VERTICAL: return `linear-gradient(${color}, ${color2})`;
    case GradientTypes.RADIAL: return `radial-gradient(${color}, ${color2})`;
    default: log.error(`Unrecognized gradient type: ${gradientType}`);
    }
};

interface ColorButtonComponentProps {
    color?: string;
    color2?: string;
    gradientType: keyof typeof GradientTypes;
    onClick: () => void;
    outline: boolean;
}

const ColorButtonComponent = (props: ColorButtonComponentProps) => (
    <div
        className={styles.colorButton}
        onClick={props.onClick}
    >
        <div
            className={classNames(styles.colorButtonSwatch, {
                [styles.outlineSwatch]: props.outline && !(props.color === MIXED)
            })}
            style={{
                background: colorToBackground(props.color, props.color2, props.gradientType)
            }}
        >
            {props.color === null && (props.gradientType === GradientTypes.SOLID || props.color2 === null) ? (
                <img
                    className={styles.swatchIcon}
                    draggable={false}
                    src={noFillIcon}
                />
            ) : ((props.color === MIXED || (props.gradientType !== GradientTypes.SOLID && props.color2 === MIXED) ? (
                <img
                    className={styles.swatchIcon}
                    draggable={false}
                    src={mixedFillIcon}
                />
            ) : null))}
        </div>
        <div className={styles.colorButtonArrow}>▾</div>
    </div>
);

export default ColorButtonComponent;
