import paper from '@scratch/paper';
import log from '../log/log.js';
import * as React from 'react';
import {connect} from 'react-redux';

import PaintEditorComponent from '../components/paint-editor/paint-editor';
import KeyboardShortcutsHOC from '../hocs/keyboard-shortcuts-hoc';
import SelectionHOC from '../hocs/selection-hoc';
import UndoHOC from '../hocs/undo-hoc';
import UpdateImageHOC from '../hocs/update-image-hoc';

import {changeMode} from '../reducers/modes';
import {changeFormat} from '../reducers/format';
import {clearSelectedItems, setSelectedItems} from '../reducers/selected-items';
import {deactivateEyeDropper} from '../reducers/eye-dropper';
import {setTextEditTarget} from '../reducers/text-edit-target';
import {updateViewBounds} from '../reducers/view-bounds';
import {setLayout} from '../reducers/layout';

import {getSelectedLeafItems} from '../helper/selection';
import {convertToBitmap, convertToVector} from '../helper/bitmap';
import {resetZoom, zoomOnSelection, OUTERMOST_ZOOM_LEVEL} from '../helper/view';
import EyeDropperTool from '../helper/tools/eye-dropper';

import Modes, {BitmapModes, VectorModes} from '../lib/modes';
import Formats, {isBitmap, isVector} from '../lib/format';
import bindAll from 'lodash.bindall';

interface PaintEditorProps {
    changeColorToEyeDropper?: (color: string) => void;
    changeMode: (mode: string) => void;
    clearSelectedItems: () => void;
    format: keyof typeof Formats; // Internal, up-to-date data format
    fontInlineFn?: (fontFamily: string, fontWeight: string, isItalic: boolean) => string;
    handleSwitchToBitmap: () => void;
    handleSwitchToVector: () => void;
    image?: string | HTMLImageElement;
    imageFormat?: string; // The incoming image's data format, used during import
    imageId?: string;
    isEyeDropping?: boolean;
    mode: keyof typeof Modes;
    name?: string;
    onDeactivateEyeDropper: () => void;
    onKeyPress: (event: KeyboardEvent) => void;
    onRedo: () => void;
    onUndo: () => void;
    onUpdateImage: (image: string | ImageData) => void;
    onUpdateName: (name: string) => void;
    previousTool: { // paper.Tool
        activate: () => void;
        remove: () => void;
    };
    removeTextEditTarget: () => void;
    rotationCenterX?: number;
    rotationCenterY?: number;
    rtl: boolean;
    setLayout: (layout: string) => void;
    setSelectedItems: (format: string) => void;
    shouldShowRedo: () => boolean;
    shouldShowUndo: () => boolean;
    updateViewBounds: (matrix: paper.Matrix) => void;
    viewBounds: paper.Matrix;
    zoomLevelId?: string;
}

interface PaintEditorState {
    canvas: HTMLCanvasElement;
    colorInfo: {
        x: number;
        y: number;
    };
    textArea?: HTMLTextAreaElement;
}

/**
 * The top-level paint editor component. See README for more details on usage.
 *
 * <PaintEditor
 *     image={optionalImage}
 *     imageId={optionalId}
 *     imageFormat='svg'
 *     rotationCenterX={optionalCenterPointX}
 *     rotationCenterY={optionalCenterPointY}
 *     rtl={true|false}
 *     onUpdateImage={handleUpdateImageFunction}
 *     zoomLevelId={optionalZoomLevelId}
 * />
 *
 * `image`: may either be nothing, an SVG string or a base64 data URI)
 * SVGs of up to size 480 x 360 will fit into the view window of the paint editor,
 * while bitmaps of size up to 960 x 720 will fit into the paint editor. One unit
 * of an SVG will appear twice as tall and wide as one unit of a bitmap. This quirky
 * import behavior comes from needing to support legacy projects in Scratch.
 *
 * `imageId`: If this parameter changes, then the paint editor will be cleared, the
 * undo stack reset, and the image re-imported.
 *
 * `imageFormat`: 'svg', 'png', or 'jpg'. Other formats are currently not supported.
 *
 * `rotationCenterX`: x coordinate relative to the top left corner of the sprite of
 * the point that should be centered.
 *
 * `rotationCenterY`: y coordinate relative to the top left corner of the sprite of
 * the point that should be centered.
 *
 * `rtl`: True if the paint editor should be laid out right to left (meant for right
 * to left languages)
 *
 * `onUpdateImage`: A handler called with the new image (either an SVG string or an
 * ImageData) each time the drawing is edited.
 *
 * `zoomLevelId`: All costumes with the same zoom level ID will share the same saved
 * zoom level. When a new zoom level ID is encountered, the paint editor will zoom to
 * fit the current costume comfortably. Leave undefined to perform no zoom to fit.
 */
