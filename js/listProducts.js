let url = "http://localhost:1337";
let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2FiNjA5OGI2MTczOTE2ZWNkNmM5YWMiLCJ1c2VybmFtZSI6ImFobGdyZW4uZmlsaXBAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkNVZOMHVFRXRldWtyOUFkRlZLbFFNT0dmVXNiblNWSHFSQ0p6U1kxWHRkZ3hHd3gvUmROMUciLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTU0OTgxNTA5fQ.RI_3AZiaKv0_J4mYSxsrYgCPLYfamDHf9Q_tquy3PWo';
let userID = 'me';

fetch(url+"/obj/created/"+userID+"?token="+token).then(function(response){
    return response.json();
}).then(function(myJson){
    console.log(JSON.stringify(myJson));
    let parent = document.getElementsByClassName('productList')[0];
    for (let i= 0; i < myJson.length; i++){

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
