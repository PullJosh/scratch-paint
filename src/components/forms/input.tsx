/* DO NOT EDIT
@todo This file is copied from GUI and should be pulled out into a shared library.
See https://github.com/LLK/scratch-paint/issues/13 */

/* NOTE:
Edited to add range prop
*/

import React from 'react';
import classNames from 'classnames';

import styles from './input.css';

interface InputProps {
    className?: string;
    range?: boolean;
    small?: boolean;
};

const Input = (props: InputProps) => {
    const {small = false, range = false, ...componentProps} = props;
    return (
        <input
            {...componentProps}
            className={classNames(
                styles.inputForm,
                props.className,
                {
                    [styles.inputSmall]: small && !range,
                    [styles.inputSmallRange]: small && range
                }
            )}
        />
    );
};

export default Input;
