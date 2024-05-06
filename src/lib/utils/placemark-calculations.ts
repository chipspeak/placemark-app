import type { Placemark, User, DataSet } from "$lib/types/placemark-types";

const counties = [
    "Dublin",
    "Cork",
    "Galway",
    "Kerry",
    "Mayo",
    "Donegal",
    "Wicklow",
    "Wexford",
    "Clare",
    "Kildare",
    "Limerick",
    "Meath",
    "Tipperary",
    "Waterford",
    "Cavan",
    "Kilkenny",
    "Sligo",
    "Westmeath",
    "Louth",
    "Roscommon",
    "Offaly",
    "Longford",
    "Laois",
    "Leitrim",
    "Monaghan",
    "Carlow"
];

export function calculateCategoryData(placemarks: Placemark[]): DataSet {
    const categoriesTotal: DataSet = {
        labels: [],
        datasets: [{ values: [] }],
    };

    const categoryCounts = placemarks.reduce((counts, placemark) => {
        const category = placemark.category;
        counts[category] = (counts[category] || 0) + 1;
        return counts;
    }, {} as Record<string, number>);

    categoriesTotal.labels = Object.keys(categoryCounts);
    categoriesTotal.datasets[0].values = Object.values(categoryCounts);

    return categoriesTotal;
}

export function calculateCountyData(placemarks: Placemark[]): DataSet {
    const countiesTotal: DataSet = {
        labels: counties,
        datasets: [{ values: [] }],
    };

    const countyCounts = placemarks.reduce((counts, placemark) => {
        const location = placemark.location;
        counties.forEach((county) => {
            const regex = new RegExp(`\\b${county}\\b`, "gi");
            const matches = location.match(regex);
            if (matches) {
                counts[county] = (counts[county] || 0) + matches.length;
            }
        });
        return counts;
    }, {} as Record<string, number>);

    countiesTotal.datasets[0].values = countiesTotal.labels.map((county) => countyCounts[county] || 0);

    return countiesTotal;
}

export function calculatePlacemarkByUser(placemarks: Placemark[], users: User[]): DataSet {
    const userMap = new Map(users.map(user => [user._id, user]));

    const placemarksByUser: DataSet = {
        labels: [],
        datasets: [{ values: [] }],
    };

    const placemarksByUserCounts = placemarks.reduce((counts, placemark) => {
        const userId = placemark.userId;
        counts[userId] = (counts[userId] || 0) + 1;
        return counts;
    }, {} as Record<string, number>);

    Object.entries(placemarksByUserCounts).forEach(([userId, count]) => {
        const user = userMap.get(userId);
        if (user) {
            const fullName = `${user.firstName} ${user.lastName}`;
            placemarksByUser.labels.push(fullName);
            placemarksByUser.datasets[0].values.push(count);
        }
    });

    return placemarksByUser;
}




