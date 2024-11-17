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
      new Logic(c1, els[clicked_id].name, stx, sty);
      stx += 20;
      sty += 20
      mx = clientX - els[clicked_id].x;
      my = clientY - els[clicked_id].y;
      clicked_id = objs.get(c1).get(Logic).length - 1
    }
    
}

function panelUp(event) {
  down = 0;
  if (mousedownID != -1) {
    clearInterval(mousedownID);
    mousedownID = -1;
    objs.get(c1).get(Logic)[clicked_id].del()
  }

}