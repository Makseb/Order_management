import { format, differenceInSeconds, parse, addSeconds } from 'date-fns';

export function getDifference(startTimeParam) {
    // start time
    const startTime = parse(startTimeParam, 'HH:mm:ss', new Date());

    // Add 180 seconds to the start time
    const newTime = addSeconds(startTime, 180);

    // Get the current time in HH:mm:ss format
    const currentTimeString = format(new Date(), 'HH:mm:ss');

    // Parse the current time string into a Date object
    const currentTime = parse(currentTimeString, 'HH:mm:ss', new Date());

    // Calculate the difference in seconds
    const difference = differenceInSeconds(newTime, currentTime);

    return difference

}