// XOX style的计算
export function calculateXOX(formData) {
    const {
        width,
        height,
        frame: frameType,
        grid: gridType,
        glass: glassType,
        gridW,
        gridH,
        quantity = 1,
        customer = '',
        style = ''
    } = formData;

    // Convert inches to millimeters
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

    // Frame calculations based on frame type
    if (frameType === 'nailon') {
        // Nailon frame
        result.frame = {
            width: roundToThree((w + 3 * 2) / 25.4),
            height: roundToThree((h + 3 * 2) / 25.4)
        };

        // Sash calculations
        result.sash = {
            width: roundToThree((w / 4 - 14.5 - 15 + 1) / 25.4),
            height: roundToThree((h - 46 - 15 * 2 - 2 - 1) / 25.4),
            quantity: {
                width: 4,
                height: 2
            }
        };

        // Screen calculations
        result.screen = {
            width: Math.round(w / 4 - 75 - 15 - 2),
            height: Math.round(h - 87 - 15 * 2 - 4),
            quantity: {
                width: 4,
                height: 4
            }
        };

        // Parts calculations
        result.parts = {
            mullion: roundToThree((h - 36 - 15 * 2) / 25.4),
            mullionA: roundToOne((h - 36 - 15 * 2) / 25.4 - 2),
            handleA: Math.round((h - 46 - 15 * 2) / 25.4 / 2 + 4),
            track: roundToOne((w - 14 * 2 - 15 * 2 - 3 - 20) / 25.4),
            handleQuantity: 2
        };

        // Glass calculations
        const sashGlassW = w / 4 - 77 - 15;
        const sashGlassH = h - 109 - 15 * 2 - 3 - 2;
        const fixedGlassW = w / 2 - 41.4;
        const fixedGlassH = h - 47 - 15 * 2 - 2;

        result.glass = {
            sash: {
                width: sashGlassW,
                height: sashGlassH
            },
            fixed: {
                width: fixedGlassW,
                height: fixedGlassH
            }
        };

        // Grid calculations
        if (gridType) {
            const sashGridW = Math.round(sashGlassW - 18 - 2);
            const sashGridH = Math.round(sashGlassH - 18 - 2);
            const fixedGridW = Math.round(fixedGlassW - 18 - 2);
            const fixedGridH = Math.round(fixedGlassH - 18 - 2);

            if (gridType === 'Standard' && gridW && gridH) {
                const gridsquareW = parseInt(gridW);
                const gridsquareH = parseInt(gridH);
                
                result.grid = {
                    sash: {
                        width: sashGridW,
                        height: sashGridH,
                        widthQuantity: (gridsquareH - 1) * 2,
                        heightQuantity: (gridsquareW / 4 - 1) * 2,
                        widthHole: sashGridW / (gridsquareW / 4),
                        heightHole: sashGridH / gridsquareH
                    },
                    fixed: {
                        width: fixedGridW,
                        height: fixedGridH,
                        widthQuantity: gridsquareH - 1,
                        heightQuantity: gridsquareW / 2 - 1,
                        widthHole: fixedGridW / (gridsquareW / 2),
                        heightHole: 32
                    }
                };
            } else if (gridType === 'Marginal') {
                result.grid = {
                    sash: {
                        width: sashGridW,
                        height: sashGridH,
                        widthQuantity: q * 4,
                        heightQuantity: q * 4,
                        widthHole: 102,
                        heightHole: 70
                    },
                    fixed: {
                        width: fixedGridW,
                        height: fixedGridH,
                        widthQuantity: q * 2,
                        heightQuantity: q * 2,
                        widthHole: 102,
                        heightHole: 102
                    }
                };
            } else if (gridType === 'Perimeter') {
                result.grid = {
                    sash: {
                        width: sashGridW,
                        height: sashGridH,
                        widthQuantity: q * 4,
                        heightQuantity: q * 2,
                        widthHole: 102,
                        heightHole: 70
                    },
                    fixed: {
                        width: fixedGridW,
                        height: fixedGridH,
                        widthQuantity: q * 2,
                        heightQuantity: 0,
                        widthHole: 0,
                        heightHole: 0
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
                    quantity: 4 * q,
                    type: 'clear',
                    tempered: '',
                    glassW: sashGlassW,
                    glassH: sashGlassH
                });
                addGlassOrder(result.orders, {
                    id: '--02',
                    quantity: 2 * q,
                    type: 'clear',
                    tempered: '',
                    glassW: fixedGlassW,
                    glassH: fixedGlassH
                });
                break;

            case 'Clear/Lowe2':
                addGlassOrder(result.orders, {
                    customer, style, width, height,
                    id: '--01',
                    quantity: 2 * q,
                    type: 'clear',
                    tempered: '',
                    glassW: sashGlassW,
                    glassH: sashGlassH
                });
                addGlassOrder(result.orders, {
                    id: '--01',
                    quantity: 2 * q,
                    type: 'lowe2',
                    tempered: '',
                    glassW: sashGlassW,
                    glassH: sashGlassH
                });
                addGlassOrder(result.orders, {
                    id: '--02',
                    quantity: q,
                    type: 'clear',
                    tempered: '',
                    glassW: fixedGlassW,
                    glassH: fixedGlassH
                });
                addGlassOrder(result.orders, {
                    id: '--02',
                    quantity: q,
                    type: 'lowe2',
                    tempered: '',
                    glassW: fixedGlassW,
                    glassH: fixedGlassH
                });
                break;

            case 'Clear/Clear TP':
                addGlassOrder(result.orders, {
                    customer, style, width, height,
                    id: '--01',
                    quantity: 4 * q,
                    type: 'clear',
                    tempered: 'T',
                    glassW: sashGlassW,
                    glassH: sashGlassH
                });
                addGlassOrder(result.orders, {
                    id: '--02',
                    quantity: 2 * q,
                    type: 'clear',
                    tempered: 'T',
                    glassW: fixedGlassW,
                    glassH: fixedGlassH
                });
                addOrderWrite(result.orders, {
                    customer, style, width, height,
                    id: '--01',
                    quantity: 4 * q,
                    type: 'Clear',
                    tempered: 'Tempered',
                    glassW: sashGlassW,
                    glassH: sashGlassH
                });
                addOrderWrite(result.orders, {
                    id: '--02',
                    quantity: 2 * q,
                    type: 'Clear',
                    tempered: 'Tempered',
                    glassW: fixedGlassW,
                    glassH: fixedGlassH
                });
                break;

            // Add other glass type cases similarly...
        }

    } else {
        // Retrofit, Block, Block-slop frames
        result.frame = {
            width: roundToThree((w + 3 * 2) / 25.4),
            height: roundToThree((h + 3 * 2) / 25.4)
        };

        // Frame type specific writes
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

        // Rest of calculations similar to nailon but with different measurements...
        // ... (implement the rest of the retrofit/block frame logic)
    }

    return result;
}

// Helper functions for rounding
function roundToThree(num) {
    return Math.round(num * 1000) / 1000;
}

function roundToOne(num) {
    return Math.round(num * 10) / 10;
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
        width: width ? width.toString() : '',
        height: height ? height.toString() : '',
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
        width: width ? width.toString() : '',
        height: height ? height.toString() : '',
        id,
        quantity,
        type,
        tempered,
        glassWidth: glassW,
        glassHeight: glassH,
        isOrder: true
    });
} 