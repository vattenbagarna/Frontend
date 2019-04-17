/* eslint-disable max-len, no-unused-vars, no-undef */
let token = localStorage.getItem("token");
let projectId = new URL(window.location.href).searchParams.get("id");
let usernameObj = {};
let usernameArray = [];
let userIdArray = [];
let optionArray = ["Läsbehörighet", "Skrivbehörighet"];
let optionArrayValue = ["r", "w"];
let deleteButtonNumber = 0;
let creatorUserArray = [];

/**
 * getAllUsers - Fetches all users from the database and creates a
 * username object, username and userID array.
 *
 * @returns {json}
 */
let getAllUsers = () => {
    let url = "http://localhost:1337/user/all?token=" + token;

    //Fetches all users from database
    fetch(url, {
        method: 'GET',
    }).then(response => {
        return response.json();
    }).then((json) => {
        for (var i = 0; i < json.length; i++) {
            usernameObj[json[i].id] = json[i].username;
            usernameArray.push(json[i].username);
            userIdArray.push(json[i].id);
        }
    });
};

/**
 * getProject - Fetches a specific project by providing projectID
 *
 * @returns {json}
 */
let getProject = () => {
    let url = "http://localhost:1337/proj/id/" + projectId + "?token=" + token;

    //fetch to get project
    fetch(url, {
        method: 'GET',
    }).then(response => {
        return response.json();
    }).then((json) => {
        //creates an array(creatorUserArray) with the creator of the projects values which needs
        //to be sent to the DB everytime it updates
        creatorUserArray.push(json[0].access[0].userID);
        creatorUserArray.push(json[0].access[0].permission);
        creatorUserArray.push(json[0].access[0].creator);
        //sets the form values to the projects name and version
        document.getElementById("projectName").value = json[0].name;
        document.getElementById("projectVersion").value = json[0].version;

        //loops through the amount of users given access starting on 1 as the
        //first place is the creator
        for (var i = 1; i < json[0].access.length; i++) {
            //creates the select element
            var selectUser = document.createElement("select");

            selectUser.setAttribute("class", "accessSelect");

            var newField = document.getElementById("newField");
            var h = document.createElement("h3");

            newField.appendChild(h);
            //appends select element
            newField.appendChild(selectUser);

            var option = document.createElement("option");

            //sets the value and text of the select element
            option.setAttribute("value", json[0].access[i].userID);
            option.text = json[0].access[i].username;
            selectUser.appendChild(option);

            //create another select element
            var selectCompetence = document.createElement("select");

            //give it the class accessCompetence
            selectCompetence.setAttribute("class", "accessCompetence");

            //append element
            newField.appendChild(selectCompetence);
            let accessData = json[0].access[i];

            //checks what permission the current user has and adds it first in
            //the select and then also adds the second value so the user can
            //change permissions
            if (accessData.permission == "r") {
                createSelect(accessData.permission, "Läsbehörighet", selectCompetence);
                createSelect("w", "Skrivbehörighet", selectCompetence);
            } else if (accessData.permission == "w") {
                createSelect(accessData.permission, "Skrivbehörighet", selectCompetence);
                createSelect("r", "Läsbehörighet", selectCompetence);
            }

            //adds the remove button to remove user which has been given access
            addRemoveButtons();
        }
    });
};

/**
 * addRemoveButtons - Adds the buttons which remove users from newproject.html
 *
 * @returns {void}
 */
let addRemoveButtons = () => {
    //Creates an a tag with a div wrapped around it which forms a button
    let deleteDiv = document.createElement("div");

    deleteDiv.setAttribute("class", "button-wrap removeDiv");
    let deleteATag = document.createElement("a");

    deleteATag.setAttribute("class", "button buttonNumber");
    //Gives the button a value so it knows which user to remove when clicked
    deleteATag.setAttribute("value", deleteButtonNumber);
    deleteATag.innerHTML = "Ta bort";
    deleteDiv.appendChild(deleteATag);
    //Appends button to existing div
    newField.appendChild(deleteDiv);

    deleteButtonNumber = deleteButtonNumber + 1;

    //Adds an eventListener to each button which removes the two select elements
    //from newproject.html in turn also removes them from being added to db
    deleteDiv.addEventListener("click", (event) => {
        //sets the button numbers again when button is clicked so correct user
        //is removed
        setButtonNumber();
        //gets the value of the button
        let which = event.target.attributes[1].nodeValue;
        //gets the html elements
        let selectAccess = document.getElementsByClassName("accessSelect");
        let selectCompetence = document.getElementsByClassName("accessCompetence");
        let removeDiv = document.getElementsByClassName("removeDiv");
        //removes the select elements and the button itself

        removeDiv[which].remove();
        selectAccess[which].remove();
        selectCompetence[which].remove();
    });
};

