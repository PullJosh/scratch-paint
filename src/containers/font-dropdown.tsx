import paper from '@scratch/paper';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import React from 'react';

import FontDropdownComponent from '../components/font-dropdown/font-dropdown';
import Fonts from '../lib/fonts';
import {changeFont} from '../reducers/font';
import {getSelectedLeafItems} from '../helper/selection';
import styles from '../components/font-dropdown/font-dropdown.css';
import Dropdown from '../components/dropdown/dropdown';

interface FontDropdownProps {
    changeFont: (font: string) => void;
    font?: string;
    onUpdateImage: () => void;
}

class FontDropdown extends React.Component<FontDropdownProps> {
    dropDown: Dropdown;
    savedFont: string;
    savedSelection: paper.Item[];
    
    constructor (props: FontDropdownProps) {
        super(props);
        bindAll(this, [
            'getFontStyle',
            'getFontName',
            'handleChangeFontSerif',
            'handleChangeFontSansSerif',
            'handleChangeFontHandwriting',
            'handleChangeFontMarker',
            'handleChangeFontCurly',
            'handleChangeFontPixel',
            'handleChangeFontChinese',
            'handleChangeFontJapanese',
            'handleChangeFontKorean',
            'handleOpenDropdown',
            'handleClickOutsideDropdown',
            'setDropdown',
            'handleChoose'
        ]);
    }
    getFontStyle (font: string) {
        switch (font) {
        case Fonts.SERIF:
            return styles.serif;
        case Fonts.SANS_SERIF:
            return styles.sansSerif;
        case Fonts.HANDWRITING:
            return styles.handwriting;
        case Fonts.MARKER:
            return styles.marker;
        case Fonts.CURLY:
            return styles.curly;
        case Fonts.PIXEL:
            return styles.pixel;
        case Fonts.CHINESE:
            return styles.chinese;
        case Fonts.JAPANESE:
            return styles.japanese;
        case Fonts.KOREAN:
            return styles.korean;
        default:
            return '';
        }
    }
    getFontName (font: string) {
        switch (font) {
        case Fonts.CHINESE:
            return '中文';
        case Fonts.KOREAN:
            return '한국어';
        case Fonts.JAPANESE:
            return '日本語';
        default:
            return font;
        }
    }
    handleChangeFontSansSerif () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.SANS_SERIF);
        }
    }
    handleChangeFontSerif () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.SERIF);
        }
    }
    handleChangeFontHandwriting () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.HANDWRITING);
        }
    }
    handleChangeFontMarker () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.MARKER);
        }
    }
    handleChangeFontCurly () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.CURLY);
        }
    }
    handleChangeFontPixel () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.PIXEL);
        }
    }
    handleChangeFontChinese () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.CHINESE);
        }
    }
    handleChangeFontJapanese () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.JAPANESE);
        }
    }
    handleChangeFontKorean () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.KOREAN);
        }
    }
    handleChoose () {
        if (this.dropDown.isOpen()) {
            this.dropDown.handleClosePopover();
            this.props.onUpdateImage();
        }
    }
    handleOpenDropdown () {
        this.savedFont = this.props.font;
        this.savedSelection = getSelectedLeafItems();
    }
    handleClickOutsideDropdown (e: Event) {
        e.stopPropagation();
        this.dropDown.handleClosePopover();

        // Cancel font change
        for (const item of this.savedSelection) {
            if (item instanceof paper.PointText) {
                item.font = this.savedFont;
            }
        }

        this.props.changeFont(this.savedFont);
        this.savedFont = null;
        this.savedSelection = null;
    }
    setDropdown (element: Dropdown) {
        this.dropDown = element;
    }
    render () {
        return (
            <FontDropdownComponent
                componentRef={this.setDropdown}
                font={this.props.font}
                getFontName={this.getFontName}
                getFontStyle={this.getFontStyle}
                onChoose={this.handleChoose}
                onClickOutsideDropdown={this.handleClickOutsideDropdown}
                onHoverChinese={this.handleChangeFontChinese}
                onHoverCurly={this.handleChangeFontCurly}
                onHoverHandwriting={this.handleChangeFontHandwriting}
                onHoverJapanese={this.handleChangeFontJapanese}
                onHoverKorean={this.handleChangeFontKorean}
                onHoverMarker={this.handleChangeFontMarker}
                onHoverPixel={this.handleChangeFontPixel}
                onHoverSansSerif={this.handleChangeFontSansSerif}
                onHoverSerif={this.handleChangeFontSerif}
                onOpenDropdown={this.handleOpenDropdown}
            />
        );
    }
}

const mapStateToProps = state => ({
    font: state.scratchPaint.font
});
const mapDispatchToProps = dispatch => ({
    changeFont: font => {
        dispatch(changeFont(font));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FontDropdown);
