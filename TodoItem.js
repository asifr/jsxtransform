var TodoItem = function (component){ var self = this; 
return h('div', {class: component.done ? 'todo-item done' : 'todo-item', 'data-id': component.id}, [
    h('span', {onclick: function(evt) { self.markComplete(evt, component.id); }}, [component.value])
]) };
