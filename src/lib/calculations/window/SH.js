// SH style window calculations
export function calculateSH(formData) {
  const { width, height, frame: frameType, grid: gridType, glass: glassType, gridW, gridH, quantity = 1, customer = '', style = '' } = formData;
  
  // Convert inches to mm
  const w = width * 25.4;
  const h = height * 25.4;
  const q = parseInt(quantity);

  let result = {
    frame: {},
    sash: {},
    screen: {},
    glass: {},
    grid: {},
    parts: {},
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

    // Sash calculations for nailon
    result.sash = {
      width: ((w - 47.4 - 15 * 2 - 2) / 25.4).toFixed(3),
      height: ((h / 2 - 17.1 - 15 + 1) / 25.4).toFixed(3),
      quantity: {
        width: 1,
        height: 2
      }
    };

    // Screen calculations for nailon
    result.screen = {
      width: Math.round(w - 87 - 15 * 2 - 4 + 2),
      height: Math.round(h / 2 - 75 - 15 - 4),
      quantity: {
        width: 2,
        height: 2
      }
    };

    // Parts calculations for nailon
    result.parts = {
      mullion: ((w - 36 - 15 * 2) / 25.4).toFixed(3),
      mullionA: ((w - 36 - 15 * 2) / 25.4 - 2).toFixed(1),
      handleA: Math.round((w - 47.4 - 15 * 2) / 25.4 / 2 + 4),
      quantity: 1
    };

    // Glass calculations for nailon
    const sashglassw = w - 110 - 15 * 2 - 2;
    const sashglassh = h / 2 - 79.7 - 15 - 1;
    const fixedglassw = w - 47 - 15 * 2;
    const fixedglassh = h / 2 - 44.2 - 15 - 1;

    result.glass = {
      sash: {
        width: sashglassw,
        height: sashglassh
      },
      fixed: {
        width: fixedglassw,
        height: fixedglassh
      }
    };

    // Grid calculations
    const sashgridw = Math.round(sashglassw - 18 - 2);
    const sashgridh = Math.round(sashglassh - 18 - 2);
    const fixedgridw = Math.round(fixedglassw - 18 - 2);
    const fixedgridh = Math.round(fixedglassh - 18 - 2);

    if (gridType === 'Standard' && gridW && gridH) {
      const gridsquareW = parseInt(gridW);
      const gridsquareH = parseInt(gridH);
      result.grid = {
        sash: {
          width: sashgridw,
          height: sashgridh,
          widthQuantity: gridsquareH / 2 - 1,
          heightQuantity: gridsquareW - 1,
          widthHole: sashgridw / gridsquareW,
          heightHole: sashgridh / (gridsquareH / 2)
        },
        fixed: {
          width: fixedgridw,
          height: fixedgridh,
          widthQuantity: gridsquareH / 2 - 1,
          heightQuantity: gridsquareW - 1,
          widthHole: 32.5,
          heightHole: fixedgridh / (gridsquareH / 2)
        }
      };
    } else if (gridType === 'Marginal') {
      result.grid = {
        sash: {
          width: sashgridw,
          height: sashgridh,
          widthQuantity: q * 2,
          heightQuantity: q * 2,
          widthHole: 69.5,
          heightHole: 102
        },
        fixed: {
          width: fixedgridw,
          height: fixedgridh,
          widthQuantity: q * 2,
          heightQuantity: q * 2,
          widthHole: 102,
          heightHole: 102
        }
      };
    } else if (gridType === 'Perimeter') {
      result.grid = {
        sash: {
          width: sashgridw,
          height: sashgridh,
          widthQuantity: q * 1,
          heightQuantity: q * 2,
          widthHole: 69.5,
          heightHole: 102
        },
        fixed: {
          width: fixedgridw,
          height: fixedgridh,
          widthQuantity: q * 1,
          heightQuantity: q * 2,
          widthHole: 102,
          heightHole: 102
        }
      };
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

    // Sash calculations for other frame types
    result.sash = {
      width: ((w - 47.4 - 2) / 25.4).toFixed(3),
      height: ((h / 2 - 17.1) / 25.4).toFixed(3),
      quantity: {
        width: 1,
        height: 2
      }
    };

    // Screen calculations for other frame types
    result.screen = {
      width: Math.round(w - 87 - 4 + 2),
      height: Math.round(h / 2 - 75 - 4),
      quantity: {
        width: 2,
        height: 2
      }
    };

    // Parts calculations for other frame types
    result.parts = {
      mullion: ((w - 36) / 25.4).toFixed(3),
      mullionA: ((w - 36) / 25.4 - 2).toFixed(1),
      handleA: Math.round((w - 46) / 25.4 / 2 + 4),
      quantity: 1
    };

    if (frameType === 'block-slop') {
      result.parts.slop = ((w - 10) / 25.4).toFixed(1);
    }

    // Glass calculations for other frame types
    const sashglassw = w - 110 - 2;
    const sashglassh = h / 2 - 79.7 - 1;
    const fixedglassw = w - 47;
    const fixedglassh = h / 2 - 44.2 - 1;

    result.glass = {
      sash: {
        width: sashglassw,
        height: sashglassh
      },
      fixed: {
        width: fixedglassw,
        height: fixedglassh
      }
    };

    // Grid calculations for other frame types
    const sashgridw = Math.round(sashglassw - 18 - 2);
    const sashgridh = Math.round(sashglassh - 18 - 2);
    const fixedgridw = Math.round(fixedglassw - 18 - 2);
    const fixedgridh = Math.round(fixedglassh - 18 - 2);

    if (gridType === 'Standard' && gridW && gridH) {
      const gridsquareW = parseInt(gridW);
      const gridsquareH = parseInt(gridH);
      result.grid = {
        sash: {
          width: sashgridw,
          height: sashgridh,
          widthQuantity: gridsquareH / 2 - 1,
          heightQuantity: gridsquareW - 1,
          widthHole: sashgridw / gridsquareW,
          heightHole: sashgridh / (gridsquareH / 2)
        },
        fixed: {
          width: fixedgridw,
          height: fixedgridh,
          widthQuantity: gridsquareH / 2 - 1,
          heightQuantity: gridsquareW - 1,
          widthHole: 32.5,
          heightHole: fixedgridh / (gridsquareH / 2)
        }
      };
    } else if (gridType === 'Marginal') {
      result.grid = {
        sash: {
          width: sashgridw,
          height: sashgridh,
          widthQuantity: q * 2,
          heightQuantity: q * 2,
          widthHole: 69.5,
          heightHole: 102
        },
        fixed: {
          width: fixedgridw,
          height: fixedgridh,
          widthQuantity: q * 2,
          heightQuantity: q * 2,
          widthHole: 102,
          heightHole: 102
        }
      };
    } else if (gridType === 'Perimeter') {
      result.grid = {
        sash: {
          width: sashgridw,
          height: sashgridh,
          widthQuantity: q * 1,
          heightQuantity: q * 2,
          widthHole: 69.5,
          heightHole: 102
        },
        fixed: {
          width: fixedgridw,
          height: fixedgridh,
          widthQuantity: q * 1,
          heightQuantity: q * 2,
          widthHole: 102,
          heightHole: 102
        }
      };
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
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: 2 * q,
        type: 'clear',
        tempered: '',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      break;

    case 'Clear/Lowe2':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'clear',
        tempered: '',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--01',
        quantity: q,
        type: 'lowe2',
        tempered: '',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: q,
        type: 'clear',
        tempered: '',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: q,
        type: 'lowe2',
        tempered: '',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      break;

    case 'Clear/Lowe3':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'clear',
        tempered: '',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--01',
        quantity: q,
        type: 'lowe3',
        tempered: '',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: q,
        type: 'clear',
        tempered: '',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: q,
        type: 'lowe3',
        tempered: '',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      break;

    case 'OBS/Clear':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'clear',
        tempered: '',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--01',
        quantity: q,
        type: 'OBS',
        tempered: '',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: q,
        type: 'clear',
        tempered: '',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: q,
        type: 'OBS',
        tempered: '',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      break;

    case 'OBS/Lowe2':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'lowe2',
        tempered: '',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--01',
        quantity: q,
        type: 'OBS',
        tempered: '',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: q,
        type: 'lowe2',
        tempered: '',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: q,
        type: 'OBS',
        tempered: '',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      break;

    case 'OBS/Lowe3':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'lowe3',
        tempered: '',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--01',
        quantity: q,
        type: 'OBS',
        tempered: '',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: q,
        type: 'lowe3',
        tempered: '',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: q,
        type: 'OBS',
        tempered: '',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      break;

    case 'Clear/Clear Tmp':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: 2 * q,
        type: 'clear',
        tempered: 'T',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: 2 * q,
        type: 'clear',
        tempered: 'T',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: 2 * q,
        type: 'Clear',
        tempered: true,
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--02',
        quantity: 2 * q,
        type: 'Clear',
        tempered: true,
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      break;

    case 'Clear/Lowe2 Tmp':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'clear',
        tempered: 'T',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--01',
        quantity: q,
        type: 'lowe2',
        tempered: 'T',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: q,
        type: 'clear',
        tempered: 'T',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: q,
        type: 'lowe2',
        tempered: 'T',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'Clear',
        tempered: true,
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'Lowe270',
        tempered: true,
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--02',
        quantity: q,
        type: 'Clear',
        tempered: true,
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--02',
        quantity: q,
        type: 'Lowe270',
        tempered: true,
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      break;

    case 'Clear/Lowe3 Tmp':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'clear',
        tempered: 'T',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--01',
        quantity: q,
        type: 'lowe3',
        tempered: 'T',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: q,
        type: 'clear',
        tempered: 'T',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: q,
        type: 'lowe3',
        tempered: 'T',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'Clear',
        tempered: true,
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'Lowe366',
        tempered: true,
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--02',
        quantity: q,
        type: 'Clear',
        tempered: true,
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--02',
        quantity: q,
        type: 'Lowe366',
        tempered: true,
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      break;

    case 'OBS/Clear Tmp':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'clear',
        tempered: 'T',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--01',
        quantity: q,
        type: 'OBS',
        tempered: 'T',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: q,
        type: 'clear',
        tempered: 'T',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: q,
        type: 'OBS',
        tempered: 'T',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'Clear',
        tempered: true,
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'P516',
        tempered: true,
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--02',
        quantity: q,
        type: 'Clear',
        tempered: true,
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--02',
        quantity: q,
        type: 'P516',
        tempered: true,
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      break;

    case 'OBS/Lowe2 Tmp':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'lowe2',
        tempered: 'T',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--01',
        quantity: q,
        type: 'OBS',
        tempered: 'T',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: q,
        type: 'lowe2',
        tempered: 'T',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: q,
        type: 'OBS',
        tempered: 'T',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'Lowe270',
        tempered: true,
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'P516',
        tempered: true,
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--02',
        quantity: q,
        type: 'Lowe270',
        tempered: true,
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--02',
        quantity: q,
        type: 'P516',
        tempered: true,
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      break;

    case 'OBS/Lowe3 Tmp':
      addGlassOrder(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'lowe3',
        tempered: 'T',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--01',
        quantity: q,
        type: 'OBS',
        tempered: 'T',
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: q,
        type: 'lowe3',
        tempered: 'T',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addGlassOrder(result.orders, {
        id: '--02',
        quantity: q,
        type: 'OBS',
        tempered: 'T',
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'Lowe366',
        tempered: true,
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--01',
        quantity: q,
        type: 'P516',
        tempered: true,
        glassW: result.glass.sash.width,
        glassH: result.glass.sash.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--02',
        quantity: q,
        type: 'Lowe366',
        tempered: true,
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
      });
      addOrderWrite(result.orders, {
        customer, style, width, height,
        id: '--02',
        quantity: q,
        type: 'P516',
        tempered: true,
        glassW: result.glass.fixed.width,
        glassH: result.glass.fixed.height
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