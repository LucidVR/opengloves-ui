const basePath = "http://localhost:18080";

export const makeHTTPRequest = async (url, method = "POST", body) => {
    console.log(JSON.stringify(body));
    return fetch(basePath + "/" + url, {
        method,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'
    }).then(response => {
        return response.json();
    });
}