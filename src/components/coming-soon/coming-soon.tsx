/* DO NOT EDIT
@todo This file is copied from GUI and should be pulled out into a shared library.
See #13 */

import bindAll from 'lodash.bindall';
import classNames from 'classnames';
import {defineMessages, injectIntl, InjectedIntl, FormattedMessage} from 'react-intl';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import styles from './coming-soon.css';

import awwCatIcon from './aww-cat.png';
import coolCatIcon from './cool-cat.png';

const messages = defineMessages({
    message1: {
        defaultMessage: 'Don\'t worry, we\'re on it {emoji}',
        description: 'One of the "coming soon" random messages for yet-to-be-done features',
        id: 'gui.comingSoon.message1'
    },
    message2: {
        defaultMessage: 'Coming Soon...',
        description: 'One of the "coming soon" random messages for yet-to-be-done features',
        id: 'gui.comingSoon.message2'
    },
    message3: {
        defaultMessage: 'We\'re working on it {emoji}',
        description: 'One of the "coming soon" random messages for yet-to-be-done features',
        id: 'gui.comingSoon.message3'
    }
});

interface ComingSoonContentProps {
    className?: string;
    intl: InjectedIntl;
    place?: 'top' | 'right' | 'bottom' | 'left';
    tooltipId: string;
}

class ComingSoonContent extends React.Component<ComingSoonContentProps> {
    constructor (props: ComingSoonContentProps) {
        super(props);
        bindAll(this, [
            'setHide',
            'setShow',
            'getRandomMessage'
        ]);
        this.state = {
            isShowing: false
        };
    }
    setShow () {
        // needed to set the opacity to 1, since the default is .9 on show
        this.setState({isShowing: true});
    }
    setHide () {
        this.setState({isShowing: false});
    }
    getRandomMessage () {
        // randomly chooses a messages from `messages` to display in the tooltip.
        const images = [awwCatIcon, coolCatIcon];
        const messageNumber = Math.floor(Math.random() * Object.keys(messages).length) + 1;
        const imageNumber = Math.floor(Math.random() * Object.keys(images).length);
        return (
            <FormattedMessage
                {...messages[`message${messageNumber}`]}
                values={{
                    emoji: (
                        <img
                            className={styles.comingSoonImage}
                            src={images[imageNumber]}
                        />
                    )
                }}
            />
        );
    }
    render () {
        const { place = 'bottom' } = this.props;
        
        return (
            <ReactTooltip
                afterHide={this.setHide}
                afterShow={this.setShow}
                className={classNames(
                    styles.comingSoon,
                    this.props.className,
                    {
                        [styles.show]: (this.state.isShowing),
                        [styles.left]: (place === 'left'),
                        [styles.right]: (place === 'right'),
                        [styles.top]: (place === 'top'),
                        [styles.bottom]: (place === 'bottom')
                    }
                )}
                getContent={this.getRandomMessage}
                id={this.props.tooltipId}
            />
        );
    }
}

const ComingSoon = injectIntl(ComingSoonContent);

interface ComingSoonTooltipProps {
    children: React.ReactNode;
    className?: string;
    delayHide?: number;
    delayShow?: number;
    place?: 'top' | 'right' | 'bottom' | 'left';
    tooltipClassName?: string;
    tooltipId: string;
}

const ComingSoonTooltip = (props: ComingSoonTooltipProps) => (
    <div className={props.className}>
        <div
            data-delay-hide={props.delayHide ?? 0}
            data-delay-show={props.delayShow ?? 0}
            data-effect="solid"
            data-for={props.tooltipId}
            data-place={props.place}
            data-tip="tooltip"
        >
            {props.children}
        </div>
        <ComingSoon
            className={props.tooltipClassName}
            place={props.place}
            tooltipId={props.tooltipId}
        />
    </div>
);

export {
    ComingSoon as ComingSoonComponent,
    ComingSoonTooltip
};
