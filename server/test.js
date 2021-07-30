const test = {
	text: 'test',
};

function foo() {
	return test ? {test.text = 'hello';
  return test;} : test;
}

console.log(test);
