export let popup = {
    marker: (attributes) => {
        let temp = "";

        for (let key in attributes) {
            temp += `<tr><td>${key}: ${attributes[key]}</td></tr>`;
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

    pipe: (material, dimension, tilt) => {
        return `<b>Rör</b><br>
		<label>Material</label>
		<input type="text" id="pipeMaterial" name="material" value="${material}">
		<label>Ytterdiameter</label>
		<input type="text" id="dimension" name="dimension" value="${dimension}">
		<label>Lutning</label>
		<input type="number" id="tilt" name="tilt" value="${tilt}">
		<input type="button" class="updateValuesInPipe" value="Ändra">`;
    },

    branch: `<b>Förgrening<br>`,

    changeCoord: (latlng) => {
        return `
    <li>
        <label for='cp-2'>Ändra coordinater</label>
        <input type='radio' name='a' id='cp-2'>
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
