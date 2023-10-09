class Panel {
    static draw() {
      if(c2 != undefined) {
        Draw.drawall(objs.get(c2),false,cPl,ctxPl,'ctxPl')
      }
    }
}
function panelDown(event) {
    els = objs.get(c2).get(Logic)
    const rect = cPl.getBoundingClientRect()
    const clientX = event.clientX - rect.left
    const clientY = event.clientY - rect.top

    els.forEach((l, i) => {
      if (l.clicked(clientX, clientY)) {
        clicked_id = i;
      }
    })
    if (clicked_id > -1) {
      objs2 = objs.get(c1);
      objs.set(c1, objs2);
      new Logic(c1, els[clicked_id].name, 100, 100)
    }
    clicked_id = objs.get(c1).get(Logic).length - 1
    whilemousedown();
    mousedownID = setInterval(whilemousedown, 16);
}

function panelUp(event) {
  down = 0;
  console.log(mousedownID)
  if (mousedownID != -1) {
    clearInterval(mousedownID);
    mousedownID = -1;
    objs.get(c1).get(Logic)[clicked_id].del()
  }

}