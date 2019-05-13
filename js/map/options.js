export let options = {
    marker: (activeIcon) => {
        return {
            draggable: true,
            icon: activeIcon
        };
    },

    house: (color) => {
        return {
            color: color,
            fillColor: color,
            fillOpacity: 0.5,
            weight: 1.5
        };
    },

    pipe: {
        id: "pipe",
        edit_with_drag: true,
        vertices: {
            destroy: true,
            first: false,
            last: false,
            insert: true,
            middle: true,
        }
    },

    stemPipe: {
        id: "stemPipe",
        weight: 5,
        color: "red",
        edit_with_drag: true,
        vertices: {
            destroy: true,
            first: false,
            last: false,
            insert: true,
            middle: true,
        }
    },
};
