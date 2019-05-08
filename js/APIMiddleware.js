/**
 * API - contains get and post methods to specified url that uses fetch calls.
 * 		 This replaces repeated fetch code with a simple function call instead.
 * 		 API methods needs to be reached across several files
 *
 * @returns {json} always returns response.json() data from backend
 */
const API = {
    get: async (url) => {
        await fetch(url)
            .then(response => response.json())
            .then((json) => {
                if (json.info == "token failed to validate") {
                    localStorage.removeItem('token');
                    document.location.href = "index.html";
                    return false;
                }
                return json;
            });
    },

    post: async (url, contentType, data) => {
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": contentType, },
            body: data,
        })
            .then(response => response.json())
            .then((json) => {
                if (json.info == "token failed to validate") {
                    localStorage.removeItem('token');
                    document.location.href = "index.html";
                    return false;
                }
                return json;
            });
    }
};

API;
