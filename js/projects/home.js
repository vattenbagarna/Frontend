/*global configuration */
let token = localStorage.getItem('token');
let user = localStorage.getItem('username');

/**
 * loadAllProjects - Load all project connected to user and display it on page
 *
 * @returns {void}
 */
let loadAllProjects = () => {
    fetch(configuration.apiURL + `/proj/all?token=${token}`)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            if (!json.error) {
                let projectlist = document.getElementsByClassName('projectlist')[0];
                let userName = document.getElementById('userName');
                let permission = "";

                userName.innerHTML = `Välkommen ${user}`;

                if (json.length > 0) {
                    for (let i = 0; i < json.length; i++) {
                        if (json[i].access.length > 0) {
                            permission += "Rättigheter till övriga: <br>";
                        }
                        for (let n = 0; n < json[i].access.length; n++) {
                            if (json[i].access[n].permission == "w") {
                                permission +=
                                    `${json[i].access[n].username}
								<i class="material-icons">edit</i><br>`;
                            } else {
                                permission +=
                                    `${json[i].access[n].username}
								<i class="material-icons">description</i><br>`;
                            }
                        }

                        projectlist.innerHTML +=
                            `<div class="project">
						<h2>${json[i].name}</h2>
						<h2>${json[i].version}</h2>
						<h2>Skapare: <br>${json[0].creator.username} <br>
						<p>${permission}</p></h2>
						<a href="updateProject.html?id=${json[i]._id}">
							<i class="material-icons">settings</i>
						</a>
						<a href="map.html?id=${json[i]._id}">
							<i class="material-icons">exit_to_app</i>
						</a>
					</div>`;
                    }
                    // Add last-project class to last element
                    projectlist.innerHTML +=
                        `<div class="last-project"></div>`;
                } else {
                    projectlist.innerHTML +=
                        `<div class="project">
					<h2>Inga projekt skapade ännu</h2>
				</div>`;
                }
            } else {
                if (json.info == "token failed to validate") {
                    localStorage.removeItem('token');
                    document.location.href = "index.html";
                } else {
                    console.log(json);
                }
            }
        })
        .catch(error => console.log(error));
};

loadAllProjects();
