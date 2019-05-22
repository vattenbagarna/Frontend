const calculations = {

    /**
     * calcPressure - Calculates lost pressure.
     *
     * @param {number} Flow
     * @param {number} MU (friction)
     * @param {number} Dimension
     * @param {number} Length
     *
     * @return {number} Lost pressure
     *
     */
    calcPressure: (wantedFlow, mu, selectedDim, length) => {
        let rho = 1000; // kg/m3
        let viscosity = 1e-6; // m2/s

        let top = 2 * length * rho * wantedFlow * wantedFlow;
        let bot = (Math.PI * Math.PI * Math.pow(selectedDim / 1000, 5));
        let a = top / bot;

        let b = mu / (3.7 * selectedDim);

        top = 2.51 * viscosity;
        bot = (Math.sqrt(2 / (length * rho)) * Math.pow(selectedDim / 1000, 1.5));
        let c = top / bot;

        let oldPress = 100000;
        let newPress;
        let error;

        for (let i = 0; i < 20; i++) {
            newPress = a / calculations.square(calculations.log10(b + c *
                Math.pow(oldPress, -0.5)));
            error = newPress / oldPress - 1;
            oldPress = newPress;
            if (Math.abs(error) < 1e-10) {
                break;
            }
        }
        return newPress / 100000;
    },

    /**
     * calcVelocity - Calculates velocity.
     *
     * @param {number} Flow
     * @param {number} Dimension
     *
     * @return {number} Velocity
     *
     */
    calcVelocity: (wantedFlow, selectedDim) => {
        return 4 * 1000000 * wantedFlow / (selectedDim * selectedDim * Math.PI);
    },

    /**
     * square - Calculates X squared.
     *
     * @param {number} Value to square
     *
     * @return {number} Result of value squared
     *
     */
    square: (x) => {
        return Math.pow(x, 2);
    },

    /**
     * log10 - Calculates X log10.
     *
     * @param {number} Value to log10
     *
     * @return {number} Result of value log10
     *
     */
    log10: (x) => {
        return Math.LOG10E * Math.log(x);
    },

    /**
     * estPumpValue - Estimates the amount of fluid capacity a given pump can
     * give within a previosly unknown interval.
     *
     * @param {number} Height
     * @param {number} Pumpcurve
     *
     * @returns {number} X value
     */
    estPumpValue: (yValue, pumpCurve) => {
        let min1 = 100;
        let min2 = 100;
        let both = false;
        let y1 = 0;
        let y2 = 0;
        let x1 = 0;
        let x2 = 0;

        for (let i = 0; i < pumpCurve.length; i++) {
            let temp = Math.abs(yValue - pumpCurve[i].y);

            if (temp < min1) {
                min1 = temp;
                y1 = pumpCurve[i].y;
                x1 = pumpCurve[i].x;
            } else if (temp < min2 && temp != min1) {
                min2 = temp;
                y2 = pumpCurve[i].y;
                x2 = pumpCurve[i].x;
            }
            if (i == pumpCurve.length - 1 && !both) {
                i = 0;
                both = true;
            }
        }

        if (x1 > x2) {
            let temp = x2;

            x2 = x1;
            x1 = temp;
            temp = y2;
            y2 = y1;
            y1 = temp;
        }

        let deltaX = x2 - x1;
        let deltaY = y2 - y1;
        let k = deltaX / deltaY;
        let plus = Math.abs((y1 - yValue) * k);

        return x1 + plus;
    },

    /**
     * totalPressure - Calculates total pressure.
     *
     * @param {number} Pressure
     * @param {number} Height
     *
     * @returns {number} Total pressure
     */
    totalPressure: (lostPress, height) => {
        return lostPress + height;
    }
};

calculations;
