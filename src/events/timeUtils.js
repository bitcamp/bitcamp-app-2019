import moment from "moment";

// These functions were stripped from the standard utils file to avoid circular dependencies
export function normalizeTimeLabel(t) {
  return moment(t).format("h:mma");
}

export function hasTimePassed(t) {
  const now = moment();
  return now.diff(moment(t)) > 0;
}
