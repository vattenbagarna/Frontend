/*global configuration, Chart */
let token = localStorage.getItem('token');
let base64Image;
let myLineChart;

/**
 * loadrequiredFields - Load basic required input fields for all new object.
 * 					  - Add event listener for new fields, new category and send.
 * 					  - If a error is thrown from API check if token is validated otherwise remove
 * 					  - old token and redirect to login page.
 * 					  - Other errors are put in console
 *
 * @returns {void}
 */
let loadrequiredFields = () => {
    fetch(
        `${configuration.apiURL}/obj/categories?token=${token}`
    )
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            if (!json.error) {
                let main = document.getElementsByClassName('main-wrap')[0];

                main.innerHTML +=
                    `<label>Kategori</label><br>
				<select class="select-input" id="Kategori">
                <option disabled selected></option></select><br>`;

                let select = document.getElementById("Kategori");

                for (let i = 0; i < json.length; i++) {
                    let option = document.createElement('option');

                    option.id = json[i];
                    option.text = json[i];
                    select.add(option);
                }

                let option = document.createElement('option');

                option.text = "Ny kategori";
                select.add(option);


                main.innerHTML +=
                    `<br><label>Modell</label><br>
			 <input class="text-input" id="Modell" type="text"><br><br>
			 <label>Produktbild</label><br>
			 <img id="currentImage"/>
  	 		<input id="imageFile" type="file" name="pic" accept=".png">
			<div class="button-wrap">
				<a id="newFieldButton" class="button small-button">Lägg till nytt fält</a>
			</div>
				<div id="sendButton" class="button-wrap">
					<br><br>
					<a id="send" class="button">SKAPA</a>
				</div>`;

                document.getElementById('imageFile').addEventListener('change', () => {
                    encodeImageFileAsURL(document.getElementById('imageFile'));
                });

                document.getElementById('newFieldButton').addEventListener('click', () => {
                    newField(main);
                });

                document.getElementById('send').addEventListener('click', () => {
                    createObject(json);
                });

                document.getElementById('Kategori').addEventListener('change', (event) => {
                    let value = event.target.value;
                    let newInput = document.getElementById('newCategoryInput');
                    let pumpCurve = document.getElementById('pumpCurve');
                    let newPumpDiv = document.getElementById('newPump');

                    if (value == "Pumpstationer") {
                        fetch(
                            `${configuration.apiURL}/obj/type/Pump?token=${token}`
                        )
                            .then(function(response) {
                                return response.json();
                            })
                            .then(function(json) {
                                newPump(json);
                            });
                    } else if (newPumpDiv) {
                        newPumpDiv.parentElement.removeChild(newPumpDiv);
                    }

                    if (value == "Ny kategori") {
                        newCategory(value);
                    } else if (newInput) {
                        let parent = newInput.parentElement;

                        parent.parentElement.removeChild(parent);
                    }

                    if (value == "Pump") {
                        newPumpCurve();
                    } else if (pumpCurve) {
                        pumpCurve.parentElement.removeChild(pumpCurve);
                    }
                });
            } else {
                if (json.info == "token failed to validate") {
                    localStorage.removeItem('token');
                    document.location.href = "index.html";
                } else {
                    console.log(json);
                }
            }
        });
};

loadrequiredFields();


/**
 * newPump - Adds a select HTML element with all current pumps as options
 *
 * @param {Object} pumps object data with all pumps
 *
 * @returns {void}
 */
let newPump = (pumps) => {
    let div = document.createElement('div');

    div.id = "newPump";

    div.innerHTML =
        `<label>Pump</label>
		<select id="pumpSelect"><option disabled selected></option></select>
		<label>Antal pumpar</label>
		<input id="nrOfPumps" type="text">`;

    document.getElementById('Modell').after(div);
    let select = document.getElementById('pumpSelect');

    for (let i = 0; i < pumps.length; i++) {
        let option = document.createElement('option');

        option.text = pumps[i].Modell;
        select.add(option);
    }
};

/**
 * newCategory - Adds input field for the creation of a new category
 *
 * @returns {void}
 */
let newCategory = () => {
    let div = document.createElement('div');

    div.innerHTML =
        `<br><label>Den nya kategorin </label><br>
		<input class="text-input" id="newCategoryInput" type="text">`;
    document.getElementById('Kategori').after(div);
};


