let result;
/**
 * API - Description
 *
 * @returns {type} Description
 */
const API = {
    get: async (url) => {
        await fetch(url)
            .then(response => response.json())
            .then((json) => {
                if (!json.error) {
                    result = json;
                } else {
                    if (json.info == "token failed to validate") {
                        localStorage.removeItem('token');
                        document.location.href = "index.html";
                    } else {
                        console.log(json);
                    }
                }
            });
        return result;
    },

    post: async (url, contentType, data) => {
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": contentType,
            },
            body: data,
        })
            .then(response => response.json())
            .then((json) => {
                result = json;
            });
        return result;
    }
};

API;
