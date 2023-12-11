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

// reformulate items in order schema 
export function reformulateItems(items) {
    let data = []
    for (let i = 0; i < items.length; i++) {
        const optionsGroup = []
        for (let j = 0; j < items[i].options.length; j++) {
            const option = {
                _id: items[i].options[j]._id,
                id: items[i].options[j].id,
                name: items[i].options[j].name,
                price: items[i].options[j].price,
            }
            const idExistsIndex = optionsGroup.findIndex(item => item.optionGroupeId === items[i].options[j].optionGroupeId);
            if (idExistsIndex === -1) {
                optionsGroup.push({
                    optionGroupeId: items[i].options[j].optionGroupeId,
                    optionGroupeName: items[i].options[j].optionGroupeName,
                    options: [option]
                });
            } else {
                optionsGroup[idExistsIndex].options.push(option);
            }
        }
        data.push({
            id: items[i].id,
            _id: items[i]._id,
            name: items[i].name,
            description: items[i].description,
            price: items[i].price,
            quantity: items[i].quantity,
            tax: items[i].tax,
            optionsGroup: optionsGroup
        })
    }
    return data
}
