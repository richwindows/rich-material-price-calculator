// XO-PP-OX-PP style window calculations
export function calculateXO_PP_OX_PP(formData) {
  const { width, height, fixedHeight, quantity, frameType, gridType, glassType, topBottom } = formData;
  
  // Convert inches to mm
  const w = width * 25.4;
  const h = height * 25.4;
  const fh = fixedHeight * 25.4;
  const q = quantity;

  // Frame calculations based on frame type
  const frameCalc = calculateFrame(w, h, frameType);

  // Sash calculations
  const sashCalc = calculateSash(w, h, fh, frameType);

  // Screen calculations
  const screenCalc = calculateScreen(w, h, fh, frameType);

  // Parts calculations
  const partsCalc = calculateParts(w, h, fh, frameType);

  // Glass calculations
  const glassCalc = calculateGlass(w, h, fh, frameType);

  // Grid calculations
  const gridCalc = {
    sash: {
      width: (parseFloat(glassCalc.sash.width) - 18 - 2).toFixed(0),
      height: (parseFloat(glassCalc.sash.height) - 18 - 2).toFixed(0)
    },
    fixed: {
      width: (parseFloat(glassCalc.fixed.width) - 18 - 2).toFixed(0),
      height: (parseFloat(glassCalc.fixed.height) - 18 - 2).toFixed(0)
    },
    fixed2: {
      width: (parseFloat(glassCalc.fixed2.width) - 18 - 2).toFixed(0),
      height: (parseFloat(glassCalc.fixed2.height) - 18 - 2).toFixed(0)
    }
  };

  // Grid pattern calculations based on gridType
  const gridPattern = calculateGridPattern(formData, gridCalc, q);

  // Calculate glass orders based on glass type
  const glassOrders = calculateGlassOrders(formData, glassCalc);

  return {
    frame: frameCalc,
    sash: sashCalc,
    screen: screenCalc,
    parts: partsCalc,
    glass: glassCalc,
    grid: gridCalc,
    gridPattern,
    glassOrders,
    style: "XO-PP-OX-PP",
    frameType: frameType || "Nailon"
  };
}

function calculateFrame(w, h, frameType) {
  const framew = ((w + 3 * 2) / 25.4).toFixed(3);
  const frameh = ((h + 3 * 2) / 25.4).toFixed(3);

  switch(frameType) {
    case "Retrofit":
      return {
        width1: framew,
        height1: frameh,
        quantity1: "2",
        type: "retrofit"
      };
    case "Block":
      return {
        width3: framew,
        height3: frameh,
        quantity3: "2",
        type: "block"
      };
    case "Block-1 3/4":
      return {
        width1: framew,
        quantity1: "1",
        width3: framew,
        quantity3: "1",
        height3: frameh,
        quantity4: "2",
        type: "block-1-3-4"
      };
    case "Block-slop":
      return {
        width3: framew,
        height3: frameh,
        quantity3: "2",
        type: "block-slop"
      };
    default: // Nailon
      return {
        width2: framew,
        height2: frameh,
        quantity2: "2",
        type: "nailon"
      };
  }
}

function calculateSash(w, h, fh, frameType) {
  if (frameType === "Nailon") {
    return {
      width: ((w / 2 - 14.5 - 15 + 1) / 25.4).toFixed(3),
      height: ((h - fh - 6 - 46 - 15 - 2) / 25.4).toFixed(3),
      quantity: "2"
    };
  } else {
    return {
      width: ((w / 2 - 14.5 + 1) / 25.4).toFixed(3),
      height: ((h - fh - 6 - 46 - 2) / 25.4).toFixed(3),
      quantity: "2"
    };
  }
}

function calculateScreen(w, h, fh, frameType) {
  if (frameType === "Nailon") {
    return {
      width: (w / 2 - 75 - 15 - 2).toFixed(0),
      height: (h - fh - 6 - 87 - 15 - 4).toFixed(0),
      quantity: "2"
    };
  } else {
    return {
      width: (w / 2 - 75 - 2).toFixed(0),
      height: (h - fh - 6 - 87 - 4).toFixed(0),
      quantity: "2"
    };
  }
}