class PaintEditor extends React.Component<PaintEditorProps, PaintEditorState> {
    eyeDropper: EyeDropperTool;
    canvas: HTMLCanvasElement;
    intervalId?: ReturnType<typeof setInterval>;
    
    static get ZOOM_INCREMENT () {
        return 0.5;
    }
    constructor (props: PaintEditorProps) {
        super(props);
        bindAll(this, [
            'switchModeForFormat',
            'onMouseDown',
            'onMouseUp',
            'setCanvas',
            'setTextArea',
            'startEyeDroppingLoop',
            'stopEyeDroppingLoop',
            'handleSetSelectedItems',
            'handleZoomIn',
            'handleZoomOut',
            'handleZoomReset'
        ]);
        this.state = {
            canvas: null,
            colorInfo: null
        };
        this.props.setLayout(this.props.rtl ? 'rtl' : 'ltr');
    }
    componentDidMount () {
        document.addEventListener('keydown', this.props.onKeyPress);

        // document listeners used to detect if a mouse is down outside of the
        // canvas, and should therefore stop the eye dropper
        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('touchstart', this.onMouseDown);
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('touchend', this.onMouseUp);
    }
    componentDidUpdate (prevProps: PaintEditorProps) {
        if (!isBitmap(prevProps.format) && isBitmap(this.props.format)) {
            this.switchModeForFormat(Formats.BITMAP);
        } else if (!isVector(prevProps.format) && isVector(this.props.format)) {
            this.switchModeForFormat(Formats.VECTOR);
        }
        if (this.props.rtl !== prevProps.rtl) {
            this.props.setLayout(this.props.rtl ? 'rtl' : 'ltr');
        }

        if (this.props.isEyeDropping && !prevProps.isEyeDropping) {
            this.startEyeDroppingLoop();
        } else if (!this.props.isEyeDropping && prevProps.isEyeDropping) {
            this.stopEyeDroppingLoop();
        } else if (this.props.isEyeDropping && this.props.viewBounds !== prevProps.viewBounds) {
            if (this.props.previousTool) this.props.previousTool.activate();
            this.props.onDeactivateEyeDropper();
            this.stopEyeDroppingLoop();
        }

        if (this.props.format === Formats.VECTOR && isBitmap(prevProps.format)) {
            convertToVector(this.props.clearSelectedItems, this.props.onUpdateImage);
        } else if (isVector(prevProps.format) && this.props.format === Formats.BITMAP) {
            convertToBitmap(this.props.clearSelectedItems, this.props.onUpdateImage, this.props.fontInlineFn);
        }
    }
    componentWillUnmount () {
        document.removeEventListener('keydown', this.props.onKeyPress);
        this.stopEyeDroppingLoop();
        document.removeEventListener('mousedown', this.onMouseDown);
        document.removeEventListener('touchstart', this.onMouseDown);
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('touchend', this.onMouseUp);
    }
    switchModeForFormat (newFormat: keyof typeof Formats) {
        if ((isVector(newFormat) && (this.props.mode in VectorModes)) ||
            (isBitmap(newFormat) && (this.props.mode in BitmapModes))) {
            // Format didn't change; no mode change needed
            return;
        }
        if (isVector(newFormat)) {
            switch (this.props.mode) {
            case Modes.BIT_BRUSH:
                this.props.changeMode(Modes.BRUSH);
                break;
            case Modes.BIT_LINE:
                this.props.changeMode(Modes.LINE);
                break;
            case Modes.BIT_OVAL:
                this.props.changeMode(Modes.OVAL);
                break;
            case Modes.BIT_RECT:
                this.props.changeMode(Modes.RECT);
                break;
            case Modes.BIT_TEXT:
                this.props.changeMode(Modes.TEXT);
                break;
            case Modes.BIT_FILL:
                this.props.changeMode(Modes.FILL);
                break;
            case Modes.BIT_ERASER:
                this.props.changeMode(Modes.ERASER);
                break;
            case Modes.BIT_SELECT:
                this.props.changeMode(Modes.SELECT);
                break;
            default:
                log.error(`Mode not handled: ${this.props.mode}`);
                this.props.changeMode(Modes.BRUSH);
            }
        } else if (isBitmap(newFormat)) {
            switch (this.props.mode) {
            case Modes.BRUSH:
                this.props.changeMode(Modes.BIT_BRUSH);
                break;
            case Modes.LINE:
                this.props.changeMode(Modes.BIT_LINE);
                break;
            case Modes.OVAL:
                this.props.changeMode(Modes.BIT_OVAL);
                break;
            case Modes.RECT:
                this.props.changeMode(Modes.BIT_RECT);
                break;
            case Modes.TEXT:
                this.props.changeMode(Modes.BIT_TEXT);
                break;
            case Modes.FILL:
                this.props.changeMode(Modes.BIT_FILL);
                break;
            case Modes.ERASER:
                this.props.changeMode(Modes.BIT_ERASER);
                break;
            case Modes.RESHAPE:
                /* falls through */
            case Modes.SELECT:
                this.props.changeMode(Modes.BIT_SELECT);
                break;
            default:
                log.error(`Mode not handled: ${this.props.mode}`);
                this.props.changeMode(Modes.BIT_BRUSH);
            }
        }
    }
    handleZoomIn () {
        // Make the "next step" after the outermost zoom level be the default
        // zoom level (0.5)
        let zoomIncrement = PaintEditor.ZOOM_INCREMENT;
        if (paper.view.zoom === OUTERMOST_ZOOM_LEVEL) {
            zoomIncrement = 0.5 - OUTERMOST_ZOOM_LEVEL;
        }
        zoomOnSelection(zoomIncrement);
        this.props.updateViewBounds(paper.view.matrix);
        this.handleSetSelectedItems();
    }
    handleZoomOut () {
        zoomOnSelection(-PaintEditor.ZOOM_INCREMENT);
        this.props.updateViewBounds(paper.view.matrix);
        this.handleSetSelectedItems();
    }
    handleZoomReset () {
        resetZoom();
        this.props.updateViewBounds(paper.view.matrix);
        this.handleSetSelectedItems();
    }
    handleSetSelectedItems () {
        this.props.setSelectedItems(this.props.format);
    }
    setCanvas (canvas: HTMLCanvasElement) {
        this.setState({canvas: canvas});
        this.canvas = canvas;
    }
    setTextArea (element: HTMLTextAreaElement) {
        this.setState({textArea: element});
    }
    onMouseDown (event: MouseEvent | TouchEvent) {
        if (event.target === paper.view.element &&
                document.activeElement instanceof HTMLInputElement) {
            document.activeElement.blur();
        }

        if (event.target !== paper.view.element && event.target !== this.state.textArea) {
            // Exit text edit mode if you click anywhere outside of canvas
            this.props.removeTextEditTarget();
        }
    }
    onMouseUp () {
        if (this.props.isEyeDropping) {
            const colorString = this.eyeDropper.colorString;
            const callback = this.props.changeColorToEyeDropper;

            this.eyeDropper.remove();
            if (!this.eyeDropper.hideLoupe) {
                // If not hide loupe, that means the click is inside the canvas,
                // so apply the new color
                callback(colorString);
            }
            if (this.props.previousTool) this.props.previousTool.activate();
            this.props.onDeactivateEyeDropper();
            this.stopEyeDroppingLoop();
        }
    }
    startEyeDroppingLoop () {
        this.eyeDropper = new EyeDropperTool(
            this.canvas,
            paper.project.view.bounds.width,
            paper.project.view.bounds.height,
            paper.project.view.pixelRatio,
            paper.view.zoom,
            paper.project.view.bounds.x,
            paper.project.view.bounds.y,
            isBitmap(this.props.format)
        );
        this.eyeDropper.pickX = -1;
        this.eyeDropper.pickY = -1;
        this.eyeDropper.activate();

        this.intervalId = setInterval(() => {
            const colorInfo = this.eyeDropper.getColorInfo(
                this.eyeDropper.pickX,
                this.eyeDropper.pickY,
                this.eyeDropper.hideLoupe
            );
            if (!colorInfo) return;
            if (
                this.state.colorInfo === null ||
                this.state.colorInfo.x !== colorInfo.x ||
                this.state.colorInfo.y !== colorInfo.y
            ) {
                this.setState({
                    colorInfo: colorInfo
                });
            }
        }, 30);
    }
    stopEyeDroppingLoop () {
        clearInterval(this.intervalId);
        this.setState({colorInfo: null});
    }
    render () {
        return (
            <PaintEditorComponent
                canRedo={this.props.shouldShowRedo}
                canUndo={this.props.shouldShowUndo}
                canvas={this.state.canvas}
                colorInfo={this.state.colorInfo}
                format={this.props.format}
                image={this.props.image}
                imageFormat={this.props.imageFormat}
                imageId={this.props.imageId}
                isEyeDropping={this.props.isEyeDropping}
                name={this.props.name}
                rotationCenterX={this.props.rotationCenterX}
                rotationCenterY={this.props.rotationCenterY}
                rtl={this.props.rtl}
                setCanvas={this.setCanvas}
                setTextArea={this.setTextArea}
                textArea={this.state.textArea}
                zoomLevelId={this.props.zoomLevelId}
                onRedo={this.props.onRedo}
                onSwitchToBitmap={this.props.handleSwitchToBitmap}
                onSwitchToVector={this.props.handleSwitchToVector}
                onUndo={this.props.onUndo}
                onUpdateImage={this.props.onUpdateImage}
                onUpdateName={this.props.onUpdateName}
                onZoomIn={this.handleZoomIn}
                onZoomOut={this.handleZoomOut}
                onZoomReset={this.handleZoomReset}
            />
        );
    }
}

