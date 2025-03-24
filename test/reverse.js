const assert = require('assert');
const reverse = require('../reverse');

const suite = require("./index");

suite('reverse', test => {

  test('setting object property', _ => {
    assert.deepEqual(
      reverse(
        [ { op: 'replace', path: '/name', value: 'henry', _prev: 'hank' } ]
      ),
      [ { op: 'replace', path: '/name', value: 'hank', _prev: 'henry' } ]
    );
  });

  test('setting object property in array with index', _ => {
    assert.deepEqual(
      reverse(
        [ { op: 'add', path: '/names/0', value: { id: 38, name: 'henry' } } ]
      ),
      [ { op: 'remove', path: '/names/[38]', _prev: { id: 38, name: 'henry' } } ]
    );
  });

  test('setting object property in array with id', _ => {
    assert.deepEqual(
      reverse(
        [ { op: 'add', path: '/names/[123]', value: { id: 456, name: 'henry' } } ]
      ),
      [ { op: 'remove', path: '/names/[456]', _prev: { id: 456, name: 'henry' } } ]
    );
  });

  test('setting object property in array with nested id', _ => {
    assert.deepEqual(
      reverse(
        [ { op: 'add', path: '/names/[12345-67890]/cards/[000]', value: { id: 456, name: 'henry' } } ]
      ),
      [ { op: 'remove', path: '/names/[12345-67890]/cards/[456]', _prev: { id: 456, name: 'henry' } } ]
    );
  });

});