function calculateParts(w, h, fh, frameType) {
  let mullion, mullionActual, handleA, track, coverw, coverh, bigmullion, bigmullion2;

  if (frameType === "Nailon") {
    mullion = ((h - fh - 6 - 36 - 15) / 25.4).toFixed(3);
    mullionActual = ((h - fh - 6 - 36 - 15) / 25.4 - 2).toFixed(1);
    handleA = ((h - fh - 6 - 46 - 15) / 25.4 / 2 + 4).toFixed(0);
    track = ((w - 14 * 2 - 15 * 2 - 3 - 20) / 25.4).toFixed(1);
    coverw = ((w / 2 - 6 - 14 * 2 - 15 - 3 - 13) / 25.4).toFixed(3);
    coverh = ((fh - 6 - 14 * 2 - 15 - 22 * 2) / 25.4).toFixed(3);
    bigmullion = ((w - 14 * 2 - 15 * 2 - 2 + 1.5) / 25.4).toFixed(3);
    bigmullion2 = ((fh - 6 - 14 * 2 - 15 - 2 + 1.5) / 25.4).toFixed(3);
  } else {
    mullion = ((h - fh - 6 - 36) / 25.4).toFixed(3);
    mullionActual = ((h - fh - 6 - 36) / 25.4 - 2).toFixed(1);
    handleA = ((h - fh - 6 - 46) / 25.4 / 2 + 4).toFixed(0);
    track = ((w - 14 * 2 - 3 - 20) / 25.4).toFixed(1);
    coverw = ((w / 2 - 6 - 14 * 2 - 3 - 13) / 25.4).toFixed(3);
    coverh = ((fh - 6 - 14 * 2 - 22 * 2) / 25.4).toFixed(3);
    bigmullion = ((w - 14 * 2 - 2 + 1.5) / 25.4).toFixed(3);
    bigmullion2 = ((fh - 6 - 14 * 2 - 2 + 1.5) / 25.4).toFixed(3);
  }

  const result = {
    mullion,
    mullionActual,
    handlePosition: handleA,
    track,
    coverWidth: coverw + "x2",
    coverHeight: coverh + "x2",
    bigMullion: bigmullion,
    bigMullionQty: "1",
    bigMullion2: bigmullion2,
    bigMullion2Qty: "1"
  };

  if (frameType === "Block-slop") {
    result.slop = ((w - 10) / 25.4).toFixed(1);
  }

  return result;
}

function calculateGlass(w, h, fh, frameType) {
  let sashglassw, sashglassh, fixedglassw, fixedglassh, fixedglass2w, fixedglass2h;

  if (frameType === "Nailon") {
    sashglassw = w / 2 - 77 - 15;
    sashglassh = h - fh - 6 - 109 - 15 - 3 - 2;
    fixedglassw = w / 2 - 44 - 15;
    fixedglassh = h - fh - 6 - 47 - 15 - 2;
    fixedglass2w = w / 2 - 6 - 20.5 * 2 - 3 * 2 - 15;
    fixedglass2h = fh - 6 - 20.5 * 2 - 3 * 2 - 15 - 2;
  } else {
    sashglassw = w / 2 - 77;
    sashglassh = h - fh - 6 - 109 - 3 - 2;
    fixedglassw = w / 2 - 44;
    fixedglassh = h - fh - 6 - 47 - 2;
    fixedglass2w = w / 2 - 6 - 20.5 * 2 - 3 * 2;
    fixedglass2h = fh - 6 - 20.5 * 2 - 3 * 2 - 2;
  }

  return {
    sash: {
      width: sashglassw.toFixed(1),
      height: sashglassh.toFixed(1)
    },
    fixed: {
      width: fixedglassw.toFixed(1),
      height: fixedglassh.toFixed(1)
    },
    fixed2: {
      width: fixedglass2w.toFixed(1),
      height: fixedglass2h.toFixed(1)
    }
  };
}

function calculateGridPattern(formData, gridCalc, q) {
  const { gridType } = formData;
  
  switch(gridType) {
    case "Standard":
      return {
        sash: {
          width: gridCalc.sash.width,
          height: gridCalc.sash.height
        },
        fixed: {
          width: gridCalc.fixed.width,
          height: gridCalc.fixed.height
        },
        fixed2: {
          width: gridCalc.fixed2.width,
          height: gridCalc.fixed2.height
        }
      };
    case "Marginal":
      return {
        sash: {
          widthQty: (q * 2).toString(),
          heightQty: (q * 2).toString(),
          widthHole: "69.5",
          heightHole: "102"
        },
        fixed: {
          widthQty: (q * 2).toString(),
          heightQty: (q * 2).toString(),
          widthHole: "102",
          heightHole: "102"
        },
        fixed2: {
          widthQty: "2",
          heightQty: "2",
          widthHole: "102",
          heightHole: "102"
        }
      };
    case "Perimeter":
      return {
        sash: {
          widthQty: (q * 1).toString(),
          heightQty: (q * 1).toString(),
          widthHole: "102",
          heightHole: "102"
        },
        fixed: {
          widthQty: (q * 1).toString(),
          heightQty: (q * 1).toString(),
          widthHole: "102",
          heightHole: "102"
        },
        fixed2: {
          widthQty: "1",
          heightQty: "2",
          widthHole: "102",
          heightHole: "102"
        }
      };
  }
  return {};
}

