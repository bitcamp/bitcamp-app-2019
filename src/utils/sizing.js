const DEVICE_DIMENSIONS = require('Dimensions').get('window');

const getDeviceDimensions = () => DEVICE_DIMENSIONS;
const getDeviceWidth = () => DEVICE_DIMENSIONS.width;
const getDeviceHeight = () => DEVICE_DIMENSIONS.height;

export { getDeviceDimensions, getDeviceWidth, getDeviceHeight };