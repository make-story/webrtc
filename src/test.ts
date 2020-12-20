export function makePerson(name: string, age: number) {
    return {
        name,
        age,
    };
};
export function testMakePerson() {
    console.log(makePerson('YSM', 22), makePerson('유성민', 33));
};



function test(a: number, b: number): number {
    return a + b;
}

// test
console.log('TEST!!!');
const $root = document.querySelector('#root');
if($root) {
    $root.textContent = 'YSM!!!' + test(1, 2);
}
function sum(a: number, ...nums: number[]): number {
let total = 0;
for (let key in nums) {
    total += nums[key];
}
return a + total;
}
console.log(sum(1, 2, 3, 4, 5));