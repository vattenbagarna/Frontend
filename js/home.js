let temp =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2FiNmVjMTRiNzYwYTUwZGUyY2QwYTIiLCJ1c2VybmFtZSI6ImpvaGFuLmRqYXJ2Lmthcmx0b3JwQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJDNkbkptZDNoSmhBdHNhQUY0MlovaS5teERYSVY3MUlBL2xmeERKR2hsZFVRRi56SWZVUjJlIiwiaXNBZG1pbiI6ImZhbHNlIiwiaWF0IjoxNTU0ODk3NjAwfQ.BsK_c1HXGNOC1WUjXsCg27jMn_BGqupcEJcTYAJXBZc";

// Ska skapas vid inlogg i framtiden istället
let localStorage = window.localStorage;

localStorage.setItem('token', temp);

let token = localStorage.getItem('token');



/**
 * loadAllProjects - Description
 *
 * @returns {type} Description
 */
let loadAllProjects = () => {
    fetch(
            `http://localhost:1337/proj/all/1234?token=${token}`
        )
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            let projectlist = document.getElementsByClassName('projectlist')[0];
            let userName = document.getElementById('userName');
            let permission;

            userName.innerHTML = "Välkommen user?";

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
        .catch(error => alert(error));
};

loadAllProjects();
