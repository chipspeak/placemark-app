/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { currentSession } from '$lib/stores';

export async function fetchSessionData() {
    try {
        // Make an API call to fetch the latest session data from the server
        const response = await fetch('/api/getSession');
        const sessionData = await response.json();
        
        // Update the session store with the fetched data
        currentSession.set(sessionData);
    } catch (error) {
        console.error('Failed to fetch session data:', error);
    }
}



// Utility function to construct the icon URL
export function getIconUrl(iconCode: string): string {
    const iconBaseUrl = "http://openweathermap.org/img/wn/";
    return `${iconBaseUrl}${iconCode}@4x.png`;
}