/**
 * setButtonNumber - sets the button number for the remove buttons
 *
 * @returns {void}
 */
let setButtonNumber = () => {
    //gets all buttons
    let buttonNumber = document.getElementsByClassName("buttonNumber");

    //loops all buttons and adds a number to its value
    for (var i = 0; i < buttonNumber.length; i++) {
        buttonNumber[i].setAttribute("value", i);
    }
};

//Gets the HTML element for the button to add users
let button = document.getElementById("addButton");

//adds eventListener to add users(behörigheter) button
button.addEventListener("click", () => {
    //All this code adds the select elements and the button to remove them.
    var selectUser = document.createElement("select");

    selectUser.setAttribute("class", "accessSelect");

    var newField = document.getElementById("newField");

    newField.appendChild(selectUser);

    for (var i = 0; i < usernameArray.length; i++) {
        var option = document.createElement("option");

        option.setAttribute("value", userIdArray[i]);
        option.text = usernameArray[i];
        selectUser.appendChild(option);
    }

    var selectCompetence = document.createElement("select");

    selectCompetence.setAttribute("class", "accessCompetence");

    newField.appendChild(selectCompetence);

    for (i = 0; i < optionArray.length; i++) {
        option = document.createElement("option");

        option.setAttribute("value", optionArrayValue[i]);
        option.text = optionArray[i];
        selectCompetence.appendChild(option);
    }

    addRemoveButtons();
});

/**
 * updateProject - updates the project with the new values from the form
 *
 * @returns {void}
 */
let updateProject = () => {
    //gets all the values from the form and the selects
    let projectName = document.getElementById("projectName").value;
    let projectVersion = document.getElementById("projectVersion").value;
    let peoplePerHouse = document.getElementById("peopleperhouse").value;
    let litrePerPerson = document.getElementById("litreperperson").value;
    let accessUser = document.getElementsByClassName("accessSelect");
    let accessCompetence = document.getElementsByClassName("accessCompetence");
    let accessData = "";

    //string which will be used to send values to the db, it contains the values
    //for the creator of the project
    accessData = "&access[0][creator]=" + creatorUserArray[2] + "&access[0][permission]=" + creatorUserArray[1] + "&access[0][userID]=" + creatorUserArray[0];

    //adds the rest of the access data to a string
    for (var i = 1; i < accessUser.length + 1; i++) {
        accessData += `&access[${i}][creator]=${"0"}&access[${i}][userID]=${accessUser[i - 1].value}&access[${i}][permission]=${accessCompetence[i - 1].value}&access[${i}][username]=${usernameObj[accessUser[i - 1].value]}&access[${i}]`;
    }

    //adds access data with the rest
    let data = "name=" + projectName + "&version=" + projectVersion + accessData + "&default[peoplePerHouse]=" + peoplePerHouse + "&default[litrePerPerson]=" + litrePerPerson;

    let url = "http://localhost:1337/proj/update/info/" + projectId + "?token=" + token;

    //fetch to post the data to db
    fetch(url, {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(res => res.json())
        .then(response => console.log(response))
        .catch(error => alert(error));
};

/**
 * createSelect - function to create select elements
 *
 * @returns {void}
 */
let createSelect = (value, text, selectCompetence) => {
    let option = document.createElement("option");

    option.setAttribute("value", value);
    option.text = text;
    selectCompetence.appendChild(option);
};

//gets button to update project
let updateProjectButton = document.getElementById("updateProjectButton");

//adds eventListener to updateProjectButton which calls updateProject
updateProjectButton.addEventListener("click", () => {
    updateProject();
});
