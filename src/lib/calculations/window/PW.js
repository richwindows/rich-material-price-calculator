// Picture Window style calculations
export function calculatePW(formData) {
  const { width, height, frame: frameType, grid: gridType, glass: glassType, gridW, gridH, quantity = 1, customer = '', style = '' } = formData;
  
  // Convert inches to mm
  const w = width * 25.4;
  const h = height * 25.4;
  const q = parseInt(quantity);

  let result = {
    frame: {},
    parts: {},
    glass: {},
    grid: {},
    orders: []
  };

  // Frame calculations
  const framew = ((w + 3 * 2) / 25.4).toFixed(3);
  const frameh = ((h + 3 * 2) / 25.4).toFixed(3);

  if (frameType === 'nailon') {
    // Nailon frame calculations
    result.frame = {
      width: framew,
      height: frameh,
      quantity: {
        width: 2,
        height: 2
      }
    };

    // Parts calculations for nailon
    result.parts = {
      coverWidth: ((w - 14 * 2 - 15 * 2 - 3 - 13) / 25.4).toFixed(3),
      coverHeight: ((h - 14 * 2 - 15 * 2 - 22 * 2 - 3.175) / 25.4).toFixed(3)
    };

    // Glass calculations for nailon
    const fixedglassw = w - 47 - 15 * 2 - 2;
    const fixedglassh = h - 47 - 15 * 2 - 2;

    result.glass = {
      width: fixedglassw,
      height: fixedglassh
    };

    // Grid calculations for nailon
    if (gridType) {
      const fixedgridw = Math.round(fixedglassw - 18 - 2);
      const fixedgridh = Math.round(fixedglassh - 18 - 2);

      if (gridType === 'Standard' && gridW && gridH) {
        const gridsquareW = parseInt(gridW);
        const gridsquareH = parseInt(gridH);
        result.grid = {
          width: fixedgridw,
          height: fixedgridh,
          widthQuantity: gridsquareH - 1,
          heightQuantity: gridsquareW - 1,
          widthHole: fixedgridw / gridsquareW,
          heightHole: fixedgridh / gridsquareH
        };
      } else if (gridType === 'Marginal' || gridType === 'Perimeter') {
        result.grid = {
          width: fixedgridw,
          height: fixedgridh,
          widthQuantity: q * 2,
          heightQuantity: q * 2,
          widthHole: 102,
          heightHole: 102
        };
      }
    }

  } else {
    // Retrofit, Block, Block-slop frames
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

    // Parts calculations for other frames
    result.parts = {
      coverWidth: ((w - 14 * 2 - 3 - 13) / 25.4).toFixed(3),
      coverHeight: ((h - 14 * 2 - 22 * 2 - 3.175) / 25.4).toFixed(3)
    };

    if (frameType === 'block-slop') {
      result.parts.slop = ((w - 10) / 25.4).toFixed(1);
    }

    // Glass calculations for other frames
    const fixedglassw = w - 47 - 2;
    const fixedglassh = h - 47 - 2;

    result.glass = {
      width: fixedglassw,
      height: fixedglassh
    };

    // Grid calculations for other frames
    if (gridType) {
      const fixedgridw = Math.round(fixedglassw - 18 - 2);
      const fixedgridh = Math.round(fixedglassh - 18 - 2);

      if (gridType === 'Standard' && gridW && gridH) {
        const gridsquareW = parseInt(gridW);
        const gridsquareH = parseInt(gridH);
        result.grid = {
          width: fixedgridw,
          height: fixedgridh,
          widthQuantity: gridsquareH - 1,
          heightQuantity: gridsquareW - 1,
          widthHole: fixedgridw / gridsquareW,
          heightHole: fixedgridh / gridsquareH
        };
      } else if (gridType === 'Marginal' || gridType === 'Perimeter') {
        result.grid = {
          width: fixedgridw,
          height: fixedgridh,
          widthQuantity: q * 2,
          heightQuantity: q * 2,
          widthHole: 102,
          heightHole: 102
        };
      }
    }
  }

  // Process glass orders based on glass type
  switch (glassType) {
    case 'Clear/Clear':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: 2 * q,
        type: 'clear',
        tempered: '',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      break;

    case 'Clear/Lowe2':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'clear',
        tempered: '',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addGlassOrder(result.orders, {
        id: '--01',
        quantity: q,
        type: 'lowe2',
        tempered: '',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      break;

    case 'Clear/Lowe3':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'clear',
        tempered: '',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addGlassOrder(result.orders, {
        id: '--01',
        quantity: q,
        type: 'lowe3',
        tempered: '',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      break;

    case 'OBS/Clear':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'clear',
        tempered: '',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addGlassOrder(result.orders, {
        id: '--01',
        quantity: q,
        type: 'OBS',
        tempered: '',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      break;

    case 'OBS/Lowe2':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'lowe2',
        tempered: '',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addGlassOrder(result.orders, {
        id: '--01',
        quantity: q,
        type: 'OBS',
        tempered: '',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      break;

    case 'OBS/Lowe3':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'lowe3',
        tempered: '',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addGlassOrder(result.orders, {
        id: '--01',
        quantity: q,
        type: 'OBS',
        tempered: '',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      break;

    case 'Clear/Clear Tmp':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: 2 * q,
        type: 'clear',
        tempered: 'T',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: 2 * q,
        type: 'Clear',
        tempered: true,
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      break;

    case 'Clear/Lowe2 Tmp':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'clear',
        tempered: 'T',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addGlassOrder(result.orders, {
        id: '--01',
        quantity: q,
        type: 'lowe2',
        tempered: 'T',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'Clear',
        tempered: true,
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'Lowe270',
        tempered: true,
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      break;

    case 'Clear/Lowe3 Tmp':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'clear',
        tempered: 'T',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addGlassOrder(result.orders, {
        id: '--01',
        quantity: q,
        type: 'lowe3',
        tempered: 'T',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'Clear',
        tempered: true,
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'Lowe366',
        tempered: true,
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      break;

    case 'OBS/Clear Tmp':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'clear',
        tempered: 'T',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addGlassOrder(result.orders, {
        id: '--01',
        quantity: q,
        type: 'OBS',
        tempered: 'T',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'Clear',
        tempered: true,
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'P516',
        tempered: true,
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      break;

    case 'OBS/Lowe2 Tmp':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'lowe2',
        tempered: 'T',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addGlassOrder(result.orders, {
        id: '--01',
        quantity: q,
        type: 'OBS',
        tempered: 'T',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'Lowe270',
        tempered: true,
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'P516',
        tempered: true,
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      break;

    case 'OBS/Lowe3 Tmp':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'lowe3',
        tempered: 'T',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addGlassOrder(result.orders, {
        id: '--01',
        quantity: q,
        type: 'OBS',
        tempered: 'T',
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'Lowe366',
        tempered: true,
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'P516',
        tempered: true,
        glassW: result.glass.width,
        glassH: result.glass.height
      });
      break;
  }

  return result;
}

// Helper function to add glass orders
function addGlassOrder(orders, {
  customer = '',
  style = '',
  width = '',
  height = '',
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
    id,
    quantity,
    type,
    tempered: tempered ? 'Tempered' : '',
    glassWidth: glassW,
    glassHeight: glassH,
    isOrder: true
  });
} 