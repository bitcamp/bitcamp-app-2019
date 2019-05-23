import { hasTimePassed, normalizeTimeLabel } from './utils';

export default class Event {
  constructor(
    eventID,
    title,
    category,
    caption,
    description,
    startTime,
    endTime,
    featured,
    location,
    img
  ) {
    this.eventID = eventID;
    this.title = title;
    this.category = category;
    this.caption = caption;
    this.description = description;
    this.startTime = startTime;
    this.endTime = endTime;
    this.featured = featured;
    this.location = location;
    this.img = img;
  }

  get startTimeFormatted() {
    return normalizeTimeLabel(this.startTime)
  }

  get endTimeFormatted() {
    return normalizeTimeLabel(this.endTime);
  }

  get hasPassed() {
    return hasTimePassed(this.endTime);
  }

  get hasBegun() {
    return hasTimePassed(this.startTime);
  }
}
