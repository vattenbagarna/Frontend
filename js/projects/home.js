/*global configuration */
let token = localStorage.getItem('token');
let user = localStorage.getItem('username');

/**
 * loadAllProjects - Description
 *
 * @returns {type} Description
 */
let loadAllProjects = () => {
    //använd project info istället
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
						<h2>Rättigheter: <p>${permission}</p></h2>
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
