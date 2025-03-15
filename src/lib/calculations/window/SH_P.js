// SH-P (Sliding High Picture) Window style calculations
export function calculateSH_P(formData) {
  const { 
    width, 
    height, 
    fixedHeight,
    frame: frameType, 
    grid: gridType, 
    glass: glassType,
    gridW,
    gridH,
    quantity = 1,
    customer = '',
    style = '',
    topBottom = ''
  } = formData;

  // Convert inches to mm
  const w = width * 25.4;
  const h = height * 25.4;
  const fh = fixedHeight * 25.4;
  const q = parseInt(quantity);

  let result = {
    frame: {},
    sash: {},
    screen: {},
    parts: {},
    glass: {},
    grid: {},
    orders: []
  };

  if (frameType === 'nailon') {
    // Frame calculations
    const framew = roundToThree((w + 3 * 2) / 25.4);
    const frameh = roundToThree((h + 3 * 2) / 25.4);
    result.frame = {
      width: framew,
      height: frameh,
      quantity: {
        width: 2,
        height: 2
      }
    };

    // Sash calculations
    const sashw = roundToThree((w - 47.4 - 15 * 2 - 2) / 25.4);
    const sashh = roundToThree(((h - fh) / 2 - 6 - 17.1 + 1) / 25.4);
    result.sash = {
      width: sashw,
      height: sashh,
      quantity: {
        width: 1,
        height: 2,
        extra: 1
      }
    };

    // Screen calculations
    const screenw = Math.round(w - 87 - 15 * 2 - 4);
    const screenh = Math.round((h - fh) / 2 - 6 - 75 - 5);
    result.screen = {
      width: screenw,
      height: screenh,
      quantity: {
        width: 2,
        height: 2
      }
    };

    // Parts calculations
    const mullion = roundToThree((w - 36 - 15 * 2) / 25.4);
    const mullionA = roundToOne((w - 36 + 1 - 15 * 2) / 25.4 - 2);
    const handleA = Math.round((w - 46 - 15 * 2) / 25.4 / 2 + 4);
    const coverw = roundToThree((w - 14 * 2 - 15 * 2 - 3 - 13) / 25.4);
    const coverh = roundToThree((fh - 6 - 14 * 2 - 15 - 22 * 2) / 25.4);
    const bigmullion = roundToThree((w - 14 * 2 - 15 * 2 - 2 + 1.5) / 25.4);

    result.parts = {
      mullion,
      mullionA,
      handleA,
      handleQuantity: 1,
      coverWidth: coverw,
      coverHeight: coverh,
      bigMullion: bigmullion,
      bigMullionQuantity: 1
    };

    // Glass calculations
    const sashglassw = w - 110 - 15 * 2 - 2;
    const sashglassh = (h - fh) / 2 - 6 - 79.7 - 1;
    const fixedglassw = w - 47 - 15 * 2;
    const fixedglassh = (h - fh - 6) / 2 - 44.2 - 15 - 1;
    const fixedglass2w = w - 47 - 15 * 2;
    const fixedglass2h = fh - 6 - 20.5 * 2 - 3 * 2 - 15 - 1;

    result.glass = {
      sash: {
        width: sashglassw,
        height: sashglassh
      },
      fixed: {
        width: fixedglassw,
        height: fixedglassh
      },
      fixed2: {
        width: fixedglass2w,
        height: fixedglass2h
      }
    };

    // Grid calculations
    if (gridType) {
      const sashgridw = Math.round(sashglassw - 18 - 2);
      const sashgridh = Math.round(sashglassh - 18 - 2);
      const fixedgridw = Math.round(fixedglassw - 18 - 2);
      const fixedgridh = Math.round(fixedglassh - 18 - 2);
      const fixedgrid2w = Math.round(fixedglass2w - 18 - 2);
      const fixedgrid2h = Math.round(fixedglass2h - 18 - 2);

      result.grid = {
        sash: {
          width: sashgridw,
          height: sashgridh
        },
        fixed: {
          width: fixedgridw,
          height: fixedgridh
        },
        fixed2: {
          width: fixedgrid2w,
          height: fixedgrid2h
        }
      };

      if (gridType === 'Standard') {
        // Standard grid - quantities from gridW/gridH
      } else if (gridType === 'Marginal') {
        result.grid.sash.widthQuantity = q * 2;
        result.grid.sash.heightQuantity = q * 2;
        result.grid.sash.widthHole = 69.5;
        result.grid.sash.heightHole = 102;
        result.grid.fixed.widthQuantity = q * 2;
        result.grid.fixed.heightQuantity = q * 2;
        result.grid.fixed.widthHole = 102;
        result.grid.fixed.heightHole = 102;
        result.grid.fixed2.widthQuantity = q * 2;
        result.grid.fixed2.heightQuantity = q * 2;
        result.grid.fixed2.widthHole = 102;
        result.grid.fixed2.heightHole = 102;
      } else if (gridType === 'Perimeter') {
        result.grid.sash.widthQuantity = q;
        result.grid.sash.heightQuantity = q;
        result.grid.sash.widthHole = 69.5;
        result.grid.sash.heightHole = 102;
        result.grid.fixed.widthQuantity = q;
        result.grid.fixed.heightQuantity = q;
        result.grid.fixed.widthHole = 102;
        result.grid.fixed.heightHole = 102;
        result.grid.fixed2.widthQuantity = 1;
        result.grid.fixed2.heightQuantity = 2;
        result.grid.fixed2.widthHole = 102;
        result.grid.fixed2.heightHole = 102;
      }
    }

    // Process glass orders based on glass type
    switch (glassType) {
      case 'Clear/Clear':
        addGlassOrder(result.orders, {
          customer, style, width, height, fixedHeight,
          id: '--01',
          quantity: 2 * q,
          type: 'clear',
          tempered: '',
          glassW: sashglassw,
          glassH: sashglassh
        });
        addGlassOrder(result.orders, {
          id: '--02',
          quantity: 2 * q,
          type: 'clear',
          tempered: '',
          glassW: fixedglassw,
          glassH: fixedglassh
        });
        if (topBottom === 'tempered') {
          addGlassOrder(result.orders, {
            id: '--03',
            quantity: 2 * q,
            type: 'clear',
            tempered: 'T',
            glassW: fixedglass2w,
            glassH: fixedglass2h
          });
          addOrderWrite(result.orders, {
            customer, style, width, height, fixedHeight,
            id: '--03',
            quantity: 2 * q,
            type: 'Clear',
            tempered: true,
            glassW: fixedglass2w,
            glassH: fixedglass2h
          });
        } else {
          addGlassOrder(result.orders, {
            id: '--03',
            quantity: 2 * q,
            type: 'clear',
            tempered: '',
            glassW: fixedglass2w,
            glassH: fixedglass2h
          });
        }
        break;

      case 'Clear/Lowe2':
        // Sash and fixed glass
        addGlassOrder(result.orders, {
          customer, style, width, height, fixedHeight,
          id: '--01',
          quantity: q,
          type: 'clear',
          tempered: '',
          glassW: sashglassw,
          glassH: sashglassh
        });
        addGlassOrder(result.orders, {
          id: '--01',
          quantity: q,
          type: 'lowe2',
          tempered: '',
          glassW: sashglassw,
          glassH: sashglassh
        });
        addGlassOrder(result.orders, {
          id: '--02',
          quantity: q,
          type: 'clear',
          tempered: '',
          glassW: fixedglassw,
          glassH: fixedglassh
        });
        addGlassOrder(result.orders, {
          id: '--02',
          quantity: q,
          type: 'lowe2',
          tempered: '',
          glassW: fixedglassw,
          glassH: fixedglassh
        });

        // Top fixed glass
        if (topBottom === 'tempered') {
          addGlassOrder(result.orders, {
            id: '--03',
            quantity: q,
            type: 'clear',
            tempered: 'T',
            glassW: fixedglass2w,
            glassH: fixedglass2h
          });
          addGlassOrder(result.orders, {
            id: '--03',
            quantity: q,
            type: 'lowe2',
            tempered: 'T',
            glassW: fixedglass2w,
            glassH: fixedglass2h
          });
          addOrderWrite(result.orders, {
            customer, style, width, height, fixedHeight,
            id: '--03',
            quantity: q,
            type: 'Clear',
            tempered: true,
            glassW: fixedglass2w,
            glassH: fixedglass2h
          });
          addOrderWrite(result.orders, {
            id: '--03',
            quantity: q,
            type: 'Lowe270',
            tempered: true,
            glassW: fixedglass2w,
            glassH: fixedglass2h
          });
        } else {
          addGlassOrder(result.orders, {
            id: '--03',
            quantity: q,
            type: 'clear',
            tempered: '',
            glassW: fixedglass2w,
            glassH: fixedglass2h
          });
          addGlassOrder(result.orders, {
            id: '--03',
            quantity: q,
            type: 'lowe2',
            tempered: '',
            glassW: fixedglass2w,
            glassH: fixedglass2h
          });
        }
        break;

      // Add remaining glass type cases...
    }
  } else {
    // Handle other frame types (retrofit, block, block-slop)
    // Calculate frame dimensions for other frame types
    const framew = roundToThree((w + 3 * 2) / 25.4);
    const frameh = roundToThree((h + 3 * 2) / 25.4);
    
    result.frame = {
      width: framew,
      height: frameh
    };

    if (frameType === 'retrofit') {
      result.frame.quantity = {
        width: 2,
        height: 2
      };
    } else if (frameType === 'block' || frameType === 'block-slop') {
      result.frame.blockQuantity = {
        width: 2,
        height: 2
      };
    } else if (frameType === 'block-1-3-4') {
      result.frame.retrofitQuantity = {
        width: 1
      };
      result.frame.blockQuantity = {
        width: 1,
        height: 2
      };
    }

    // Add remaining calculations for other frame types...
  }

  return result;
}

