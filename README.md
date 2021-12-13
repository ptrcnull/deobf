# deobf

Semi-modular ECMAScript deobfuscator

## Modules

### [Add if braces](lib/addIfBraces.js)

```js
// before
if (something) doSomething()

// after
if (something) {
    doSomething()
}
```

### [Array bool](lib/arrayBool.js)

```js
// before
console.log(![])
console.log(!![])

// after
console.log(false)
console.log(true)
```

### [Array obfuscation](lib/arrayObfuscation.js)

TODO

### [Comma separated statements](lib/commaSeparatedStatements.js)

```js
// before
function test() {
    return console.log('b'), 'a'
}

// after
function test() {
  console.log('b')
  return 'a'
}
```

### [Comparison order](lib/comparisonOrder.js)

```js
// before
if (null == a) {}

// after
if (a == null) {}
```

### [Expand if shortcut](lib/expandIfShortcut.js)

```js
// before
a && console.log('b')

// after
if (a) {
    console.log('b')
}
```

### [Expand sequence expression](lib/expandSequenceExpression.js)

TODO

### [Function to class](lib/functionToClass.js)

TODO

### [Nested blocks](lib/nestedBlocks.js)

```js
// before
function test() {
    {
        console.log('a')
    }
}

// after
function test() {
    console.log('a')
}
```

### [Split var declarations](lib/splitVarDeclarations.js)

```js
// before
function test() {
    var a = 1, b = 2
}

// after
function test() {
    var a = 1
    var b = 2
}
```

### [Square brackets](lib/squareBrackets.js)

```js
// before
console['log']('a')

// after
console.log('a')
```

### [Static function](lib/staticFunc.js)

```js
// before
function a() {
    return 1
}
console.log(a())

// after
console.log(1)
```

### [Static if](lib/staticIf.js)

```js
// before
function test() {
    if (1 == 1) {
        console.log('a')
    }
}

// after
function test() {
    console.log('a')
}
```

### [String concat](lib/stringConcat.js)

```js
// before
console.log('a' + 'b')

// after
console.log('ab')
```

### [Unwrap ternary](lib/unwrapTernary.js)

TODO

### [Void](lib/void.js)

```js
// before
var a = void 0

// after
var a = undefined
```
