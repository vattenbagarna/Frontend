document.getElementById("submit").addEventListener('onclick', () => {
    let diameter = document.getElementById("length").value;
    let length = document.getElementById("length").value;
    let height = document.getElementById("height").value;
    let dimension = document.getElementById("dimension").value;
    let flow = document.getElementById("flow").value;

    console.log(darcyHeight(diameter, 0.01, length, flow, 0));
});

/*
 *
 *
 *
 *
 */
const majorLoss = (friction, length, velocity, diameter, density) => {
    let loss = friction * (length / diameter) * (density * (velocity *
        velocity) / 2) / 1000;

    return loss.toFixed(2);
};

console.log(majorLoss(0.0967859, 100, 1, 0.32, 1000));


/*
 * Calc the estimated L/s depending on how many houses and how many live in said
 * houses.
 * houses = array of houses to calc on, Qd = waste water per day, p = number of
 * people in the house, Cd = max factor per day, Cd = max factor per hour
 * */
const estWater = (houses, Cd = 1, Ct = 1, QInd = 0) => {
    let Qs = 0;

    for (let i = 0; i < houses.length; i++) {
        Qs += ((houses[i].Qd * houses[i].nrOfInd) / (3600 * 24)) * Cd * Ct +
            QInd;
    }
    return Qs;
};

/* To calc how much speed there will be in the pipe depending on the diameter of
 * the pipe, the friction of the pipe, as well as the fall, which should not be
 * more than 6-12 promille.
 * This function gives speed in meters/s.
 * https://sv.wikipedia.org/wiki/Darcy-Weisbachs_ekvation
 * */
const darcyFlow3 = (dia, friction = 0.01, fall = 0) => {
    let Q = (((3.14159 * (dia * dia)) / 4) * Math.sqrt((2 * 9.82 * dia *
        fall) / friction));

    return Q;
};

/* To calc how much speed there will be in the pipe depending on the diameter of
 * the pipe, the friction of the pipe, as well as the fall, which should not be
 * more than 6-12 promille.
 * This function gives the speed in cubic meters/s.
 * https://sv.wikipedia.org/wiki/Darcy-Weisbachs_ekvation
 * */
const darcyFlow = (dia, friction = 0.01, fall = 0) => {
    let Q = Math.sqrt((2 * 9.82 * dia * fall) / friction);

    return Q;
};

/* Function to calc the resistance coefficient */
const coeff = (dia, friction = 0.01, length = 5) => {
    kt = friction * (length / dia);
    return kt;
};

/* To calc the loss of energy when pumping up water verticaly and the pipe has
 * zero or severals bends */
const darcyHeight = (dia, friction = 0.01, length = 5, speed = 1, nrOfBends = 0) => {
    let HF = 0;

    if (nrOfBends == 0) {
        Hf = ((friction * length) / dia) * ((speed * speed) / (2 * 9.82));
    } else {
        Hf = ((friction * length) / dia + coeff(dia, friction, nrOfBends,
            length)) * ((speed * speed) / (2 * 9.82));
    }
    return Hf;
};

/* calculating the length of a pipe when it is tilted, uses pythagoras calc */
const pythLength = (base, height) => {
    L = Math.sqrt((height * height) + (base * base));
    return L;
};

/* Calculate the angle of a tilted pipe */
const angle = (base, height) => {
    A = (Math.atan(height / base)) * (180 / Math.PI);
    return A;
};
