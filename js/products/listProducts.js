/*global configuration*/
/*eslint no-unused-vars: 0*/
let token = localStorage.getItem('token');

fetch(`${configuration.apiURL}/obj/created?token=${token}`)
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        if (!json.error) {
            let activeProducts = document.getElementById('activeProducts');
            let inactiveProducts = document.getElementById('inactiveProducts');

            if (json.length > 0) {
                for (let i = 0; i < json.length; i++) {
                    if (json[i].isDisabled == 0) {
                        activeProducts.innerHTML +=
                            `<div class="table">
			<h2 class="tablepart">${json[i].Modell}</h2>
			<h2 class="tablepart">${json[i].Kategori}</h2>
			<img class="tablepart" src="${json[i].Bild}"/>
			<a class="tablepart tablelink" href="updateObject.html?id=${json[i]._id}">
				<i class="material-icons">settings</i>
			</a>
<a class="tablepart tablelink"
onclick="disable('${json[i]._id}', 1);">
				<i class="material-icons">clear</i>
			</a>
			</div>`;
                    } else {
                        inactiveProducts.innerHTML +=
                            `<div class="table">
			<h2 class="tablepart">${json[i].Modell}</h2>
			<h2 class="tablepart">${json[i].Kategori}</h2>
			<img class="tablepart" src="${json[i].Bild}"/>
			<a class="tablepart tablelink" href="updateObject.html?id=${json[i]._id}">
				<i class="material-icons">settings</i>
			</a>
<a class="tablepart tablelink"
onclick="disable('${json[i]._id}', 0);">
				<i class="material-icons">done</i>
			</a>

			<a class="tablepart tablelink"
onclick="remove('${json[i]._id}');">
				<i class="material-icons">delete</i>
			</a>
			</div>`;
                    }
                }
                activeProducts.innerHTML += '<div class="last-product"></div>';
                inactiveProducts.innerHTML +=
                    '<div style="opacity:0.5;" class="last-product"></div>';
            } else {
                activeProducts.innerHTML +=
                    `<div class="product">
				<h2>Inga produkter skapade ännu</h2>
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
    });


/**
 * disable - disable the selected product by calling backend API
 *
 * @param {string} id the id of the product to be disabled
 * @param {int} value this is the value for isDisabled (0=active, 1=inactive)
 *
 */
let disable = (id, value) => {
    let data = `isDisabled=${value}`;

    fetch(configuration.apiURL + "/obj/disable/" + id + "?token=" + token, {
        method: "POST",
        body: data,
        headers: {
            'Content-Type': "application/x-www-form-urlencoded"
        },
    }).then(res => res.json())
        .then((data) => {
            if (data.error) {
                console.log(data);
            } else {
                location.reload();
            }
        });
};


/**
 * remove - Removes the selected product by calling backend API
 *
 * @param {type} id The id of the item to delete
 *
 */
let remove = (id) => {
    fetch(configuration.apiURL + "/obj/delete/"  + id + "?token=" + token)
        .then((response) => {
            return response.json();
        })
        .then(() => {
            location.reload();
        });
};
