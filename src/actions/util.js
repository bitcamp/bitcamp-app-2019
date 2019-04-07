import moment from 'moment';
import _ from 'lodash';
import Event from '../events/Event';
import EventGroup from '../events/EventGroup';
import EventDay from '../events/EventDay';

export function normalizeTimeLabel(t) {
  return moment(t).format("h:mma")
}

export function hasTimePassed(t) {
  const now = moment();
  return (now.diff(moment(t))) > 0;
}

// creates an EventGroup object from a collection of event json entries
// which have already been grouped
export function createEventGroup(eventGroupLabel, rawEventArray) {
  let eventArray = [];
  for (let i in rawEventArray) {
    rawEvent = rawEventArray[i];
    /* TODO : Change this once schedule is fixed */
    //let img =  "banner_" + rawEvent.category.toLowerCase();
    let banner_map = {
      opening_ceremony: "ceremony",
      closing_ceremony: "ceremony",
      expo_a: "demo",
      expo_b: "demo",
      colorwar: "colorwar"
    }
    let title = rawEvent.title.toLowerCase().replace(' ','_');
    let img =  "banner_" + (banner_map[title] != undefined ?
      banner_map[title]
      :
      ((Array.isArray(rawEvent.category) ? rawEvent.category[0] : rawEvent.category).toLowerCase()));
    eventArray.push(
      new Event(
        rawEvent.eventID,
        rawEvent.title,
        rawEvent.category,
        rawEvent.caption,
        rawEvent.description,
        rawEvent.startTime,
        rawEvent.endTime,
        rawEvent.featuredEvent,
        rawEvent.location,
        img
      )
    );
  }

  return new EventGroup(eventGroupLabel, eventArray);
}

// creates an EventDay object from an array of event json entries
export function createEventDay(rawEventDay) {
  dayLabel = rawEventDay[0];
  sortedEvents = rawEventDay[1].sort((event1, event2) => {
    start1 = moment(event1.startTime);
    start2 = moment(event2.startTime);

    end1 = moment(event1.endTime);
    end2 = moment(event2.endTime);

    if (start1 - start2 == 0) {
      return end1 - end2;
    }

    return start1 - start2;
  });

  groupedData = _.groupBy(sortedEvents, event => {
    return normalizeTimeLabel(event.startTime);
  });

  eventGroupLabels = Object.keys(groupedData);

  eventGroupObjs = [];
  for (let i = 0; i < eventGroupLabels.length; i++) {
    eventGroupObjs.push(
      createEventGroup(
        eventGroupLabels[i],
        groupedData[eventGroupLabels[i]]
      )
    );
  }

  return new EventDay(dayLabel, eventGroupObjs);
}
