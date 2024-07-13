import classNames from 'classnames';
import React from 'react';

import styles from './input-group.css';

interface InputGroupProps {
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    rtl?: boolean;

}

const InputGroup = (props: InputGroupProps) => (
    <div
        className={classNames(props.className, styles.inputGroup, {
            [styles.disabled]: props.disabled
        })}
        dir={props.rtl ? 'rtl' : ''}
    >
        {props.children}
    </div>
);

export default InputGroup;
