export const TimeUnits = {
    // Return from seconds to ms:
    fromSecondsToMS: function(seconds: number): number {
        // 1 sec = 1000 ms;
        return seconds * 1000;
    },

    // Return from minutes to seconds to ms:
    fromMinutesToMS: function(minutes: number): number {
        // 1 minute = 60 sec;
        return this.fromSecondsToMS(minutes * 60);
    },

    // Return from hours to minutes to seconds to ms:
    fromHoursToMS: function(hours: number): number {
        // 1 hour = 60 minutes;
        return this.fromMinutesToMS(hours * 60);
    },

    fromDaysToMS: function(days: number): number {
        // 1 day = 24 hours;
        return this.fromHoursToMS(days * 24);
    }
}