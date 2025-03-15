// PSH style window calculations
export function calculatePSH(formData) {
  const { width, height, fixedHeight, quantity, frameType, gridType, glassType, topBottom } = formData;
  
  // Convert inches to mm
  const w = width * 25.4;
  const h = height * 25.4;
  const fh = fixedHeight * 25.4;
  const q = quantity;

  // Frame calculations based on frame type
  const frameCalc = calculateFrame(w, h, frameType);

  // Sash calculations - varies by frame type
  const sashCalc = calculateSash(w, h, fh, frameType);

  // Screen calculations - varies by frame type
  const screenCalc = calculateScreen(w, h, fh, frameType);

  // Parts calculations - varies by frame type
  const partsCalc = calculateParts(w, h, fh, frameType);

  // Glass calculations - varies by frame type
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
    style: "PSH",
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
      width: ((w - 47.4 - 15 * 2 - 2) / 25.4).toFixed(3),
      height: (((h - fh - 6) / 2 - 17.1 - 15 + 1) / 25.4).toFixed(3),
      quantity: "2"
    };
  } else {
    return {
      width: ((w - 47.4 - 2) / 25.4).toFixed(3),
      height: (((h - fh - 6) / 2 - 17.1 + 1) / 25.4).toFixed(3),
      quantity: "2"
    };
  }
}

function calculateScreen(w, h, fh, frameType) {
  if (frameType === "Nailon") {
    return {
      width: (w - 87 - 15 * 2 - 4).toFixed(0),
      height: ((h - fh - 6) / 2 - 75 - 15 - 5).toFixed(0),
      quantity: "2"
    };
  } else {
    return {
      width: (w - 87 - 4).toFixed(0),
      height: ((h - fh - 6) / 2 - 75 - 5).toFixed(0),
      quantity: "2"
    };
  }
}

function calculateParts(w, h, fh, frameType) {
  let mullion, mullionActual, handleA, coverw, coverh, bigmullion;

  if (frameType === "Nailon") {
    mullion = ((w - 36 - 15 * 2) / 25.4).toFixed(3);
    mullionActual = ((w - 36 + 1 - 15 * 2) / 25.4 - 2).toFixed(1);
    handleA = ((w - 46 - 15 * 2) / 25.4 / 2 + 4).toFixed(0);
    coverw = ((w - 14 * 2 - 15 * 2 - 3 - 13) / 25.4).toFixed(3);
    coverh = ((fh - 6 - 14 * 2 - 15 - 22 * 2) / 25.4).toFixed(3);
    bigmullion = ((w - 14 * 2 - 15 * 2 - 2 + 1.5) / 25.4).toFixed(3);
  } else {
    mullion = ((w - 36) / 25.4).toFixed(3);
    mullionActual = ((w - 36 + 1) / 25.4 - 2).toFixed(1);
    handleA = ((w - 46) / 25.4 / 2 + 4).toFixed(0);
    coverw = ((w - 14 * 2 - 3) / 25.4).toFixed(3);
    coverh = ((fh - 6 - 14 * 2 - 22 * 2) / 25.4).toFixed(3);
    bigmullion = ((w - 14 * 2 - 2 + 1.5) / 25.4).toFixed(3);
  }

  const result = {
    mullion,
    mullionActual,
    handlePosition: handleA,
    coverWidth: coverw,
    coverHeight: coverh,
    bigMullion: bigmullion,
    bigMullionQty: "1"
  };

  if (frameType === "Block-slop") {
    result.slop = ((w - 10) / 25.4).toFixed(1);
  }

  return result;
}

