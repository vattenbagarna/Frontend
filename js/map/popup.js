export let popup = {
    marker: (attributes) => {
        let temp = "";
        let temp2 = "";
        let similarAttributes = [
            "Kategori",
            "Modell",
            "id",
            "M ö.h",
            "Totaltryck",
            "Flödeshastighet",
            "Antal personer som högst",
        ];

        for (let key in attributes) {
            if (similarAttributes.includes(key)) {
                let i = similarAttributes.indexOf(key);
                temp +=
                    `<tr><td>
                ${similarAttributes[i]}: ${attributes[key]}
                </td></tr>`;
            } else {
                temp2 += `<tr><td>${key}: ${attributes[key]}</td></tr>`;
            }
        }

        return `<ul class='accordion2'>
    <li>
        <label for='cp-1'>Info</label>
        <input type='radio' name='a' id='cp-1' checked='checked'>
        <div class='content'>
			<table>
		        ${temp}
			</table>
		</div>
    </li>
    <li>
        <label for='cp-2'>Övrig info</label>
        <input type='radio' name='a' id='cp-2'>
        <div class='content'>
			<table>
                ${temp2}
            </table>
		</div>
    </li>`;
    },

    house: (address, type, nop, flow, color) => {
        return `<b id="address">${address}</b><br>
		<div class="housePopup">
	    Typ: <input type="text" id="houseType" value="${type}"><br>
		Färg: <br><input type="color" id="houseColor" value="${color}"><br>

	    Personer per hushåll:
		<input type="text" id="per" value="${nop}"><br>
	    Flöde per person/dygn:
		<input class="input-text" disabled type="text" id="cons" value="${flow}"><br>
	    <input type="button" class="updateValuesInHouse" value="Ändra">
	    </div>`;
    },

    pipe: (tilt) => {
        return `<label>Material</label>
				<select class="materialPopup">
					<option>PEM</option>
					<option>PE</option>
					<option>Rostfria</option>
				</select>
				<label>Statisk höjd</label>
				<input type="number" step="0.1" id="tilt" name="tilt" value=${tilt}>
				<input type="button" id="pipeSpecifications" value="Skicka">`;
    },

    branch: `<b>Förgrening<br>`,

    changeCoord: (latlng) => {
        return `
    <li>
        <label for='cp-3'>Ändra koordinater</label>
        <input type='radio' name='a' id='cp-3'>
        <div class='content'>
			<b> Latitud </b>
			<input type="text" id='latitud' value=${latlng.lat}>
        	<b> Longitud </b>
			<input type="text" id='longitud' value=${latlng.lng}>
        	<input type="button" class="sendCoords" value="Skicka" >
		</div>
    </li>
</ul>`;
    }
};
