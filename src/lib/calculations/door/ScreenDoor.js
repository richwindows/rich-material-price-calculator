// Screen Door calculations
export function calculateScreen(formData) {
    const width = parseFloat(formData.width || 0);
    const height = parseFloat(formData.height || 0);
    const w = width * 25.4;  // Convert to mm
    const h = height * 25.4;
    const q = parseInt(formData.quantity || 1);
    
    let result = {
        frame: {},
        screen: {},
        parts: {}
    };

    // Screen door frame calculations
    result.frame = {
        width: Number(((w) / 25.4).toFixed(3)),
        height: Number(((h) / 25.4).toFixed(3))
    };

    // Screen mesh calculations
    result.screen = {
        width: Number(((w - 20) / 25.4).toFixed(3)),
        height: Number(((h - 20) / 25.4).toFixed(3))
    };

    // Parts calculations
    result.parts = {
        "Screen Frame Vertical": Number((result.frame.height).toFixed(3)) + " x " + (2 * q),
        "Screen Frame Horizontal": Number((result.frame.width).toFixed(3)) + " x " + (2 * q),
        "Screen Mesh": Number((result.screen.width).toFixed(3)) + " x " + Number((result.screen.height).toFixed(3)) + " x " + q,
        "Corner Keys": "4 x " + q,
        "Wheels": "2 x " + q,
        "Handle": "1 x " + q
    };

    return result;
} 