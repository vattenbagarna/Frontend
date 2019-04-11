let token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2FmNTBhMWQ5YjM5MDJiN2I0MzU5NWUiLCJ1c2VybmFtZSI6ImpvaGFuLmRqYXJ2Lmthcmx0b3JwQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJEJKL0FqL3FaSVIwbzQ5MDV1dXpGSWVnU0NQT2s1OEFxd1EyZThpdVRBNS9HVFF3RHBzUkN5IiwiaXNBZG1pbiI6ImZhbHNlIiwiaWF0IjoxNTU0OTkzMzE1fQ.jI6AlqdCq2zeYXYYpMNTzq06TA9k7JcZ4aChPkjONZQ";

// Ska skapas vid inlogg i framtiden istället
let localStorage = window.localStorage;

localStorage.setItem('token', token);

let id = new URL(window.location.href).searchParams.get('id');

/**
 * loadObject - Description
 *
 * @returns {type} Description
 */
let loadObject = () => {
    fetch(
        `http://localhost:1337/obj/id/${id}?token=${localStorage.getItem('token')}`
    )
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            let main = document.getElementsByClassName('main-wrap')[0];

            for (let key in json[0]) {
                if (key != "_id") {
                    let patt = /[A-Z][a-z]*[^A-Z]/;
                    let value = key.match(patt);
                    let result;

                    if (value != null) {
                        value = value[0];
                        result = key.replace(value, value + " ");

                        main.innerHTML +=
                            `<label for="${key}">${result}</label>
						 <input id=${key} type="text" value="${json[0][key]}">`;
                    } else {
                        main.innerHTML +=
                            `<label for="${key}">${key}</label>
					 	<input id=${key} type="text" value="${json[0][key]}">`;
                    }
                }
            }

            main.innerHTML +=
                `<br><br>
				<div class="button-wrap">
					<a id="send" class="button">SPARA</a>
				</div>`;

            document.getElementById('send').addEventListener('click', () => {
                saveObject(json);
            });
        });
};

loadObject();


/**
 * saveObject - Description
 *
 * @param {type} json Description
 *
 * @returns {type} Description
 */
let saveObject = (json) => {
    let data = "";

    for (let key in json[0]) {
        if (key != "_id") { data += `${key}=${document.getElementById(key).value}&`; }
    }

    data = data.substr(0, data.length - 1);

    //userID ?? nu = 123
    let url =
        `http://localhost:1337/obj/update/${id}/123?token=${localStorage.getItem('token')}`;

    fetch(url, {
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    }).then(res => res.json())
        .then((response) => {
            //json laddas bara in vid load och uppdateras aldrig
            console.log("changed:", JSON.stringify(response) != JSON.stringify(json));
            if (JSON.stringify(response) != JSON.stringify(json)) { alert("uppdaterad"); }
        })
        .catch(error => alert(error));
};
