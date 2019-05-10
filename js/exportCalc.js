const calculations = {

    /**
   * calcPressure - Calculates lost pressure
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
   * calcVelocity - Calculates velocity
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
    * square - Calculates X squared
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
     * log10 - Calculates X log10
     *
     * @param {number} Value to log10
     *
     * @return {number} Result of value log10
     *
     */
    log10: (x) => {
        return Math.LOG10E * Math.log(x);
    }
};

calculations;
