
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2FjN2I4M2ZlZTg"
+ "xMDg1YzdkMDI0Y2EiLCJ1c2VybmFtZSI6Imt2YWtvZEBnbWFpbC5jb20iLCJwYXNzd29yZCI6Ii"
+ "QyYiQxMCRwODRKVGVVNmtsWjNPMVhTU0VuSDMuQTlnSGJsOGd6ZVl5YWcwVGVteS4zOThveHFBMD"
+ "hmRyIsImlzQWRtaW4iOiJmYWxzZSIsImlhdCI6MTU1NDgwNzc0MH0.kifB6_hfqZ3_zJpnFsWLo"
+ "CbMPiqF0rX8mm50OePZ06o";

let button = document.getElementById("addButton");

let x = 1;

button.addEventListener("click", () => {
    var selectArray = ["Sebastian", "Johan", "Axel", "Filip", "Erik", "Vidar"];
    var optionArray = ["Läsbehörighet", "Skrivbehörighet"];

    var selectUser = document.createElement("select");

    selectUser.setAttribute("id", "accessSelect");

    var newField = document.getElementById("newField");
    var h = document.createElement("h3");
    var t = document.createTextNode("Person " + x + ":");

    h.appendChild(t);
    newField.appendChild(h);
    x = x + 1;

    newField.appendChild(selectUser);

    for (var i = 0; i < selectArray.length; i++) {
        var option = document.createElement("option");

        option.setAttribute("value", selectArray[i]);
        option.text = selectArray[i];
        selectUser.appendChild(option);
    }

    var selectCompetence = document.createElement("select");

    selectCompetence.setAttribute("id", "accessCompetence");

    newField.appendChild(selectCompetence);

    for (i = 0; i < optionArray.length; i++) {
        option = document.createElement("option");

        option.setAttribute("value", optionArray[i]);
        option.text = optionArray[i];
        selectCompetence.appendChild(option);
    }
});

/**
 * createNewProject - Creates a new project and send it to the backend database with fetch.
 *
 * @returns {void}
 */
let createNewProject = () => {
    let projectName = document.getElementById("projectName").value;

    let data = "name=" + projectName + "&version=1.0";

    let url = "http://localhost:1337/proj/insert/" + token + "?token=" + token;

    fetch(url, {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(res => res.json())
        .then(response =>  location.href = "map.html?id=" + response[response.length - 1]._id)
        .catch(error => console.error('Error:', error));
};

let createProjectButton = document.getElementById("createProjectButton");

createProjectButton.addEventListener("click", () => {
    createNewProject();
});
