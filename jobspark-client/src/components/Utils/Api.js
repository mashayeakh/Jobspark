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
