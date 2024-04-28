import type { Placemark, DataSet } from "$lib/types/placemark-types";

export function calculateCategoryData(placemarks: Placemark[]): DataSet {
    const categoriesTotal: DataSet = {
        labels: [],
        datasets: [{ values: [] }],
    };

    // Calculate category counts
    const categoryCounts = placemarks.reduce((counts, placemark) => {
        const category = placemark.category;
        counts[category] = (counts[category] || 0) + 1;
        return counts;
    }, {} as Record<string, number>);

    // Update chart data
    categoriesTotal.labels = Object.keys(categoryCounts);
    categoriesTotal.datasets[0].values = Object.values(categoryCounts);

    return categoriesTotal;
}