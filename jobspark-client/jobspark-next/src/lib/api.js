const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function postMethod(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
            return { success: false, status: response.status, message: result.message || 'Error' };
        }
        return result;
    } catch (err) {
        console.error(`Error in postMethod: ${err.message}`);
        return { success: false, message: err.message || 'Failed to fetch' };
    }
}

export async function patchMethod(url, data) {
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return result;
    } catch (err) {
        console.error(`Error in patchMethod: ${err.message}`);
        throw err;
    }
}

export async function getMethod(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return result;
    } catch (err) {
        console.error(`Error in getMethod: ${err.message}`);
        throw err;
    }
}

export async function fetchLocations(query) {
    const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(query)}&limit=10`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_API_KEY || '',
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
            },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.data.map(city => `${city.city}, ${city.countryCode}`);
    } catch (err) {
        console.error(`Error fetching locations: ${err.message}`);
        return [];
    }
}
