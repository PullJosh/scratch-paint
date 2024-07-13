import classNames from 'classnames';
import React from 'react';

import Button from '../button/button';
import Dropdown from '../dropdown/dropdown';
import InputGroup from '../input-group/input-group';
import Fonts from '../../lib/fonts';
import styles from './font-dropdown.css';

interface ModeToolsComponentProps {
    componentRef: (instance: Dropdown | null) => void;
    font?: string;
    getFontName: (font: string) => string;
    getFontStyle: (font: string) => string;
    onChoose: (event: React.MouseEvent) => void;
    onClickOutsideDropdown?: () => void;
    onHoverChinese?: (event: React.MouseEvent) => void;
    onHoverCurly?: (event: React.MouseEvent) => void;
    onHoverHandwriting?: (event: React.MouseEvent) => void;
    onHoverJapanese?: (event: React.MouseEvent) => void;
    onHoverKorean?: (event: React.MouseEvent) => void;
    onHoverMarker?: (event: React.MouseEvent) => void;
    onHoverPixel?: (event: React.MouseEvent) => void;
    onHoverSansSerif?: (event: React.MouseEvent) => void;
    onHoverSerif?: (event: React.MouseEvent) => void;
    onOpenDropdown?: () => void;
}

const ModeToolsComponent = (props: ModeToolsComponentProps) => (
    <Dropdown
        className={classNames(styles.modUnselect, styles.fontDropdown)}
        enterExitTransitionDurationMs={60}
        popoverContent={
            <InputGroup className={styles.modContextMenu}>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverSansSerif}
                >
                    <span className={styles.sansSerif}>
                        {props.getFontName(Fonts.SANS_SERIF)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverSerif}
                >
                    <span className={styles.serif}>
                        {props.getFontName(Fonts.SERIF)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverHandwriting}
                >
                    <span className={styles.handwriting}>
                        {props.getFontName(Fonts.HANDWRITING)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverMarker}
                >
                    <span className={styles.marker}>
                        {props.getFontName(Fonts.MARKER)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverCurly}
                >
                    <span className={styles.curly}>
                        {props.getFontName(Fonts.CURLY)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverPixel}
                >
                    <span className={styles.pixel}>
                        {props.getFontName(Fonts.PIXEL)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverChinese}
                >
                    <span className={styles.chinese}>
                        {props.getFontName(Fonts.CHINESE)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverJapanese}
                >
                    <span className={styles.japanese}>
                        {props.getFontName(Fonts.JAPANESE)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverKorean}
                >
                    <span className={styles.korean}>
                        {props.getFontName(Fonts.KOREAN)}
                    </span>
                </Button>
            </InputGroup>
        }
        ref={props.componentRef}
        tipSize={.01}
        onOpen={props.onOpenDropdown}
        onOuterAction={props.onClickOutsideDropdown}
    >
        <span className={classNames(props.getFontStyle(props.font), styles.displayedFontName)}>
            {props.getFontName(props.font)}
        </span>
    </Dropdown>
);

export default ModeToolsComponent;
