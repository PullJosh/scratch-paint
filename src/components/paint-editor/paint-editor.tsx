import paper from '@scratch/paper';
import classNames from 'classnames';
import {defineMessages, injectIntl, InjectedIntl} from 'react-intl';
import React from 'react';

import PaperCanvas from '../../containers/paper-canvas';
import ScrollableCanvas from '../../containers/scrollable-canvas';

import BitBrushMode from '../../containers/bit-brush-mode';
import BitLineMode from '../../containers/bit-line-mode';
import BitOvalMode from '../../containers/bit-oval-mode';
import BitRectMode from '../../containers/bit-rect-mode';
import BitFillMode from '../../containers/bit-fill-mode';
import BitEraserMode from '../../containers/bit-eraser-mode';
import BitSelectMode from '../../containers/bit-select-mode';
import Box from '../box/box';
import Button from '../button/button';
import ButtonGroup from '../button-group/button-group';
import BrushMode from '../../containers/brush-mode';
import EraserMode from '../../containers/eraser-mode';
import FillColorIndicatorComponent from '../../containers/fill-color-indicator';
import FillMode from '../../containers/fill-mode';
import InputGroup from '../input-group/input-group';
import LineMode from '../../containers/line-mode';
import Loupe from '../loupe/loupe';
import FixedToolsContainer from '../../containers/fixed-tools';
import ModeToolsContainer from '../../containers/mode-tools';
import OvalMode from '../../containers/oval-mode';
import RectMode from '../../containers/rect-mode';
import ReshapeMode from '../../containers/reshape-mode';
import SelectMode from '../../containers/select-mode';
import StrokeColorIndicatorComponent from '../../containers/stroke-color-indicator';
import StrokeWidthIndicatorComponent from '../../containers/stroke-width-indicator';
import TextMode from '../../containers/text-mode';

import Formats, {isBitmap, isVector} from '../../lib/format';
import styles from './paint-editor.css';

import bitmapIcon from './icons/bitmap.svg';
import zoomInIcon from './icons/zoom-in.svg';
import zoomOutIcon from './icons/zoom-out.svg';
import zoomResetIcon from './icons/zoom-reset.svg';

const messages = defineMessages({
    bitmap: {
        defaultMessage: 'Convert to Bitmap',
        description: 'Label for button that converts the paint editor to bitmap mode',
        id: 'paint.paintEditor.bitmap'
    },
    vector: {
        defaultMessage: 'Convert to Vector',
        description: 'Label for button that converts the paint editor to vector mode',
        id: 'paint.paintEditor.vector'
    }
});

interface PaintEditorComponentProps {
    canRedo: () => boolean;
    canUndo: () => boolean;
    canvas?: Element;
    colorInfo?: any; // TODO: This used to be Loupe.propTypes.colorInfo
    format?: keyof typeof Formats;
    image?: string | HTMLImageElement;
    imageFormat?: string;
    imageId?: string;
    intl: InjectedIntl;
    isEyeDropping?: boolean;
    name?: string;
    onRedo: () => void;
    onSwitchToBitmap: () => void;
    onSwitchToVector: () => void;
    onUndo: () => void;
    onUpdateImage: () => void;
    onUpdateName: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomReset: () => void;
    rotationCenterX?: number;
    rotationCenterY?: number;
    rtl?: boolean;
    setCanvas: () => void;
    setTextArea: () => void;
    textArea?: Element;
    zoomLevelId?: string;
}

