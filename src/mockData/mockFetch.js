// import { mockSchedule } from './schedule';

/**
 * 
 * A stand-in for the standard fetch() function that returns a barebones
 * API response using dummy data. 
 * 
 * TODO: phase this function out once the app's backend is setup
 * 
 * @param {*} uri The data you want to retrieve
 * @param {*} options The options (currently unused)
 * @returns a promise that returns a Response object with a 200 status.
 * To access the response data, call the object's .json() method
 */
export const mockFetch = async (uri, options) => {
    const respData = getResponse(uri);
    return {
        json: () => respData,
        status: 200,
        statusText: 'OK',
        ok: true,
    };
};

// These objects store the different types 
const apiURL = 'https://api.bit.camp';
const questionServerURL = "https://guarded-brook-59345.herokuapp.com";
const requestTypes = {
    getUsers: {
        uriPattern: new RegExp(`${apiURL}/api/users/\d+/`),
        data: { testObj: 'Hi' }
    },
    favoriteEvent: {
        uriPattern: new RegExp(`${apiURL}/api/users/\d+/favoriteFirebaseEvent/\d+`),
        data: { testObj: 'Hi' }
    },
    unfavoriteEvent: {
        uriPattern: new RegExp(`${apiURL}/api/users/\d+/unfavoriteFirebaseEvent/\d+`),
        data: { testObj: 'Hi' }
    },
    favoriteCounts: {
        uriPattern: new RegExp(`${apiURL}/api/firebaseEvents/favoriteCounts`),
        data: { testObj: 'Hi' }
    },
    requestEmailCode: {
        uriPattern: new RegExp(`${apiURL}/auth/login/requestCode`),
        data: { testObj: 'Hi' }
    },
    submitEmailCode: {
        uriPattern: new RegExp(`${apiURL}/auth/login/code`),
        data: { testObj: 'Hi' }
    },
    getQuestions: {
        uriPattern: new RegExp(`${questionServerURL}/getquestions/.+@.+\..+`),
        data: { testObj: 'Hi' }
    },
    submitQuestion: {
        uriPattern: new RegExp(`${questionServerURL}/question`),
        data: { testObj: 'Hi' }
    },
    checkInWithQRCode: {
        uriPattern: new RegExp(`${apiURL}/api/users/\d+/checkIn`),
        data: { testObj: 'Hi' },
    }
};

/**
 * Gives back the response data corresponding to the supplied URI
 * @param uri The URI of the API call
 * @returns The data corresponding to the given URI
 */
const getResponse = (uri) => {
    // Go through all request types and return the corresponding data
    for (let type in requestTypes) {
        const request = requestTypes[type];

        if (request.uriPattern.test(uri)) {
            return request.data;
        }
    }

    // Otherwise, print that there was an error
    console.error(`Unsupported Request URI: ${uri}`);
}