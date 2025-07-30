export async function postMethod(url, data) {
    console.log("Sending POST to:", url);
    console.log("Payload:", data);

    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',  // <-- add this line
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log("RESUL ", result);
        if (!response.ok) {
            // Instead of throwing, just return the error info so frontend can handle it
            return { success: false, status: response.status, message: result.message || 'Error' };
        }
        return result;
    } catch (err) {
        console.error(`Error in postMethod: ${err.message}`);
        return { success: false, message: err.message || 'Failed to fetch' };
    }
}

export async function patchMethod(url, data) {
    console.log("Sending Patch to:", url);
    console.log("Payload:", data);

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
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
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return result;
    } catch (err) {
        console.error(`Error in patchMethod: ${err.message}`);
        throw err;
    }
}

//* for auto suggested loction from rapid api
export async function fetchLocations(query) {
    const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(query)}&limit=10`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '54c813caebmshf2c97ab2d7830f8p1b78e5jsn42caf20b9ef6',
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Return an array of formatted city strings like "City, Country"
        return data.data.map(city => `${city.city}, ${city.countryCode}`);

    } catch (err) {
        console.error(`Error fetching locations: ${err.message}`);
        return [];
    }
}
