let dingle = new Object(),
    dagin = new Object(),
    dube = {}
;

dingle.isAHamster = true;

Object.setPrototypeOf(dingle, dube);
dagin.__proto__ = dingle;
Object.setPrototypeOf(dube, dingle);

