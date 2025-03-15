// V-PP style window calculations
export function calculateVPP(formData) {
  const { width, height, quantity, frameType, gridType, glassType } = formData;
  
  // Convert inches to mm
  const w = width * 25.4;
  const h = height * 25.4;
  const q = quantity;

  // Frame calculations based on frame type
  const frameCalc = calculateFrame(w, h, frameType);

  // Parts calculations - varies by frame type
  const partsCalc = calculateParts(w, h, frameType);

  // Glass calculations - varies by frame type
  const glassCalc = calculateGlass(w, h, frameType);

  // Grid calculations
  const gridCalc = {
    fixed: {
      width: (parseFloat(glassCalc.fixed.width) - 18 - 2).toFixed(0),
      height: (parseFloat(glassCalc.fixed.height) - 18 - 2).toFixed(0)
    }
  };

  // Grid pattern calculations based on gridType
  const gridPattern = calculateGridPattern(formData, gridCalc, q);

  // Calculate glass orders based on glass type
  const glassOrders = calculateGlassOrders(formData, glassCalc);

  return {
    frame: frameCalc,
    parts: partsCalc,
    glass: glassCalc,
    grid: gridCalc,
    gridPattern,
    glassOrders,
    style: "V-PP",
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

function calculateParts(w, h, frameType) {
  let coverw, coverh, bigmullion;

  if (frameType === "Nailon") {
    coverw = ((w - 14 * 2 - 15 * 2 - 22 * 2 - 3 - 13) / 25.4).toFixed(3);
    coverh = ((h / 2 - 6 - 14 * 2 - 15) / 25.4).toFixed(3);
    bigmullion = ((w - 14 * 2 - 15 * 2 - 2 + 1.5) / 25.4).toFixed(3);
  } else {
    coverw = ((w - 14 * 2 - 22 * 2 - 3 - 13) / 25.4).toFixed(3);
    coverh = ((h / 2 - 6 - 14 * 2 - 15) / 25.4).toFixed(3);
    bigmullion = ((w - 14 * 2 - 2 + 1.5) / 25.4).toFixed(3);
  }

  const result = {
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

function calculateGlass(w, h, frameType) {
  let fixedglassw, fixedglassh;

  if (frameType === "Nailon") {
    fixedglassw = w - 20.5 * 2 - 3 * 2 - 15 * 2 - 2;
    fixedglassh = h / 2 - 6 - 20.5 * 2 - 3 * 2 - 15 - 3;
  } else {
    fixedglassw = w - 20.5 * 2 - 3 * 2 - 2;
    fixedglassh = h / 2 - 6 - 20.5 * 2 - 3 * 2 - 3;
  }

  return {
    fixed: {
      width: fixedglassw.toFixed(1),
      height: fixedglassh.toFixed(1)
    }
  };
}

function calculateGridPattern(formData, gridCalc, q) {
  const { gridType } = formData;
  
  switch(gridType) {
    case "Standard":
      return {
        fixed: {
          width: gridCalc.fixed.width,
          height: gridCalc.fixed.height
        }
      };
    case "Marginal":
      return {
        fixed: {
          widthQty: (q * 4).toString(),
          widthHole: "102",
          heightQty: (q * 4).toString(),
          heightHole: "102"
        }
      };
    case "Perimeter":
      return {
        fixed: {
          widthQty: (q * 4).toString(),
          widthHole: "102",
          heightQty: (q * 4).toString(),
          heightHole: "102"
        }
      };
  }
  return {};
}

function calculateGlassOrders(formData, glassCalc) {
  const { customer, style, width, height, quantity, glassType } = formData;
  const orders = [];
  const q = quantity;

  const addGlassOrder = (id, qty, type, treatment, glass) => {
    orders.push({
      customer,
      style,
      width: width.toString(),
      height: height.toString(),
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
        addGlassOrder("--01", 4 * q, "clear", treatment, glassCalc.fixed);
        if (isTempered) {
          addOrder("--01", 4 * q, "Clear", glassCalc.fixed);
        }
        break;

      case "Clear/Lowe2":
        addGlassOrder("--01", 2 * q, "clear", treatment, glassCalc.fixed);
        addGlassOrder("--01", 2 * q, "lowe2", treatment, glassCalc.fixed);
        if (isTempered) {
          addOrder("--01", 2 * q, "Clear", glassCalc.fixed);
          addOrder("--01", 2 * q, "Lowe270", glassCalc.fixed);
        }
        break;

      case "Clear/Lowe3":
        addGlassOrder("--01", 2 * q, "clear", treatment, glassCalc.fixed);
        addGlassOrder("--01", 2 * q, "lowe3", treatment, glassCalc.fixed);
        if (isTempered) {
          addOrder("--01", 2 * q, "Clear", glassCalc.fixed);
          addOrder("--01", 2 * q, "Lowe366", glassCalc.fixed);
        }
        break;

      case "OBS/Clear":
        addGlassOrder("--01", 2 * q, "clear", treatment, glassCalc.fixed);
        addGlassOrder("--01", 2 * q, "OBS", treatment, glassCalc.fixed);
        if (isTempered) {
          addOrder("--01", 2 * q, "Clear", glassCalc.fixed);
          addOrder("--01", 2 * q, "P516", glassCalc.fixed);
        }
        break;

      case "OBS/Lowe2":
        addGlassOrder("--01", 2 * q, "lowe2", treatment, glassCalc.fixed);
        addGlassOrder("--01", 2 * q, "OBS", treatment, glassCalc.fixed);
        if (isTempered) {
          addOrder("--01", 2 * q, "Lowe270", glassCalc.fixed);
          addOrder("--01", 2 * q, "P516", glassCalc.fixed);
        }
        break;

      case "OBS/Lowe3":
        addGlassOrder("--01", 2 * q, "lowe3", treatment, glassCalc.fixed);
        addGlassOrder("--01", 2 * q, "OBS", treatment, glassCalc.fixed);
        if (isTempered) {
          addOrder("--01", 2 * q, "Lowe366", glassCalc.fixed);
          addOrder("--01", 2 * q, "P516", glassCalc.fixed);
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