/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */



// Utility function to construct the icon URL
export function getIconUrl(iconCode: string): string {
    const iconBaseUrl = "http://openweathermap.org/img/wn/";
    return `${iconBaseUrl}${iconCode}@4x.png`;
}
