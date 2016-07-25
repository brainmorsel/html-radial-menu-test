function RadialMenu() {
  const self = this;
  this.html_elements = [];
  window.addEventListener('click', function(e) {
    if (e.button == 2) return;
    self.destroy();
  });
}

RadialMenu.prototype = {
  render: function(x, y, items) {
    const self = this;
    this.destroy();
    this.html_elements = items.map(function(item, index) {
      const EL_HEIGHT = 20;
      const EL_WIDTH = 200;
      const EL_MARGIN = 1;
      const MIN_RADIUS = 30;
      const menu_items = Math.ceil(items.length / 2) * 2;
      const radius = Math.max((EL_HEIGHT + EL_MARGIN * 2) * menu_items / 4, MIN_RADIUS);
      const anchor = self.calcRadiusPoint(x, y, radius, menu_items, index);
      const y_pos = `top:${anchor.y -EL_HEIGHT/2}px;`;
      var x_pos;
      if (anchor.x >= x) {
        x_pos = `left:${anchor.x}px;`;
      } else {
        x_pos = `left:${anchor.x - EL_WIDTH}px; text-align:right;`;
      }
      if (index == 0 || index == menu_items / 2) {
        x_pos = `left:${anchor.x - EL_WIDTH/2}px; text-align:center;`;
      }
      const el_cont = document.createElement('div');
      const el = document.createElement('span');
      el.className = 'menu-item';
      el.textContent = index + '. ' + item.title;
      el_cont.style = `
        position:absolute;
        ${x_pos}
        ${y_pos}
        width:${EL_WIDTH}px;
        height:${EL_HEIGHT}px;
      `;

      const action = item.action;
      el.onclick = function() {
        this.destroy();
        action();
      }.bind(self);

      el_cont.appendChild(el);
      document.body.appendChild(el_cont);
      
      return el_cont;
    });
  },
  destroy: function() {
    for(var idx = 0; idx < this.html_elements.length; idx++) {
      document.body.removeChild(this.html_elements[idx]);
    }
    this.html_elements = [];
  },
  calcRadiusPoint: function(x, y, radius, n, index) {
    const angle = (Math.PI / 2) + 2 * Math.PI / n * index;
    const dx = radius * Math.cos(angle);
    const step = radius / (n / 4);
    var dy;
    const n_half = Math.floor(n / 2);
    if (index <= n_half) {
      dy = step * index - radius;
    } else {
      dy = step * (n - index) - radius;
    }
    return {
      x: x - dx,
      y: y + dy,
    };
  },
};


const menu = new RadialMenu();
const items = [];
const items_n = 7;
for (var idx = 0; idx < items_n; idx++) {
  function make_item(idx) {
    return {title: `Test ${idx}`, action: function(){console.log(`Test ${idx}`)}};
  }
  items.push(make_item(idx));
}

window.addEventListener('contextmenu', function (e) {
  menu.render(e.clientX, e.clientY, items);
  e.preventDefault(e);
});
