import bindAll from 'lodash.bindall';
import classNames from 'classnames';
import {CompatiblePopover} from '../compatible-popover/compatible-popover';
import React from 'react';

import styles from './dropdown.css';

import dropdownIcon from './dropdown-caret.svg';

interface DropdownProps {
    children: React.ReactNode;
    className?: string;
    onOpen?: () => void;
    onOuterAction?: () => void;
    popoverContent: React.ReactElement;
}

interface DropdownState {
    isOpen: boolean;
}

class Dropdown extends React.Component<DropdownProps, DropdownState> {
    constructor (props: DropdownProps) {
        super(props);
        bindAll(this, [
            'handleClosePopover',
            'handleToggleOpenState',
            'isOpen'
        ]);
        this.state = {
            isOpen: false
        };
    }
    handleClosePopover () {
        this.setState({
            isOpen: false
        });
    }
    handleToggleOpenState () {
        const newState = !this.state.isOpen;
        this.setState({
            isOpen: newState
        });
        if (newState && this.props.onOpen) {
            this.props.onOpen();
        }
    }
    isOpen () {
        return this.state.isOpen;
    }
    render () {
        return (
            <CompatiblePopover
                body={this.props.popoverContent}
                isOpen={this.state.isOpen}
                onOuterAction={this.props.onOuterAction ?
                    this.props.onOuterAction : this.handleClosePopover}
                animated={false}
                arrow={false}
                {...this.props}
            >
                <div
                    className={classNames(styles.dropdown, this.props.className, {
                        [styles.modOpen]: this.state.isOpen,
                        [styles.modClosed]: !this.state.isOpen
                    })}
                    onClick={this.handleToggleOpenState}
                >
                    {this.props.children}
                    <img
                        className={classNames(styles.dropdownIcon, {
                            [styles.modCaretUp]: this.state.isOpen
                        })}
                        draggable={false}
                        src={dropdownIcon}
                    />
                </div>
            </CompatiblePopover>
        );
    }
}

export default Dropdown;
