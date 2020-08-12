import assert from 'assert';
import HtmlParser from '../src/HtmlParser.js';

it('parse a single element', () => {
  const parser = new HtmlParser();
  const result = parser.parse('<div></div>').children[0];
  assert.equal(result.type, 'element');
  assert.equal(result.tagName, 'div');
  assert.equal(result.children.length, 0);
  assert.equal(result.attributes.length, 0);
})

it('parse a signle element with text content', () => {
  const parser = new HtmlParser();
  const result = parser.parse('<div>hello</div>').children[0];
  const textNode = result.children[0];
  assert.equal(textNode.type, 'text');
  assert.equal(textNode.content, 'hello');
})

it('text with <', () => {
  const parser = new HtmlParser();
  const result = parser.parse('<div>a < b</div>').children[0];
  const textNode = result.children[0];
  assert.equal(textNode.type, 'text');
  assert.equal(textNode.content, 'a < b');
})

it('with property', () => {
  const parser = new HtmlParser();
  const result = parser.parse('<div id=a  data-b="b"  data-c=\'c\'></div>').children[0];
  let count = 0;
  for (const attr of result.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, 'a');
    } else if (attr.name === 'data-b') {
      count++;
      assert.equal(attr.value, 'b');
    } else if (attr.name === 'data-c') {
      count++;
      assert.equal(attr.value, 'c');
    }
  }
  assert.ok(count === 3);
})

it('property double qoute end with space', () => {
  const parser = new HtmlParser();
  const result = parser.parse('<div attr="a" ></div>').children[0];
  let count = 0;
  for (const attr of result.attributes) {
    if (attr.name === 'attr') {
      count++;
      assert.equal(attr.value, 'a');
    }
  }
  assert.ok(count === 1);
})

it('property single qoute end with space', () => {
  const parser = new HtmlParser();
  const result = parser.parse('<div attr=\'a\' ></div>').children[0];
  let count = 0;
  for (const attr of result.attributes) {
    if (attr.name === 'attr') {
      count++;
      assert.equal(attr.value, 'a');
    }
  }
  assert.ok(count === 1);
})


it('property unqoute end with empty', () => {
  const parser = new HtmlParser();
  const result = parser.parse('<div attr =a></div>').children[0];
  let count = 0;
  for (const attr of result.attributes) {
    if (attr.name === 'attr') {
      count++;
      assert.equal(attr.value, 'a');
    }
  }
  assert.ok(count === 1);
})

it('property unqoute end with empty2', () => {
  const parser = new HtmlParser();
  const result = parser.parse('<div attr=a />').children[0];
  let count = 0;
  for (const attr of result.attributes) {
    if (attr.name === 'attr') {
      count++;
      assert.equal(attr.value, 'a');
    }
  }
  assert.ok(count === 1);
})

it('property unqoute 3', () => {
  const parser = new HtmlParser();
  const result = parser.parse('<div attr=a= />').children[0];
  let count = 0;
  for (const attr of result.attributes) {
    if (attr.name === 'attr') {
      count++;
      assert.equal(attr.value, 'a=');
    }
  }
  assert.ok(count === 1);
})

it('no value property', () => {
  const parser = new HtmlParser();
  const result = parser.parse('<div disable></div>').children[0];
  let count = 0;
  for (const attr of result.attributes) {
    if (attr.name === 'disable') {
      count++;
      assert.equal(attr.value, '');
    }
  }
  assert.ok(count === 1);
})

it('no property value', () => {
  const parser = new HtmlParser();
  const result = parser.parse('<div disable=></div>').children[0];
  assert.equal(result.attributes.length, 0);
})

it('self closing', () => {
  const parser = new HtmlParser();
  const result = parser.parse('<img attr="a"/>').children[0];
  let count = 0;
  for (const attr of result.attributes) {
    if (attr.name === 'attr') {
      count++;
      assert.equal(attr.value, 'a');
    }
  }
  assert.ok(count === 1);
  assert.ok(result.isSelfClosing);
})

it('self closing 2', () => {
  const parser = new HtmlParser();
  const result = parser.parse('<img/>').children[0];
  assert.ok(result.isSelfClosing);
})


it('self closing 3', () => {
  const parser = new HtmlParser();
  const result = parser.parse('<img/ >').children[0];
  assert.ok(!result.isSelfClosing);
})

it('self closing 3', () => {
  const parser = new HtmlParser();
  const result = parser.parse('<img/ >').children[0];
  assert.ok(!result.isSelfClosing);
})