export let popup = {
    marker: (attributes) => {
        let temp = "";

        for (let i = 0; i < attributes.length; i++) {temp += `<tr><td>${attributes[i]}</td></tr>`;}


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

    house: (address, type, nop, flow) => {
        return `<b>${address}</b><br>
		<div class="housePopup">
	    <select>
	    <option value="${type}">${type}</option>
	    <option value="Garage">Garage</option>
	    <option value="Restaurang">Restaurang</option>
	    <option value="Sommarstuga">Sommarstuga</option>
	    </select>

	    <form action="">
	    Personer per hushåll: <input type="text" name="per" value="${nop}"><br>
	    Vatten per person/dygn: <input type="text" name="cons" value="${flow}"><br>
	    <input type="button" value="Ändra">
	    </form>
	    </div>`;
    },

    pipe: (dimension, tilt) => {
        return `<b>Rör</b><br>
<label>Inner Dimension</label>
<input type="number" id="dimension" name="dimension" placeholder="${dimension}">
<label>Lutning</label>
<input type="number" id="tilt" name="tilt" placeholder="${tilt}">
<input type="button" value="Skicka">`;
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
