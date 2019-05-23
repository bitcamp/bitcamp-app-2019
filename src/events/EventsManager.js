// Use this class to interact with all of the events, never modify the state directly

import { AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import moment from 'moment';
import _ from 'lodash';
import Toast from 'react-native-simple-toast';

import { createEventDay } from './utils';

const APP_ID = '@com.technica.technica18:';
const USER_TOKEN = APP_ID + 'JWT';
const EVENT_FAVORITED_STORE = APP_ID + 'EVENT_FAVORITED_STORE';
const SAVED_COUNT_STORE = APP_ID + 'SAVED_COUNT_STORE';
const EVENT_ID_PREFIX = APP_ID + 'eventNotification-';
const SCHEDULE_STORAGE_KEY = APP_ID + 'schedule';
const USER_DATA_STORE = 'USER_DATA_STORE';
const UPDATES_STORE = 'RECENT_UPDATES_STORE';


const notificationBufferMins = 15;
const savedCountRefreshInterval = 10 * 60 * 1000;

const channelId = 'technica-push-notifications';

let lastNetworkRequest = null;
let networkCallExecuting = false;

export default class EventsManager {
  constructor() {
    console.log('Initializing event manager');

    this.heartListeners = new Set();
    this.eventListeners = new Set();
    this.updatesListeners = new Set();

    this.eventDays = [];
    this.eventIDToEventMap = {};
    this.combinedEvents = [];

    this.favoriteState = {};
    // get the list of events which have been favorited
    AsyncStorage.getItem(EVENT_FAVORITED_STORE, (err, result) => {
      if (result === null) {
        this.favoriteState = {};
      } else {
        this.favoriteState = JSON.parse(result);
      }
      this.updateHearts();

      //loads the copy of the schedule on the users phone
      AsyncStorage.getItem(SCHEDULE_STORAGE_KEY, (err, result) => {
          if(result != null){
            this.processNewEvents(JSON.parse(result), false);
          }

          //after we load the local schedule we will finally add the database query listener for schedule
          firebase.database().ref('/Schedule')
            .on('value', async (snapshot) => {
              let data = snapshot.val();
              //store new schedule on phone
              AsyncStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(data), function(error){
                if (error){
                  console.log(error);
                }
              });

              this.processNewEvents(data, true);
          });
      });
    });

    this.savedCounts = {};
    AsyncStorage.getItem(SAVED_COUNT_STORE, (err, result) => {
      if(result != null) {
        this.savedCounts = JSON.parse(result);
      }

      this.fetchSavedCounts();
      this.fetchNewUserData();
      this.timer = setInterval(()=> this.fetchSavedCounts(), savedCountRefreshInterval)

      this.updateEventComponents();
      this.updateHearts();
    });
  }

  processNewEvents(rawData, rescheduleNotifications) {
    newEventDays = [];
    //repeat process of scanning through events
    for (let i in rawData) {
      newEventDays.push(createEventDay(rawData[i]));
    }
    newCombinedEvents = _.flatten(
      _.flatten(
        _.map(newEventDays, eventDay =>
          _.map(eventDay.eventGroups, eventGroup => eventGroup.events)
        )
      )
    );

    console.log('newEventDays', newEventDays);
    console.log('new combined events', newCombinedEvents);

    let changed = false;
    newCombinedEvents.forEach(newEvent => {
      const oldEvent = this.eventIDToEventMap[newEvent.eventID];
      // this event hasn't been seen yet
      if(oldEvent == null) {
        changed = true;
        this.eventIDToEventMap[newEvent.eventID] = newEvent;
      } else {
        if(!_.isEqual(oldEvent, newEvent)) {
          // if the start time has changed we need to create a new notification and delete the original one
          if(newEvent.startTime !== oldEvent.startTime
            && this.isFavorited[newEvent.eventID]
            && rescheduleNotifications) {
            this.deleteNotification(newEvent);
            this.createNotification(newEvent);
          }
          changed = true;
          
          //update Event object with new properties
          // TODO: clean this up
          oldEvent.title = newEvent.title;
          oldEvent.category = newEvent.category;
          oldEvent.description = newEvent.description;
          oldEvent.startTime = newEvent.startTime;
          oldEvent.endTime = newEvent.endTime;
          oldEvent.featured = newEvent.featured;
          oldEvent.location = newEvent.location;
          oldEvent.img = newEvent.img;
        }
      }
    });

    if(changed) {
      this.eventDays = newEventDays;
      this.combinedEvents = newCombinedEvents;
      this.updateEventComponents()
    }
  }

  processRecentUpdates(updatesArray) {

    //sort events by time descending
    sortedUpdates = _.sortBy(updatesArray, update => -moment(update.time).unix());

    this.recentUpdates = _.map(sortedUpdates, update => {
      return {
        body: update.body,
        id: update.id,
        time: moment(update.time).format("h:mma, dddd")
      }
    });

    this.updateUpdatesComponents();
  }

  fetchSavedCounts() {
    fetch("https://api.bit.camp/api/firebaseEvents/favoriteCounts")
      .then((response) => response.json())
      .then((responseJson) => {
        newSavedCount = responseJson;
        console.log("SAVED: " + responseJson);
        this.savedCounts = newSavedCount;
        //store new favorite counts on phone
        AsyncStorage.setItem(SAVED_COUNT_STORE, JSON.stringify(newSavedCount), function(error){
          if (error){
            console.log(error);
          }
        });

        this.updateEventComponents();
        this.updateHearts();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  compareUserData(oldData, newData) {
    return oldData.admin === newData.admin &&
      _.isEqual(oldData.confirmation, newData.confirmation) &&
      oldData.email === newData.email &&
      _.isEmpty(_.xor(oldData.favoritedEvents, newData.favoritedEvents)) &&
      _.isEmpty(_.xor(oldData.favoritedFirebaseEvents, newData.favoritedFirebaseEvents)) &&
      oldData.id === newData.id &&
      _.isEqual(oldData.profile, newData.profile) &&
      _.isEqual(oldData.status, newData.status)
  }

  async fetchNewUserData() {
    try {
      result = await AsyncStorage.getItem(USER_DATA_STORE);
      token = await AsyncStorage.getItem(USER_TOKEN);
      if (result != null && token != null) {
        result = JSON.parse(result);
        id = result.id;
        let response = await fetch(`https://api.bit.camp/api/users/${id}/`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        });
        let responseJson = await response.json();
        console.log(responseJson);
        if(response.status == 200){
          console.log({result});
          console.log({responseJson});
          if (!this.compareUserData(result, responseJson)) {
            Toast.show("Your user information is out of date! Please log out and log in again.", Toast.LONG);
          }
        }
      }
    }
    catch(error) {
      console.log(error);
      Toast.show("Error grabbing new user data.");
    }
    this.updateHearts();
    this.updateEventComponents();
  }

  getEventDays() {
    return this.eventDays;
  }

  getTopEvents() {
    topSorted = _.sortBy(
      this.combinedEvents,
      event => -this.getSavedCount(event.eventID)
    );

    return topSorted.slice(0, 10);
  }

  getFeaturedEvents() {
    return _.filter(this.combinedEvents, event => event.featured);
  }

  getHappeningNow() {
    var currentDateTime = moment(moment().format("YYYY-MM-DD HH:mm"));
    return events = _.filter(this.combinedEvents, event => currentDateTime.isBetween(moment(event.startTime), moment(event.endTime)));
  }

  getSavedEventsArray() {
    return _.filter(
      this.combinedEvents,
      event => this.favoriteState[event.eventID]
    );
  }

  getUpdates() {
    return this.recentUpdates;
  }

  isFavorited(key) {
    return this.favoriteState[key];
  }

  //key of event
  // time in minutes to warn before event
  async favoriteEvent(eventID, refreshSaved) {

    if (lastNetworkRequest != null && moment().seconds() == lastNetworkRequest.seconds() || networkCallExecuting) {
      Toast.show('You have favorited or unfavorited an event too soon. Please try later.');
      return;
    }
    lastNetworkRequest = moment();
    await AsyncStorage.getItem(USER_DATA_STORE, (err, result) => {
      AsyncStorage.getItem(USER_TOKEN, (err, token) => {
        id = JSON.parse(result).id;
        let response = fetch(`https://api.bit.camp/api/users/${id}/favoriteFirebaseEvent/${eventID}`, {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json',
            'x-access-token': token,
          }),
          body: JSON.stringify({
            firebaseId: eventID,
            userId: id
          })
        }).then((myJson) => {
          if (myJson.status == 200) {
            this.favoriteState[eventID] = true;
            this.savedCounts[eventID] = this.getSavedCount(eventID) + 1;
            updateObj = {};
            updateObj[eventID] = true;
            AsyncStorage.mergeItem(EVENT_FAVORITED_STORE, JSON.stringify(updateObj));
            event = this.eventIDToEventMap[eventID];
            this.createNotification(event);

            this.updateHearts();
            console.log(this);
            //this.updateEventComponents();
            networkCallExecuting = false;

          } else {
            Toast.show('Could not unfavorite this event. Please try again.');
          }
        });
      });
    });
    this.updateHearts();
  }

  unfavoriteEvent(eventID, refreshSaved) {

    if (lastNetworkRequest != null && moment().seconds() == lastNetworkRequest.seconds() || networkCallExecuting) {
      Toast.show('You have favorited or unfavorited an event too soon. Please try later.');
      return;
    }
    lastNetworkRequest = moment();
    AsyncStorage.getItem(USER_DATA_STORE, (err, result) => {
      AsyncStorage.getItem(USER_TOKEN, (err, token) => {

        id = JSON.parse(result).id;

        fetch(`https://api.bit.camp/api/users/${id}/unfavoriteFirebaseEvent/${eventID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
          body: JSON.stringify({
            firebaseId: eventID,
            userId: id
          })
        }).then((myJson) =>  {
          if (myJson.status == 200) {
            this.favoriteState[eventID] = false;
            this.savedCounts[eventID]= this.getSavedCount(eventID) - 1;
            updateObj = {};
            updateObj[eventID] = false;
            AsyncStorage.mergeItem(EVENT_FAVORITED_STORE, JSON.stringify(updateObj));

            event = this.eventIDToEventMap[eventID];
            this.deleteNotification(event);
            this.updateHearts();
            console.log(this);
            //this.updateEventComponents();
            networkCallExecuting = false;
          } else {
            Toast.show('Could not unfavorite this event. Please try again.');
          }
        });
      });
    })
    this.updateHearts();
  }

  createNotification(event) {
    if(event.hasPassed) {
      Toast.show('This event has ended.');
    } else if (event.hasBegun) {
      Toast.show("This event is currently in progress");
    } else {

      let notification = new firebase.notifications.Notification()
        .setNotificationId(EVENT_ID_PREFIX + event.eventID)
        .setTitle(event.title)
        .setBody(notificationBufferMins + ' minutes until event starts.');

      notification.android
        .setChannelId(channelId)
        .android.setSmallIcon('ic_launcher');

      firebase.notifications().scheduleNotification(notification, {
        fireDate: moment(event.startTime)
          .subtract(notificationBufferMins, 'minutes')
          .valueOf()
      });

      Toast.show('You will be notified 15 min before this event.');
    }
  }

  deleteNotification(event) {
    if(! event.hasBegun) {
      Toast.show('You will no longer be notified about this event.');
    }

    firebase
      .notifications()
      .cancelNotification(EVENT_ID_PREFIX + event.eventID.toString());
  }

  getSavedCount(key) {
    return this.savedCounts[key] == null ? 0 : this.savedCounts[key];
  }

  registerHeartListener(component) {
    this.heartListeners.add(component);
  }

  removeHeartListener(component) {
    this.heartListeners.delete(component);
  }

  updateHearts() {
    this.heartListeners.forEach((component, comp, set) => {
      if (component != null) {
        component.forceUpdate();
      }
    });
  }

  registerEventChangeListener(component) {
    this.eventListeners.add(component);
  }

  removeEventChangeListener(component) {
    this.eventListeners.delete(component);
  }

  updateEventComponents() {
    this.eventListeners.forEach((component, comp, set) => {
      if (component != null) {
        component.forceUpdate();
      }
    });
  }

  registerUpdatesListener(component) {
    this.updatesListeners.add(component);
  }

  removeUpdatesListener(component) {
    this.updatesListeners.delete(component);
  }

  updateUpdatesComponents() {
    this.updatesListeners.forEach((component, comp, set) => {
      if (component != null) {
        component.forceUpdate();
      }
    })
  }
}
