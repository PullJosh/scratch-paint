import classNames from 'classnames';
import React from 'react';
import {injectIntl, InjectedIntl} from 'react-intl';

import Button from '../button/button';

import styles from './tool-select-base.css';

interface ToolSelectComponentProps {
    className?: string;
    disabled?: boolean;
    imgDescriptor: {
        defaultMessage?: string;
        description?: string;
        id: string;
    };
    imgSrc: string;
    intl: InjectedIntl;
    isSelected: boolean;
    onMouseDown: (event: React.MouseEvent) => void;
}

const ToolSelectComponent = (props: ToolSelectComponentProps) => (
    <Button
        className={
            classNames(props.className, styles.modToolSelect, {
                [styles.isSelected]: props.isSelected
            })
        }
        disabled={props.disabled}
        title={props.intl.formatMessage(props.imgDescriptor)}
        onClick={props.onMouseDown}
    >
        <img
            alt={props.intl.formatMessage(props.imgDescriptor)}
            className={styles.toolSelectIcon}
            draggable={false}
            src={props.imgSrc}
        />
    </Button>
);

export default injectIntl(ToolSelectComponent);