function calculateGlassOrders(formData, glassCalc) {
  const { customer, style, width, height, fixedHeight, quantity, glassType, topBottom } = formData;
  const orders = [];
  const q = quantity;

  const addGlassOrder = (id, qty, type, treatment, glass) => {
    orders.push({
      customer,
      style,
      width: width.toString(),
      height: height.toString(),
      fixedHeight: fixedHeight.toString(),
      id,
      qty,
      glassType: type,
      treatment,
      glassWidth: glass.width,
      glassHeight: glass.height
    });
  };

  const addOrder = (id, qty, type, glass) => {
    orders.push({
      customer,
      style,
      width: width.toString(),
      height: height.toString(),
      fixedHeight: fixedHeight.toString(),
      id,
      qty,
      glassType: type,
      treatment: "Tempered",
      glassWidth: glass.width,
      glassHeight: glass.height
    });
  };

  const processGlassType = (type, isTempered = false) => {
    const treatment = isTempered ? "T" : "";
    
    switch(type) {
      case "Clear/Clear":
        addGlassOrder("--01", 2 * q, "clear", treatment, glassCalc.sash);
        addGlassOrder("--02", 2 * q, "clear", treatment, glassCalc.fixed);
        if (topBottom === "1" || isTempered) {
          addGlassOrder("--03", 4 * q, "clear", "T", glassCalc.fixed2);
          addOrder("--03", 4 * q, "Clear", glassCalc.fixed2);
        } else {
          addGlassOrder("--03", 4 * q, "clear", "", glassCalc.fixed2);
        }
        if (isTempered) {
          addOrder("--01", 2 * q, "Clear", glassCalc.sash);
          addOrder("--02", 2 * q, "Clear", glassCalc.fixed);
        }
        break;

      case "Clear/Lowe2":
      case "Clear/Lowe3":
      case "OBS/Clear":
      case "OBS/Lowe2":
      case "OBS/Lowe3":
        const [type1, type2] = type.split("/");
        const glassType1 = type1.toLowerCase();
        const glassType2 = type2.toLowerCase();
        const orderType1 = type1 === "OBS" ? "P516" : type1 === "Clear" ? "Clear" : type2 === "Lowe2" ? "Lowe270" : "Lowe366";
        const orderType2 = type2 === "Clear" ? "Clear" : type2 === "Lowe2" ? "Lowe270" : "Lowe366";

        if (type === "OBS/Lowe2" || type === "OBS/Lowe3") {
          addGlassOrder("--01", 1 * q, glassType2, treatment, glassCalc.sash);
          addGlassOrder("--01", 1 * q, glassType1, treatment, glassCalc.sash);
          addGlassOrder("--02", 1 * q, glassType2, treatment, glassCalc.fixed);
          addGlassOrder("--02", 1 * q, glassType1, treatment, glassCalc.fixed);
          addGlassOrder("--03", 2 * q, glassType2, treatment, glassCalc.fixed2);
          addGlassOrder("--03", 2 * q, glassType1, treatment, glassCalc.fixed2);

          if (isTempered) {
            addOrder("--01", 1 * q, orderType2, glassCalc.sash);
            addOrder("--01", 1 * q, orderType1, glassCalc.sash);
            addOrder("--02", 1 * q, orderType2, glassCalc.fixed);
            addOrder("--02", 1 * q, orderType1, glassCalc.fixed);
            addOrder("--03", 2 * q, orderType2, glassCalc.fixed2);
            addOrder("--03", 2 * q, orderType1, glassCalc.fixed2);
          }
        } else {
          addGlassOrder("--01", 1 * q, glassType1, treatment, glassCalc.sash);
          addGlassOrder("--01", 1 * q, glassType2, treatment, glassCalc.sash);
          addGlassOrder("--02", 1 * q, glassType1, treatment, glassCalc.fixed);
          addGlassOrder("--02", 1 * q, glassType2, treatment, glassCalc.fixed);
          addGlassOrder("--03", 2 * q, glassType1, treatment, glassCalc.fixed2);
          addGlassOrder("--03", 2 * q, glassType2, treatment, glassCalc.fixed2);

          if (isTempered) {
            addOrder("--01", 1 * q, orderType1, glassCalc.sash);
            addOrder("--01", 1 * q, orderType2, glassCalc.sash);
            addOrder("--02", 1 * q, orderType1, glassCalc.fixed);
            addOrder("--02", 1 * q, orderType2, glassCalc.fixed);
            addOrder("--03", 2 * q, orderType1, glassCalc.fixed2);
            addOrder("--03", 2 * q, orderType2, glassCalc.fixed2);
          }
        }
        break;
    }
  };

  if (glassType.endsWith("Tmp")) {
    processGlassType(glassType.replace(" Tmp", ""), true);
  } else {
    processGlassType(glassType);
  }

  return orders;
}