const createShip = (len) => {
  const size = len;
  const hitLoc = [];
  let sunk = false;

  return {
    hit(position) {
      hitLoc.push(position);
      // this.isSunk ? (sunk = true) : null;
    },
    isSunk() {
      return hitLoc.length == size ? true : false;
    },
    // getSize() {
    //   return size;
    // },
    getHitLoc() {
      return hitLoc;
    },
    // getStatus() {
    //   return sunk;
    // },
  };
};
export default createShip;
