import moment from 'moment';

export default function readableTime(timestamp, fromNow = true) {
    const unixTime = moment.unix(timestamp);

    return fromNow ?  unixTime.fromNow() : unixTime.calendar();
}
