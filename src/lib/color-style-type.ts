import GradientTypes from './gradient-types';

export default interface ColorStyleType {
    primary: string;
    secondary: string;
    gradientType: keyof typeof GradientTypes;
};
