/*
> 실행순서
$ npm install -g typescript
$ tsc -v
$ tsc index.ts
$ node index.js
*/
import { testMakePerson } from './test';

testMakePerson();
console.log('Hello World!');

let test1: number = 1;
let test2: boolean = false;
let test3: string = 'test';
let test4: object = {}; 
let test5: undefined = undefined;

interface IPerson {
	name: string
	age: number
}
/*let test6: IPerson = {
	name: 'YSM',
	age: 35
}
let bad1: IPerson = {
	name: 'YSM'
	// age 속성이 없으므로 오류
}
let bad2: IPerson = {
	age: 35
	// name 속성이 없으므로 오류
}
let bad3: IPerson = {
	// name, age 속성이 없으므로 오류
}
let bad4: IPerson = {
	name: 'YSM',
	age: 35,
	etc: true, // etc 속성이 있으므로 오류
}*/

class Person1 {
	name: string
	age?: number // ? (물음표)는 있어도 되고, 없어도 되는 선택속성이라는 것을 명시
}
let ysm1: Person1 = new Person1();
ysm1.name = 'YSM';
ysm1.age = 35;

console.log(ysm1);

const calc = (value: number, cb: (number) => void): void => {
	let add = (a, b) => a + b;
	function multiply(a, b) { return a * b }

	let result = multiply(add(1, 2), value)
	cb(result)
}
calc(30, (result: number) =>console.log(`result is ${result}`)) // result is 90