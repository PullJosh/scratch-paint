/* DO NOT EDIT
@todo This file is copied from GUI and should be pulled out into a shared library.
See https://github.com/LLK/scratch-paint/issues/13 */

import React from 'react';

const getRandomColor = (function () {
    // In "DEBUG" mode this is used to output a random background color for each
    // box. The function gives the same "random" set for each seed, allowing re-
    // renders of the same content to give the same random display.
    const random = (function (seed) {
        let mW = seed;
        let mZ = 987654321;
        const mask = 0xffffffff;
        return function () {
            mZ = ((36969 * (mZ & 65535)) + (mZ >> 16)) & mask;
            mW = ((18000 * (mW & 65535)) + (mW >> 16)) & mask;
            let result = ((mZ << 16) + mW) & mask;
            result /= 4294967296;
            return result + 1;
        };
    }(601));
    return function () {
        const r = Math.max(parseInt(random() * 100, 10) % 256, 1);
        const g = Math.max(parseInt(random() * 100, 10) % 256, 1);
        const b = Math.max(parseInt(random() * 100, 10) % 256, 1);
        return `rgb(${r},${g},${b})`;
    };
}());

interface BoxProps {
    /** Defines how the browser distributes space between and around content items vertically within this box. */
    alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch';

    /** Defines how the browser distributes space between and around flex items horizontally within this box. */
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

    /** Specifies how this box should be aligned inside of its container (requires the container to be flexable). */
    alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

    /** Specifies the initial length of this box */
    basis?: number | 'auto';

    /** Specifies the the HTML nodes which will be child elements of this box. */
    children?: React.ReactNode;

    /** Specifies the class name that will be set on this box */
    className?: string;

    /**
     * A callback function whose first parameter is the underlying dom elements.
     * This call back will be executed immediately after the component is mounted or unmounted
     */
    componentRef?: (instance: Element) => void;

    /** https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction */
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';

    /** Specifies the type of HTML element of this box. Defaults to div. */
    element?: string;

    /** Specifies the flex grow factor of a flex item. */
    grow?: number;

    /** The height in pixels (if specified as a number) or a string if different units are required. */
    height?: number | string;

    /** https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content */
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';

    /** Specifies the flex shrink factor of a flex item. */
    shrink?: number;

    /** An object whose keys are css property names and whose values correspond the the css property. */
    style?: React.CSSProperties;

    /** The width in pixels (if specified as a number) or a string if different units are required. */
    width?: number | string;

    /** How whitespace should wrap within this block. */
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
}

const Box = (props: BoxProps) => {
    const {
        alignContent,
        alignItems,
        alignSelf,
        basis,
        children,
        className,
        componentRef,
        direction,
        element = 'div',
        grow,
        height,
        justifyContent,
        width,
        wrap,
        shrink,
        style = {},
        ...componentProps
    } = props;
    return React.createElement(element, {
        className: className,
        ref: componentRef,
        style: Object.assign(
            {
                alignContent: alignContent,
                alignItems: alignItems,
                alignSelf: alignSelf,
                flexBasis: basis,
                flexDirection: direction,
                flexGrow: grow,
                flexShrink: shrink,
                flexWrap: wrap,
                justifyContent: justifyContent,
                width: width,
                height: height
            },
            process.env.DEBUG ? { // eslint-disable-line no-undef
                backgroundColor: getRandomColor(),
                outline: `1px solid black`
            } : {},
            style
        ),
        ...componentProps
    }, children);
};

export default Box;
