export async function postMethod(url, data) {
    console.log("Sending POST to:", url);
    console.log("Payload:", data);

    try {
        const response = await fetch(url, {
            method: 'POST',
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
        console.error(`Error in postMethod: ${err.message}`);
        throw err;
    }
}

export async function patchMethod(url, data) {
    console.log("Sending POST to:", url);
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