const mapStateToProps = state => ({
    changeColorToEyeDropper: state.scratchPaint.color.eyeDropper.callback,
    format: state.scratchPaint.format,
    isEyeDropping: state.scratchPaint.color.eyeDropper.active,
    mode: state.scratchPaint.mode,
    previousTool: state.scratchPaint.color.eyeDropper.previousTool,
    viewBounds: state.scratchPaint.viewBounds
});
const mapDispatchToProps = dispatch => ({
    changeMode: mode => {
        dispatch(changeMode(mode));
    },
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    handleSwitchToBitmap: () => {
        dispatch(changeFormat(Formats.BITMAP));
    },
    handleSwitchToVector: () => {
        dispatch(changeFormat(Formats.VECTOR));
    },
    removeTextEditTarget: () => {
        dispatch(setTextEditTarget());
    },
    setLayout: layout => {
        dispatch(setLayout(layout));
    },
    setSelectedItems: format => {
        dispatch(setSelectedItems(getSelectedLeafItems(), isBitmap(format)));
    },
    onDeactivateEyeDropper: () => {
        // set redux values to default for eye dropper reducer
        dispatch(deactivateEyeDropper());
    },
    updateViewBounds: matrix => {
        dispatch(updateViewBounds(matrix));
    }
});

export default UpdateImageHOC(SelectionHOC(UndoHOC(KeyboardShortcutsHOC(connect(
    mapStateToProps,
    mapDispatchToProps
)(PaintEditor)))));
