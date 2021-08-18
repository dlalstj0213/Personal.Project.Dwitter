class Immutable {
	constructor() {
		this.name = 'hello';
		this.type = 'typo';
		Object.freeze(this);
	}
}

let test = new Immutable();
//test.name = 'NONE';
console.log(test.name);
