/*global configuration */
let token = localStorage.getItem('token');
let user = localStorage.getItem('username');

console.log(token);

/**
 * loadAllProjects - Description
 *
 * @returns {type} Description
 */
let loadAllProjects = () => {
    fetch(configuration.apiURL + `/proj/all/12345?token=${token}`)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            let projectlist = document.getElementsByClassName('projectlist')[0];
            let userName = document.getElementById('userName');
            let permission;

            userName.innerHTML = `Välkommen ${user}`;

            if (json.length > 0) {
                for (let i = 0; i < json.length - 1; i++) {
                    for (let n = 0; n < json[i].access.length; n++) {
                        if (json[i].access[n].permission == "w") {
                            permission = 'redigera <i class="material-icons">edit</i>';
                        } else {
                            permission = 'läsa <i class="material-icons">description</i>';
                        }
                    }

                    projectlist.innerHTML +=
                        `<div class="project">
						<h2>${json[i].name}</h2>
						<h2>${json[i].version}</h2>
						<h2>Rättigheter: ${permission}</h2>
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
                    `<div class="project last-project">
					<h2>${json[json.length - 1].name}</h2>
					<h2>${json[json.length - 1].version}</h2>
					<h2>Rättigheter: ${permission}</h2>
					<a href="updateProject?id=${json[json.length - 1]._id}">
						<i class ="material-icons">settings</i>
					</a>
					<a href="map.html?id=${json[json.length - 1]._id}">
						<i class ="material-icons">exit_to_app</i>
					</a>
				</div>`;
            } else {
                projectlist.innerHTML +=
                    `<div class="project">
					<h2>Inga projekt skapade ännu</h2>
				</div>`;
            }
        })
        .catch(error => console.log(error));
};

loadAllProjects();
