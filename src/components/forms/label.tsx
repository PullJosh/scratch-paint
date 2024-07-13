/* DO NOT EDIT
@todo This file is copied from GUI and should be pulled out into a shared library.
See https://github.com/LLK/scratch-paint/issues/13 */

import React from 'react';

import styles from './label.css';

interface LabelProps {
    children?: React.ReactNode;
    secondary?: boolean;
    text: string;
}

const Label = (props: LabelProps) => (
    <label className={styles.inputGroup}>
        <span className={props.secondary ? styles.inputLabelSecondary : styles.inputLabel}>
            {props.text}
        </span>
        {props.children}
    </label>
);

export default Label;
