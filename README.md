# JSX transform

Transpiles JSX into Javascript. `jsxtransform` lets your write HTML templates with Javascript in it (JSX) and transform them to `.js` files.

Usage:

```bash
jsxtransform SOURCE DEST
```

`SOURCE` is a directory with `.html` files and `DEST` is where the generated `.js` files will be saved to.

Turn this `TodoItem.html` file:

```html
<div class={component.done ? 'todo-item done' : 'todo-item'} data-id={component.id}>
    <span onclick={function(evt) { self.markComplete(evt, component.id); }}>{component.value}</span>
</div>
```

into this `TodoItem.js` file:

```javascript
var TodoItem = function (component){ var self = this; 
return h('div', {class: component.done ? 'todo-item done' : 'todo-item', 'data-id': component.id}, [
    h('span', {onclick: function(evt) { self.markComplete(evt, component.id); }}, [component.value])
]) };
```

The `.js` files can be included into a HTML page and DOM elements can be created with a hypertext generator, like the function below:

```javascript
/**
 * Hyperscript to HTML element
 * h('div',{'id':'hello'},[h('div',{'id':'world'},'welcome')])
 */
function h(tag, attributes) {
	var isComponent = 'string' != typeof tag,
		hasAttributes = null != attributes && attributes.constructor == Object,
		children = [].slice.call( arguments, hasAttributes ? 2 : 1 ),
		props, element, i, child;
	if (isComponent) { props = { children: children }; }
	else { element = document.createElement( tag ); }
	if (attributes && attributes.hasOwnProperty('if')) { // don't show the element when if evaluates to false
		if (attributes['if'] === false) { return null; } else { delete attributes['if']; }
	}
	if (hasAttributes) {
		for (attr in attributes) {
			if (isComponent) {
				props[attr] = attributes[attr];
			} else if (attr in element) {
				if (attr == 'style') { // style attribute must be an object
					if (attributes !== null && typeof attributes === 'object' && attributes.hasOwnProperty('style')) {
						var style = attributes.style;
						for (var key in style) {
							element.style[key] = style[key];
						}
					}
				} else { // all other attributes already in element
					element[attr] = attributes[attr];
				}
			} else { // all other attributes
				element.setAttribute(attr, attributes[attr]);
			}
		}
	}
	if (isComponent) { return tag(props); }
	while (children.length) {
		child = children.shift();
		if (null == child || child instanceof Array) {
			[].push.apply( children, child );
			continue;
		}
		if (!child.nodeType) {
			child = document.createTextNode('' + child);
		}
		element.appendChild(child);
	}
	return element;
}
```

The result is a convenient workflow that doesn't involve node modules and still gives you the ability to generate virtual DOM elements in the browser. The hypertext method is a small function so it doesn't hurt page load times. The code is also vanilla javascript and has no dependencies, further reducing bloat and load times.

Some small projects won't need node modules and you may want a binary to convert `.html` to `.js` files. In this case use the provided binaries:

Here I use `pkg` to generate binaries from your node modules.

Compile binary:

```bash
pkg jsxtransform.js
```

This will create a binary for linux, macos, and windows.