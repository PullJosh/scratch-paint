/* @todo This file should be pulled out into a shared library with scratch-gui,
consolidating this component with icon-button.jsx in gui.
See #13 */

import classNames from 'classnames';
import React from 'react';

import Button from '../button/button';

import styles from './labeled-icon-button.css';

interface LabeledIconButtonProps {
    className?: string;
    hideLabel?: boolean;
    highlighted?: boolean;
    imgAlt?: string;
    imgSrc: string;
    onClick: (event: React.MouseEvent<HTMLSpanElement>) => void;
    title: string;
}

const LabeledIconButton = ({
    className,
    hideLabel,
    imgAlt,
    imgSrc,
    onClick,
    title,
    ...props
}: LabeledIconButtonProps) => (
    <Button
        className={classNames(className, styles.modEditField)}
        onClick={onClick}
        {...props}
    >
        <img
            alt={imgAlt || title}
            className={styles.editFieldIcon}
            draggable={false}
            src={imgSrc}
            title={title}
        />
        {!hideLabel && <span className={styles.editFieldTitle}>{title}</span>}
    </Button>
);

export default LabeledIconButton;
