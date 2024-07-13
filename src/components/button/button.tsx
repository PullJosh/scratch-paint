/* DO NOT EDIT
@todo This file is copied from GUI and should be pulled out into a shared library.
See #13 */

/* ACTUALLY, THIS IS EDITED ;)
THIS WAS CHANGED ON 10/25/2017 BY @mewtaylor TO ADD HANDLING FOR DISABLED STATES.*/

import classNames from 'classnames';
import React from 'react';

import styles from './button.css';

interface ButtonComponentProps extends React.HTMLProps<HTMLSpanElement> {
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    highlighted?: boolean;
    onClick: (event: React.MouseEvent<HTMLSpanElement>) => void;
}

const ButtonComponent = ({
    className,
    highlighted,
    onClick,
    children,
    ...props
}: ButtonComponentProps) => {
    return (
        <span
            className={classNames(
                styles.button,
                className,
                {
                    [styles.modDisabled]: props.disabled,
                    [styles.highlighted]: highlighted
                }
            )}
            role="button"
            onClick={props.disabled ? undefined : onClick}
            {...props}
        >
            {children}
        </span>
    );
};

export default ButtonComponent;
