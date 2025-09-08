function WoodyWoodpecker() {
    this.original = true;
    this.isEnglish = true;
}

function PicaPau() {
    this.original = false;
    this.isBrazilian = true;
}

// Test 2
console.log(PicaPau.prototype.constructor === PicaPau);

//Test 1
PicaPau.prototype.constructor = WoodyWoodpecker;

let picaPau2025 = new PicaPau.prototype.constructor();
console.log(picaPau2025);

console.log(picaPau2025.constructor);


