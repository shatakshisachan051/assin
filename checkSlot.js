const jsonAvailble = require('./availbility.json');
const convertIntoMint = require('./convertIntoMint');
const formatDate = require('./formatDate');

var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function checkSlot(date, time, dayIndex) {

    let day = days[dayIndex];

    const slotsInDay = jsonAvailble.availabilityTimings[day];

    let i;
    for (i = 0; i < slotsInDay.length; i++) {
        let slot = slotsInDay[i];
        let start = slot.start;
        let end = slot.end;

        let startingSlot = convertIntoMint(start);
        let endingSlot = convertIntoMint(end);

        let askingTime = convertIntoMint(time);

        if (askingTime < endingSlot && askingTime >= startingSlot) {
            return { isAvailable: true };

        } else if (askingTime < startingSlot) {
            return {
                isAvailable: false, nextAvailableSlot: {
                    date: date,
                    time: start
                }
            }
        }
    }

    dayIndex++;
    let numberOfDaysChecked = 0

    while (numberOfDaysChecked <= 7) {
        numberOfDaysChecked++;
        dayIndex = dayIndex % 7;
        var parts = date.split('-');

        var dateObj = new Date(parts[0], parts[1] - 1, parts[2]);

        dateObj.setDate(dateObj.getDate() + 1);
        date = formatDate(dateObj);

        let slot = jsonAvailble.availabilityTimings[days[dayIndex]];

        if (slot.length === 0) {
            dayIndex++;
            continue;
        }
        let start = slot[0].start;
        return {
            isAvailable: false, nextAvailableSlot: {
                date: date,
                time: start
            }
        }
    }

    return { isAvailable: false };

};

module.exports =  checkSlot;