function calculateGlass(w, h, fh, frameType) {
  if (frameType === "Nailon") {
    return {
      sash: {
        width: (w - 110 - 15 * 2 - 2).toFixed(1),
        height: ((h - fh - 6) / 2 - 79.7 - 15 - 1).toFixed(1)
      },
      fixed: {
        width: (w - 47 - 15 * 2).toFixed(1),
        height: ((h - fh - 6) / 2 - 44.2 - 15 - 1).toFixed(1)
      },
      fixed2: {
        width: (w - 47 - 15 * 2).toFixed(1),
        height: (fh - 6 - 20.5 * 2 - 3 * 2 - 15 - 1).toFixed(1)
      }
    };
  } else {
    return {
      sash: {
        width: (w - 110 - 2).toFixed(1),
        height: ((h - fh - 6) / 2 - 79.7 - 1).toFixed(1)
      },
      fixed: {
        width: (w - 47).toFixed(1),
        height: ((h - fh - 6) / 2 - 44.2 - 1).toFixed(1)
      },
      fixed2: {
        width: (w - 47).toFixed(1),
        height: (fh - 6 - 20.5 * 2 - 3 * 2 - 1).toFixed(1)
      }
    };
  }
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
          widthHole: "69.5",
          heightQty: (q * 2).toString(),
          heightHole: "102"
        },
        fixed: {
          widthQty: (q * 2).toString(),
          widthHole: "102",
          heightQty: (q * 2).toString(),
          heightHole: "102"
        },
        fixed2: {
          widthQty: (q * 2).toString(),
          widthHole: "102",
          heightQty: (q * 2).toString(),
          heightHole: "102"
        }
      };
    case "Perimeter":
      return {
        sash: {
          widthQty: (q * 1).toString(),
          widthHole: "102",
          heightQty: (q * 1).toString(),
          heightHole: "102"
        },
        fixed: {
          widthQty: (q * 1).toString(),
          widthHole: "102",
          heightQty: (q * 1).toString(),
          heightHole: "102"
        },
        fixed2: {
          widthQty: "1",
          widthHole: "102",
          heightQty: "2",
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
        if (topBottom === "1") {
          addGlassOrder("--01", 2 * q, "clear", "T", glassCalc.sash);
          addGlassOrder("--02", 2 * q, "clear", "T", glassCalc.fixed);
          addOrder("--01", 2 * q, "Clear", glassCalc.sash);
          addOrder("--02", 2 * q, "Clear", glassCalc.fixed);
        } else {
          addGlassOrder("--01", 2 * q, "clear", "", glassCalc.sash);
          addGlassOrder("--02", 2 * q, "clear", "", glassCalc.fixed);
        }
        addGlassOrder("--03", 2 * q, "clear", "", glassCalc.fixed2);
        break;

      case "Clear/Lowe2":
        if (topBottom === "1") {
          addGlassOrder("--01", 1 * q, "clear", "T", glassCalc.sash);
          addGlassOrder("--01", 1 * q, "lowe2", "T", glassCalc.sash);
          addGlassOrder("--02", 1 * q, "clear", "T", glassCalc.fixed);
          addGlassOrder("--02", 1 * q, "lowe2", "T", glassCalc.fixed);
          addOrder("--01", 1 * q, "Clear", glassCalc.sash);
          addOrder("--01", 1 * q, "Lowe270", glassCalc.sash);
          addOrder("--02", 1 * q, "Clear", glassCalc.fixed);
          addOrder("--02", 1 * q, "Lowe270", glassCalc.fixed);
        } else {
          addGlassOrder("--01", 1 * q, "clear", "", glassCalc.sash);
          addGlassOrder("--01", 1 * q, "lowe2", "", glassCalc.sash);
          addGlassOrder("--02", 1 * q, "clear", "", glassCalc.fixed);
          addGlassOrder("--02", 1 * q, "lowe2", "", glassCalc.fixed);
        }
        addGlassOrder("--03", 1 * q, "clear", "", glassCalc.fixed2);
        addGlassOrder("--03", 1 * q, "lowe2", "", glassCalc.fixed2);
        break;

      case "Clear/Lowe3":
        if (topBottom === "1") {
          addGlassOrder("--01", 1 * q, "clear", "T", glassCalc.sash);
          addGlassOrder("--01", 1 * q, "lowe3", "T", glassCalc.sash);
          addGlassOrder("--02", 1 * q, "clear", "T", glassCalc.fixed);
          addGlassOrder("--02", 1 * q, "lowe3", "T", glassCalc.fixed);
          addOrder("--01", 1 * q, "Clear", glassCalc.sash);
          addOrder("--01", 1 * q, "Lowe366", glassCalc.sash);
          addOrder("--02", 1 * q, "Clear", glassCalc.fixed);
          addOrder("--02", 1 * q, "Lowe366", glassCalc.fixed);
        } else {
          addGlassOrder("--01", 1 * q, "clear", "", glassCalc.sash);
          addGlassOrder("--01", 1 * q, "lowe3", "", glassCalc.sash);
          addGlassOrder("--02", 1 * q, "clear", "", glassCalc.fixed);
          addGlassOrder("--02", 1 * q, "lowe3", "", glassCalc.fixed);
        }
        addGlassOrder("--03", 1 * q, "clear", "", glassCalc.fixed2);
        addGlassOrder("--03", 1 * q, "lowe3", "", glassCalc.fixed2);
        break;

      case "OBS/Clear":
        if (topBottom === "1") {
          addGlassOrder("--01", 1 * q, "clear", "T", glassCalc.sash);
          addGlassOrder("--01", 1 * q, "OBS", "T", glassCalc.sash);
          addGlassOrder("--02", 1 * q, "clear", "T", glassCalc.fixed);
          addGlassOrder("--02", 1 * q, "OBS", "T", glassCalc.fixed);
          addOrder("--01", 1 * q, "Clear", glassCalc.sash);
          addOrder("--01", 1 * q, "P516", glassCalc.sash);
          addOrder("--02", 1 * q, "Clear", glassCalc.fixed);
          addOrder("--02", 1 * q, "P516", glassCalc.fixed);
        } else {
          addGlassOrder("--01", 1 * q, "clear", "", glassCalc.sash);
          addGlassOrder("--01", 1 * q, "OBS", "", glassCalc.sash);
          addGlassOrder("--02", 1 * q, "clear", "", glassCalc.fixed);
          addGlassOrder("--02", 1 * q, "OBS", "", glassCalc.fixed);
        }
        addGlassOrder("--03", 1 * q, "clear", "", glassCalc.fixed2);
        addGlassOrder("--03", 1 * q, "OBS", "", glassCalc.fixed2);
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