// Helper function to round to three decimal places
function roundToThree(num) {
  return Math.round(num * 1000) / 1000;
}

// Helper function to round to one decimal place
function roundToOne(num) {
  return Math.round(num * 10) / 10;
}

// Helper function to add glass orders
function addGlassOrder(orders, {
  customer = '',
  style = '',
  width = '',
  height = '',
  fixedHeight = '',
  id = '',
  quantity = 1,
  type = '',
  tempered = '',
  glassW = 0,
  glassH = 0
}) {
  orders.push({
    customer,
    style,
    width: width.toString(),
    height: height.toString(),
    fixedHeight: fixedHeight.toString(),
    id,
    quantity,
    type,
    tempered,
    glassWidth: glassW,
    glassHeight: glassH
  });
}

// Helper function to add order writes
function addOrderWrite(orders, {
  customer = '',
  style = '',
  width = '',
  height = '',
  fixedHeight = '',
  id = '',
  quantity = 1,
  type = '',
  tempered = false,
  glassW = 0,
  glassH = 0
}) {
  orders.push({
    customer,
    style,
    width: width.toString(),
    height: height.toString(),
    fixedHeight: fixedHeight.toString(),
    id,
    quantity,
    type,
    tempered: tempered ? 'Tempered' : '',
    glassWidth: glassW,
    glassHeight: glassH,
    isOrder: true
  });
} 