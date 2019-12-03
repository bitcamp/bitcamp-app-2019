import { getDeviceWidth, getDeviceHeight } from "./sizing";

/* Scaling code taken from https://blog.solutotlv.com/size-matters */

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = size => getDeviceWidth() / guidelineBaseWidth * size;
const verticalScale = size => getDeviceHeight() / guidelineBaseHeight * size;
const moderateScale = (size, factor = 0.5) => size + ( scale(size) - size ) * factor;

export {scale, verticalScale, moderateScale};