const PaintEditorComponent = (props: PaintEditorComponentProps) => (
    <div
        className={styles.editorContainer}
        dir={props.rtl ? 'rtl' : 'ltr'}
    >
        {props.canvas !== null ? ( // eslint-disable-line no-negated-condition
            <div className={styles.editorContainerTop}>
                {/* First row */}
                <div className={styles.row}>
                    <FixedToolsContainer
                        canRedo={props.canRedo}
                        canUndo={props.canUndo}
                        name={props.name}
                        onRedo={props.onRedo}
                        onUndo={props.onUndo}
                        onUpdateImage={props.onUpdateImage}
                        onUpdateName={props.onUpdateName}
                    />
                </div>
                {/* Second Row */}
                {isVector(props.format) ?
                    <div className={styles.row}>
                        <InputGroup
                            className={classNames(
                                styles.row,
                                styles.modDashedBorder,
                                styles.modLabeledIconHeight
                            )}
                        >
                            {/* fill */}
                            <FillColorIndicatorComponent
                                className={styles.modMarginAfter}
                                onUpdateImage={props.onUpdateImage}
                            />
                            {/* stroke */}
                            <StrokeColorIndicatorComponent
                                onUpdateImage={props.onUpdateImage}
                            />
                            {/* stroke width */}
                            <StrokeWidthIndicatorComponent
                                onUpdateImage={props.onUpdateImage}
                            />
                        </InputGroup>
                        <InputGroup className={styles.modModeTools}>
                            <ModeToolsContainer
                                onUpdateImage={props.onUpdateImage}
                            />
                        </InputGroup>
                    </div> :
                    isBitmap(props.format) ?
                        <div className={styles.row}>
                            <InputGroup
                                className={classNames(
                                    styles.row,
                                    styles.modDashedBorder,
                                    styles.modLabeledIconHeight
                                )}
                            >
                                {/* fill */}
                                <FillColorIndicatorComponent
                                    className={styles.modMarginAfter}
                                    onUpdateImage={props.onUpdateImage}
                                />
                            </InputGroup>
                            <InputGroup className={styles.modModeTools}>
                                <ModeToolsContainer
                                    onUpdateImage={props.onUpdateImage}
                                />
                            </InputGroup>
                        </div> : null
                }
            </div>
        ) : null}

        <div className={styles.topAlignRow}>
            {/* Modes */}
            {props.canvas !== null && isVector(props.format) ? ( // eslint-disable-line no-negated-condition
                <div className={styles.modeSelector}>
                    <SelectMode
                        onUpdateImage={props.onUpdateImage}
                    />
                    <ReshapeMode
                        onUpdateImage={props.onUpdateImage}
                    />
                    <BrushMode
                        onUpdateImage={props.onUpdateImage}
                    />
                    <EraserMode
                        onUpdateImage={props.onUpdateImage}
                    />
                    <FillMode
                        onUpdateImage={props.onUpdateImage}
                    />
                    <TextMode
                        textArea={props.textArea}
                        onUpdateImage={props.onUpdateImage}
                    />
                    <LineMode
                        onUpdateImage={props.onUpdateImage}
                    />
                    <OvalMode
                        onUpdateImage={props.onUpdateImage}
                    />
                    <RectMode
                        onUpdateImage={props.onUpdateImage}
                    />
                </div>
            ) : null}

            {props.canvas !== null && isBitmap(props.format) ? ( // eslint-disable-line no-negated-condition
                <div className={styles.modeSelector}>
                    <BitBrushMode
                        onUpdateImage={props.onUpdateImage}
                    />
                    <BitLineMode
                        onUpdateImage={props.onUpdateImage}
                    />
                    <BitOvalMode
                        onUpdateImage={props.onUpdateImage}
                    />
                    <BitRectMode
                        onUpdateImage={props.onUpdateImage}
                    />
                    <TextMode
                        isBitmap
                        textArea={props.textArea}
                        onUpdateImage={props.onUpdateImage}
                    />
                    <BitFillMode
                        onUpdateImage={props.onUpdateImage}
                    />
                    <BitEraserMode
                        onUpdateImage={props.onUpdateImage}
                    />
                    <BitSelectMode
                        onUpdateImage={props.onUpdateImage}
                    />
                </div>
            ) : null}

            <div className={styles.controlsContainer}>
                {/* Canvas */}
                <ScrollableCanvas
                    canvas={props.canvas}
                    hideScrollbars={props.isEyeDropping}
                    style={styles.canvasContainer}
                >
                    <PaperCanvas
                        canvasRef={props.setCanvas}
                        image={props.image}
                        imageFormat={props.imageFormat}
                        imageId={props.imageId}
                        rotationCenterX={props.rotationCenterX}
                        rotationCenterY={props.rotationCenterY}
                        zoomLevelId={props.zoomLevelId}
                        onUpdateImage={props.onUpdateImage}
                    />
                    <textarea
                        className={styles.textArea}
                        ref={props.setTextArea}
                        spellCheck={false}
                    />
                    {props.isEyeDropping &&
                        props.colorInfo !== null &&
                        !props.colorInfo.hideLoupe ? (
                            <Box className={styles.colorPickerWrapper}>
                                <Loupe
                                    colorInfo={props.colorInfo}
                                    pixelRatio={paper.project.view.pixelRatio}
                                />
                            </Box>
                        ) : null
                    }
                </ScrollableCanvas>
                <div className={styles.canvasControls}>
                    {isVector(props.format) ?
                        <Button
                            className={styles.bitmapButton}
                            onClick={props.onSwitchToBitmap}
                        >
                            <img
                                className={styles.bitmapButtonIcon}
                                draggable={false}
                                src={bitmapIcon}
                            />
                            <span className={styles.buttonText}>
                                {props.intl.formatMessage(messages.bitmap)}
                            </span>
                        </Button> :
                        isBitmap(props.format) ?
                            <Button
                                className={styles.bitmapButton}
                                onClick={props.onSwitchToVector}
                            >
                                <img
                                    className={styles.bitmapButtonIcon}
                                    draggable={false}
                                    src={bitmapIcon}
                                />
                                <span className={styles.buttonText}>
                                    {props.intl.formatMessage(messages.vector)}
                                </span>
                            </Button> : null
                    }
                    {/* Zoom controls */}
                    <InputGroup className={styles.zoomControls}>
                        <ButtonGroup>
                            <Button
                                className={styles.buttonGroupButton}
                                onClick={props.onZoomOut}
                            >
                                <img
                                    alt="Zoom Out"
                                    className={styles.buttonGroupButtonIcon}
                                    draggable={false}
                                    src={zoomOutIcon}
                                />
                            </Button>
                            <Button
                                className={styles.buttonGroupButton}
                                onClick={props.onZoomReset}
                            >
                                <img
                                    alt="Zoom Reset"
                                    className={styles.buttonGroupButtonIcon}
                                    draggable={false}
                                    src={zoomResetIcon}
                                />
                            </Button>
                            <Button
                                className={styles.buttonGroupButton}
                                onClick={props.onZoomIn}
                            >
                                <img
                                    alt="Zoom In"
                                    className={styles.buttonGroupButtonIcon}
                                    draggable={false}
                                    src={zoomInIcon}
                                />
                            </Button>
                        </ButtonGroup>
                    </InputGroup>
                </div>
            </div>
        </div>
    </div>
);

export default injectIntl(PaintEditorComponent);
