/**
 * Calculate measurements for XO/OX style windows
 * @param {Object} formData - The input form data
 * @returns {Object} Calculated measurements and orders
 */
export function calculateXO_OX(formData) {
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
        style = '',
        argon = ''
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
        orders: [] // Add orders array to store glass orders
    };

    // Frame calculations based on frame type
    if (frameType === 'nailon') {
        // Nailon frame
        result.frame = {
            '82-10-w': roundToThree((w + 3 * 2) / 25.4),
            '82-10-w2': roundToThree((w + 3 * 2) / 25.4),
            '82-10-h': roundToThree((h + 3 * 2) / 25.4),
            '82-10-h2': roundToThree((h + 3 * 2) / 25.4)
        };

        // Sash calculations
        result.sash = {
            '82-03-w': roundToThree((w / 2 - 14.5 - 15 + 1) / 25.4),
            '82-03-w2': roundToThree((h - 46 - 15 * 2 - 2 - 1) / 25.4),
            '82-03-h': roundToThree((w / 2 - 75 - 15 - 2) / 25.4),
            '82-05-h': roundToThree((h - 87 - 15 * 2 - 4) / 25.4)
        };

        // Screen calculations
        result.screen = {
            'screen-w': Math.round(w / 2 - 75 - 15 - 2),
            'screen-w2': Math.round(w / 2 - 75 - 15 - 2),
            'screen-h': Math.round(h - 87 - 15 * 2 - 4),
            'screen-h2': Math.round(h - 87 - 15 * 2 - 4)
        };

        // Parts calculations
        result.parts = {
            mullion: roundToThree((h - 36 - 15 * 2) / 25.4),
            mullionA: roundToOne((h - 36 - 15 * 2) / 25.4 - 2),
            handleA: Math.round((h - 46 - 15 * 2) / 25.4 / 2 + 4),
            track: roundToOne((w - 14 * 2 - 15 * 2 - 3 - 20) / 25.4)
        };

        // Glass calculations
        const sashGlassW = w / 2 - 77 - 15 + 3;
        const sashGlassH = h - 109 - 15 * 2 - 3 - 2;
        const fixedGlassW = w / 2 - 44 - 15;
        const fixedGlassH = h - 47 - 15 * 2 - 2;

        result.glass = {
            sashWidth: sashGlassW,
            sashHeight: sashGlassH,
            fixedWidth: fixedGlassW,
            fixedHeight: fixedGlassH
        };

        // Grid calculations if needed
        if (gridType) {
            const sashGridW = Math.round(sashGlassW - 18 - 2);
            const sashGridH = Math.round(sashGlassH - 18 - 2);
            const fixedGridW = Math.round(fixedGlassW - 18 - 2);
            const fixedGridH = Math.round(fixedGlassH - 18 - 2);

            if (gridType === 'Standard' && gridW && gridH) {
                const gridsquareW = parseInt(gridW);
                const gridsquareH = parseInt(gridH);
                
                result.grid = {
                    sashWidth: sashGridW,
                    sashHeight: sashGridH,
                    fixedWidth: fixedGridW,
                    fixedHeight: fixedGridH,
                    sashWidthQuantity: gridsquareH - 1,
                    sashHeightQuantity: gridsquareW / 2 - 1,
                    fixedWidthQuantity: gridsquareH - 1,
                    fixedHeightQuantity: gridsquareW / 2 - 1,
                    sashWidthHole: sashGridW / (gridsquareW / 2),
                    sashHeightHole: sashGridH / gridsquareH,
                    fixedWidthHole: fixedGridW / (gridsquareW / 2),
                    fixedHeightHole: 32
                };
            } else if (gridType === 'Marginal') {
                result.grid = {
                    sashWidth: sashGridW,
                    sashHeight: sashGridH,
                    fixedWidth: fixedGridW,
                    fixedHeight: fixedGridH,
                    sashWidthQuantity: q * 2,
                    sashHeightQuantity: q * 2,
                    fixedWidthQuantity: q * 2,
                    fixedHeightQuantity: q * 2,
                    sashWidthHole: 102,
                    sashHeightHole: 70,
                    fixedWidthHole: 102,
                    fixedHeightHole: 102
                };
            } else if (gridType === 'Perimeter') {
                result.grid = {
                    sashWidth: sashGridW,
                    sashHeight: sashGridH,
                    fixedWidth: fixedGridW,
                    fixedHeight: fixedGridH,
                    sashWidthQuantity: q * 2,
                    sashHeightQuantity: q * 1,
                    fixedWidthQuantity: q * 2,
                    fixedHeightQuantity: q * 1,
                    sashWidthHole: 102,
                    sashHeightHole: 70,
                    fixedWidthHole: 102,
                    fixedHeightHole: 102
                };
            }
        }
    } else {
        // Retrofit, Block, Block-slop frames
        result.frame = {
            width: roundToThree((w + 3 * 2) / 25.4),
            height: roundToThree((h + 3 * 2) / 25.4)
        };

        // Sash calculations
        result.sash = {
            width: roundToThree((w / 2 - 14.5 + 1) / 25.4),
            height: roundToThree((h - 46 - 2 - 1) / 25.4)
        };

        // Screen calculations
        result.screen = {
            width: Math.round(w / 2 - 75 - 2),
            height: Math.round(h - 87 - 4)
        };

        // Parts calculations
        const partsCalc = {
            mullion: roundToThree((h - 36) / 25.4),
            mullionA: roundToOne((h - 36) / 25.4 - 2),
            handleA: Math.round((h - 46) / 25.4 / 2 + 4),
            track: roundToOne((w - 14 * 2 - 3 - 20) / 25.4)
        };

        if (frameType === 'block-slop') {
            partsCalc.slop = roundToOne((w - 10) / 25.4);
        }

        result.parts = partsCalc;

        // Glass calculations
        const sashGlassW = w / 2 - 77 + 3;
        const sashGlassH = h - 109 - 3 - 2;
        const fixedGlassW = w / 2 - 44;
        const fixedGlassH = h - 47 - 2;

        result.glass = {
            sashWidth: sashGlassW,
            sashHeight: sashGlassH,
            fixedWidth: fixedGlassW,
            fixedHeight: fixedGlassH
        };

        // Process glass orders based on glass type (same as above)
        // ... (implement the same glass type switch case as above)

        // Grid calculations if needed (same as above)
        // ... (implement the same grid calculations as above)
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
