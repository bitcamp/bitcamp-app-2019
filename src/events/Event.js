import { hasTimePassed, normalizeTimeLabel } from './timeUtils';

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

  get timeRangeString() {
    return this.startTimeFormatted === this.endTimeFormatted 
      ? this.startTimeFormatted
      : `from ${this.startTimeFormatted} - ${this.endTimeFormatted}`      
  }

  get clippedTitle() {
    const titleLimit = 30;

    // If the event has a title longer than the character limit, cut it off
    return (this.title && this.title.length > titleLimit)
      ? this.title.substring(0, titleLimit) + "…"
      : this.title;
  }

  // Temporary for malformed data
  get category() {
    return 'colorwar';
  }
}
