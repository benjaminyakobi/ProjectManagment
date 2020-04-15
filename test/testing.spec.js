const add = (x, y) => +x + +y

const assert = require('assert')

it('correctly calculates the sum of 1 and 3', () => {
  assert.equal(add(1, 3), 4)
})