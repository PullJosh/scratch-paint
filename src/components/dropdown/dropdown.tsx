import bindAll from 'lodash.bindall';
import classNames from 'classnames';
import Popover from 'react-popover';
import React from 'react';

import styles from './dropdown.css';

import dropdownIcon from './dropdown-caret.svg';

interface DropdownProps {
    children: React.ReactNode;
    className?: string;
    onOpen?: () => void;
    onOuterAction?: () => void;
    popoverContent: React.ReactNode;
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
            <Popover
                body={this.props.popoverContent}
                isOpen={this.state.isOpen}
                preferPlace="below"
                onOuterAction={this.props.onOuterAction ?
                    this.props.onOuterAction : this.handleClosePopover}
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
            </Popover>
        );
    }
}

export default Dropdown;
