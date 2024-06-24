export class Utils {
    /**
     * Formats a Date object into a string in the format 'YYYY-MM-DD'.
     *
     * @param {Date} date - The date to format.
     * @returns {string} The formatted date string.
     */
    static formatDate(date) {
        return date.toISOString().substring(0, 10);
    }
}