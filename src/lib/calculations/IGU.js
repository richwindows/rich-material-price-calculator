// IGU (Insulated Glass Unit) calculations
export function calculateIGU(formData) {
  const { width, height, quantity, grid, glass, gridW, gridH } = formData;
  
  // Convert inches to mm
  const w = parseFloat(width) * 25.4;
  const h = parseFloat(height) * 25.4;
  const q = parseInt(quantity) || 1;

  // Glass calculations
  const glassCalc = {
    width: w,
    height: h
  };

  // Grid calculations
  const gridCalc = {
    width: (w - 18 - 2).toFixed(0),
    height: (h - 18 - 2).toFixed(0)
  };

  // Grid pattern calculations based on grid type
  let gridPattern = {};
  
  if (grid === 'Standard' && gridW && gridH) {
    const gridWidth = parseInt(gridW) || 0;
    const gridHeight = parseInt(gridH) || 0;
    
    gridPattern = {
      horizontal: gridHeight,
      vertical: gridWidth,
      total: (gridHeight + gridWidth) * q
    };
  } else if (grid === 'Marginal') {
    gridPattern = {
      type: 'Marginal',
      total: 4 * q
    };
  } else if (grid === 'Perimeter') {
    gridPattern = {
      type: 'Perimeter',
      total: 4 * q
    };
  }

  // Calculate glass orders based on glass type
  const glassOrders = {};
  
  if (glass) {
    const [outer, inner] = glass.split('/');
    glassOrders.outer = {
      type: outer,
      width: w,
      height: h,
      quantity: q
    };
    
    glassOrders.inner = {
      type: inner,
      width: w,
      height: h,
      quantity: q
    };
  }

  return {
    glass: glassCalc,
    grid: gridCalc,
    gridPattern: gridPattern,
    glassOrders: glassOrders,
    quantity: q
  };
} 