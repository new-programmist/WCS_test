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
}