const DEVICE_DIMENSIONS = require('Dimensions').get('window');

const getDeviceDimensions = () => DEVICE_DIMENSIONS;
const getDeviceWidth = () => DEVICE_DIMENSIONS.width;
const getDeviceHeight = () => DEVICE_DIMENSIONS.height;

/* Returns the height of an image given its width. Preserves a 38x67 aspect ratio */
const getImageHeight = (imageWidth=getDeviceWidth()) => Math.round((imageWidth * 38) / 67);

export { getDeviceDimensions, getDeviceWidth, getDeviceHeight, getImageHeight };