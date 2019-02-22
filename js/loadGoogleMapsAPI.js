function getKey () {
    const script = document.createElement("script");

    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=myMap`;
    document.head.appendChild(script);
}
