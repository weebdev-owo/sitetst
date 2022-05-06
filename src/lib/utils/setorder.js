const need_to_set_order = true
  //if (need_to_set_order){orders = setOrder(children)}

function setOrder(children){
    let ord = {}
    let valid = []
    let invalid = []
  
    //determine which slides have an order specified
    for(let i=0; i<children.length-1; i++){
      if (children[i].order){valid.append(i)}
      else {invalid.append(i)}
    }
    const ords = valid + invalid
    for (let i=1; i<ords.length; i++){ord[`${i}`] = children[ords[i]]}
    //set the specified orders first then all children without order prop are then added in order of position
    for(let i=1; i<valid.length; i++){
      ord[`${i}`] = children[valid[i]]
    }
  }