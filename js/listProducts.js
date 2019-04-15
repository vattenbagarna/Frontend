/*global configuration*/
/*eslint no-unused-vars: 0*/
let token = localStorage.getItem('token');
let userID = "12345";

fetch(`${configuration.apiURL}/obj/created/${userID}?token=${token}`)
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        let productList = document.getElementsByClassName('productList')[0];

        if (json.length > 0) {
            for (let i = 0; i < json.length; i++) {
                productList.innerHTML +=
                    `<div class="product">
			<h2>${json[i].Modell}</h2>
			<h2>${json[i].Kategori}</h2>
			<a href="updateObject.html?id=${json[i]._id}">
				<i class="material-icons">settings</i>
			</a>
<a onclick="remove('${configuration.apiURL}/obj/delete/${json[i]._id}/${userID}?token=${token}');">
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
    });


/**
 * remove - Removes the selected product by calling backend API
 *
 * @param {type} url The url of the call
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
