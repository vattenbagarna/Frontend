export let popup = {
    marker: (attributes) => {
        let temp = "";
        let temp2 = "";
        let similarAttributes = ["Kategori", "Modell", "M ö.h"];
        let i = 0;

        for (let key in attributes) {
            switch (key) {
                case 'Bild':
                    temp += `<tr><td><img src="${attributes[key]}"/></td></tr>`;
                    break;
                case 'creatorID':
                case '_id':
                    break;
                case similarAttributes[i]:
                    temp += `<tr><td>
                    ${similarAttributes[i]}: ${attributes[similarAttributes[i]]}
                    </td></tr>`;
                    i = i + 1;
                    break;
                default:
                    temp2 += `<tr><td>${key}: ${attributes[key]}</td></tr>`;
                    break;
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
        <label for='cp-2'>Överig info</label>
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

	    Personer per hushåll: <input type="text" id="per" value="${nop}"><br>
	    Vatten per person/dygn: <input type="text" id="cons" value="${flow}"><br>
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
        <label for='cp-3'>Ändra coordinater</label>
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
