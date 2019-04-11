let url = "http://localhost:1337";
let token = '';
let userID = '';

fetch(url+"/obj/created/"+userID+"?token="+token).then(function(response) {
    return response.json();
}).then(function(myJson) {
    console.log(JSON.stringify(myJson));
    let parent = document.getElementsByClassName('productList')[0];

    for (let i= 0; i < myJson.length; i++) {
        //Create div
        let div = document.createElement("DIV");

        parent.appendChild(div);
        div.className = "button-wrap";

        //Create paragraph for name
        let name = document.createElement("P");

        div.appendChild(name);
        name.innerText = myJson[i].Namn;

        //Create edit button
        let EditBTN = document.createElement("A");

        div.appendChild(EditBTN);
        EditBTN.className = "button";
        EditBTN.setAttribute('href', 'updateObject.html?id='+myJson[i]._id);
        EditBTN.innerHTML = "Redigera";

        //Create delete button
        let DeleteBTN = document.createElement("A");

        div.appendChild(DeleteBTN);
        DeleteBTN.className = "button";
        DeleteBTN.setAttribute('href', url+'/obj/delete/'+myJson[i]._id+'/'+userID+'?token='+token);
        DeleteBTN.innerHTML = "Ta bort";

        let br = document.createElement("BR");

        div.appendChild(br);
    }
});
