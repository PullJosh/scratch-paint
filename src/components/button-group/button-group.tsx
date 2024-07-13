import classNames from 'classnames';
import React from 'react';

import styles from './button-group.css';

interface ButtonGroupProps {
    children: React.ReactNode;
    className?: string;
}

const ButtonGroup = (props: ButtonGroupProps) => (
    <div className={classNames(props.className, styles.buttonGroup)}>
        {props.children}
    </div>
);

export default ButtonGroup;