/**
 * newPumpCurve - Adds a new pump curve (HTML canvas) with input fields for user input and
 * 				- updates graph after each input
 *
 * @returns {void}
 */
let newPumpCurve = () => {
    let div = document.createElement('div');

    div.id = "pumpCurve";
    div.innerHTML =
        `<br><label>Pumpkurva</label><br>
	<input class="number-input newKey" id="height" type="number" step="0.1" placeholder="Höjd (m)">
    <input class="number-input newInput" id="velocity"
    type="number" step="0.1" placeholder="Hastighet (l/s)">
	<a class="button2 button small-button">Lägg till</a>
    <br><br>
	<canvas id="myChart"></canvas>`;

    document.getElementById('Modell').after(div);

    let ctx = document.getElementById('myChart').getContext('2d');

    myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: "höjd",
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                data: [],
            }]
        },

        options: {
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                    label: (tooltipItem) => {
                        return tooltipItem.yLabel;
                    }
                }
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    scaleLabel: {
                        display: true,
                        labelString: "l/s"
                    },
                    ticks: {
                        beginAtZero: true,
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "meter"
                    },
                    ticks: {
                        beginAtZero: true,
                    }
                }],
            }
        }
    });

    let velocity = document.getElementById('velocity');
    let height = document.getElementById('height');
    let button = document.getElementsByClassName('button2');

    button = button[0];

    velocity.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            button.click();
        }
    });

    button.addEventListener('click', () => {
        myLineChart.data.datasets[0].data.push({
            x: velocity.value,
            y: height.value
        });

        velocity.value = "";
        height.value = "";
        height.focus();

        myLineChart.update();
    });
};

/**
 * newField - Adds two new input fields everytime is called where the user can
 * 			- input title and data of attribute of the new object
 *
 * @returns {void}
 */
let newField = () => {
    let div = document.createElement('div');

    div.className = 'newField';
    div.innerHTML =
        `<input class="newKey text-input" type="text" placeholder="Titel">
		<input class="newInput text-input" type="text" placeholder="Värde">
		<a class="removeButton button small-button danger-bt">Ta bort fält</a>`;

    document.getElementById('sendButton').before(div);

    let button = document.getElementsByClassName('removeButton');

    button = button[button.length - 1];

    button.addEventListener('click', () => {
        button.parentElement.parentElement.removeChild(div);
    });
};

/**
 * createObject - Calls when user pressed send button
 * 				- Collects all attributes and put them in json format
 * 				- POST result to API and redirect to listProducts.html if no errors were found
 *
 * @returns {void}
 */
let createObject = () => {
    let data = {};
    let newCategory = document.getElementById('newCategoryInput');
    let pumpCurve = document.getElementById('pumpCurve');
    let newFields = document.getElementsByClassName('newField');
    let newPumpDiv = document.getElementById('newPump');

    data.Modell = document.getElementById('Modell').value;

    if (newCategory) {
        data.Kategori = newCategory.value;
    } else {
        data.Kategori = document.getElementById('Kategori').value;
    }

    if (newPumpDiv) {
        data.Pump = document.getElementById('pumpSelect').value;
        data["Antal pumpar"] = document.getElementById('nrOfPumps').value;
    }

    if (pumpCurve) {
        data.Bildkurva = myLineChart.toBase64Image();
        data.Pumpkurva = myLineChart.data.datasets[0].data;
    }

    data.Bild = base64Image;

    for (let i = 0; i < newFields.length; i++) {
        data[newFields[i].children[0].value] = newFields[i].children[1].value;
    }

    let url =
        `${configuration.apiURL}/obj/insert?token=${token}`;

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then(res => res.json())
        .then((data) => {
            if (data.error) {
                console.log(data);
            } else {
                document.location.href = "listProducts.html";
            }
        })
        .catch(error => console.log(error));
};


/**
 * encodeImageFileAsURL - Convert image to basic64 format by using FileReader
 * 						- @see {@link https://developer.mozilla.org/sv-SE/docs/Web/API/FileReader}
 * 						- This is done to be able to save image inside database
 *
 * @param {input type="file"} element Input field that contains uploaded image from user
 *
 * @returns {void}
 */
let encodeImageFileAsURL = (element) => {
    let file = element.files[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
        base64Image = reader.result;
        document.getElementById('currentImage').src = reader.result;
    };
};
