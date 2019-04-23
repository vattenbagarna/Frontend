/*global configuration*/
/*eslint no-unused-vars: 0*/
let token = localStorage.getItem('token');

fetch(`${configuration.apiURL}/obj/created?token=${token}`)
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        if (!json.error) {
            let productList = document.getElementsByClassName('productList')[0];

            if (json.length > 0) {
                for (let i = 0; i < json.length; i++) {
                    productList.innerHTML +=
                        `<div class="product">
			<h2>${json[i].Modell}</h2>
			<h2>${json[i].Kategori}</h2>
			<img src="${json[i].Bild}"/>
			<a href="updateObject.html?id=${json[i]._id}">
				<i class="material-icons">settings</i>
			</a>
<a onclick="remove('${configuration.apiURL}/obj/delete/${json[i]._id}/?token=${token}');">
				<i class="material-icons">delete</i>
			</a>
			</div>`;
                }
                productList.innerHTML += '<div class="last-product"></div>';
            } else {
                productList.innerHTML +=
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
 * remove - Removes the selected product by calling backend API
 *
 * @param {type} url The url to the API call
 *
 */
let remove = (url) => {
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then(() => {
            location.reload();
        });
};
