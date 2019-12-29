import { mockSchedule } from "./schedule";
import { mockFavoriteCounts } from "./favoriteCounts";
import { mockUser } from "./user";
import { mockQuestions } from "./questions";

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
  try {
    const respData = getResponse(uri);
    return {
      json: async () => respData,
      status: 200,
      statusText: "OK",
      ok: true
    };
  } catch (e) {
    console.error(e);
  }
};

// These objects store the different types
const apiURL = "https://api.bit.camp";
const questionServerURL = "https://guarded-brook-59345.herokuapp.com";
const requestTypes = {
  getUser: {
    uriPattern: new RegExp(`${apiURL}/api/users/\\d+/?`),
    data: mockUser
  },
  favoriteEvent: {
    uriPattern: new RegExp(
      `${apiURL}/api/users/\\d+/favoriteFirebaseEvent/\\d+/?`
    ),
    data: mockFavoriteCounts
  },
  unfavoriteEvent: {
    uriPattern: new RegExp(
      `${apiURL}/api/users/\\d+/unfavoriteFirebaseEvent/\\d+/?`
    ),
    data: mockFavoriteCounts
  },
  favoriteCounts: {
    uriPattern: new RegExp(`${apiURL}/api/firebaseEvents/favoriteCounts/?`),
    data: mockFavoriteCounts
  },
  requestEmailCode: {
    uriPattern: new RegExp(`${apiURL}/auth/login/requestCode/?`),
    data: {} // No data needed (getting a 200 status code will run the correct logic)
  },
  submitEmailCode: {
    uriPattern: new RegExp(`${apiURL}/auth/login/code/?`),
    data: {
      user: mockUser,
      token: "test"
    }
  },
  getQuestions: {
    uriPattern: new RegExp(`${questionServerURL}/getquestions/.+@.+\\..+/?`),
    data: mockQuestions
  },
  submitQuestion: {
    uriPattern: new RegExp(`${questionServerURL}/question/?`),
    data: {} // No data needed (getting a 200 status code will run the correct logic)
  },
  checkInWithQRCode: {
    uriPattern: new RegExp(`${apiURL}/api/users/\\d+/checkIn/?`),
    data: {} // No data needed (getting a 200 status code will run the correct logic)
  },
  schedule: {
    uriPattern: /schedule/,
    data: mockSchedule
  }
};

/**
 * Gives back the response data corresponding to the supplied URI
 * @param uri The URI of the API call
 * @returns The data corresponding to the given URI
 */
const getResponse = uri => {
  // Go through all request types and return the corresponding data
  for (let type in requestTypes) {
    const request = requestTypes[type];

    if (request.uriPattern.test(uri)) {
      return request.data;
    }
  }

  // Otherwise, print that there was an error
  throw new Error(`Unsupported Request URI: ${uri}`);
};
