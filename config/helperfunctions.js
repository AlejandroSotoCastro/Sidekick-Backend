function myCOOLfunction(CR) {
  CR = parseFloat(CR); // In case the input is a string
  /**CASE 0 */
  if (CR === 0) {
    return 0;
  } else if (CR >= 1) {
    /**CASE INTEGER (>=1) */
    let lowerCRs = "0, 0.125, 0.25, 0.5";

    for (i = 1; i <= CR; i++) {
      lowerCRs += `,${i}`;
    }
    return lowerCRs;
  } else {
    /**CASE DECIMAL (>0|<1) */
    let aux = CR;
    let CRsList = "0";

    do {
      CRsList += `,${aux}`;
      aux /= 2;
    } while (aux >= 0.125);

    return CRsList;
  }
}

module.exports = myCOOLfunction;
