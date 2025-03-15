// Door XO/OX style的计算
export function calculateDoorXO_OX(formData) {
    const width = parseFloat(formData.width || 0);
    const height = parseFloat(formData.height || 0);
    const w = width * 25.4;  // Convert to mm
    const h = height * 25.4;
    const q = parseInt(formData.quantity || 1);
    const frameType = formData.frame || 'nailon';
    
    let result = {
        frame: {},
        sash: {},
        screen: {},
        parts: {},
        glass: {},
        grid: {}
    };

    // Frame calculations based on frame type
    if (frameType.toLowerCase() === 'nailon') {
        result.frame = {
            width: Number(((w + 3 * 2) / 25.4).toFixed(3)),
            height: Number(((h + 3 * 2) / 25.4).toFixed(3))
        };

        result.sash = {
            width: Number(((w / 2 - 14.5 - 15 + 1) / 25.4).toFixed(3)),
            height: Number(((h - 46 - 15 * 2 - 2) / 25.4).toFixed(3))
        };

        result.glass = {
            width: Number((w / 2 - 14.5 - 15 * 2 - 3).toFixed(0)),
            height: Number((h - 46 - 15 * 2 - 3 * 2).toFixed(0))
        };

        result.parts = {
            "Frame Head": Number((w / 25.4).toFixed(3)) + " x " + q,
            "Frame Sill": Number((w / 25.4).toFixed(3)) + " x " + q,
            "Frame Jamb": Number((h / 25.4).toFixed(3)) + " x " + (2 * q),
            "Sash Stile": Number((result.sash.height).toFixed(3)) + " x " + (4 * q),
            "Sash Rail": Number((result.sash.width).toFixed(3)) + " x " + (4 * q),
            "Interlock": Number((result.sash.height).toFixed(3)) + " x " + (2 * q),
            "Glazing Bead": Number(((result.sash.width * 2 + result.sash.height * 2) * 2).toFixed(3)) + " x " + q,
            "Reinforcement": Number(((result.sash.width * 2 + result.sash.height * 2) * 2).toFixed(3)) + " x " + q
        };
    } else if (frameType.toLowerCase() === 'retrofit') {
        result.frame = {
            width: Number(((w + 3 * 2) / 25.4).toFixed(3)),
            height: Number(((h + 3 * 2) / 25.4).toFixed(3))
        };

        result.sash = {
            width: Number(((w / 2 - 14.5 - 15 + 1) / 25.4).toFixed(3)),
            height: Number(((h - 46 - 15 * 2 - 2) / 25.4).toFixed(3))
        };

        result.glass = {
            width: Number((w / 2 - 14.5 - 15 * 2 - 3).toFixed(0)),
            height: Number((h - 46 - 15 * 2 - 3 * 2).toFixed(0))
        };

        result.parts = {
            "Frame Head": Number((w / 25.4).toFixed(3)) + " x " + q,
            "Frame Sill": Number((w / 25.4).toFixed(3)) + " x " + q,
            "Frame Jamb": Number((h / 25.4).toFixed(3)) + " x " + (2 * q),
            "Sash Stile": Number((result.sash.height).toFixed(3)) + " x " + (4 * q),
            "Sash Rail": Number((result.sash.width).toFixed(3)) + " x " + (4 * q),
            "Interlock": Number((result.sash.height).toFixed(3)) + " x " + (2 * q),
            "Glazing Bead": Number(((result.sash.width * 2 + result.sash.height * 2) * 2).toFixed(3)) + " x " + q,
            "Reinforcement": Number(((result.sash.width * 2 + result.sash.height * 2) * 2).toFixed(3)) + " x " + q
        };
    } else if (frameType.toLowerCase() === 'block' || frameType.toLowerCase() === 'block-slop') {
        result.frame = {
            width: Number(((w) / 25.4).toFixed(3)),
            height: Number(((h) / 25.4).toFixed(3))
        };

        result.sash = {
            width: Number(((w / 2 - 14.5 - 15 + 1) / 25.4).toFixed(3)),
            height: Number(((h - 46 - 15 * 2 - 2) / 25.4).toFixed(3))
        };

        result.glass = {
            width: Number((w / 2 - 14.5 - 15 * 2 - 3).toFixed(0)),
            height: Number((h - 46 - 15 * 2 - 3 * 2).toFixed(0))
        };

        result.parts = {
            "Frame Head": Number((w / 25.4).toFixed(3)) + " x " + q,
            "Frame Sill": Number((w / 25.4).toFixed(3)) + " x " + q,
            "Frame Jamb": Number((h / 25.4).toFixed(3)) + " x " + (2 * q),
            "Sash Stile": Number((result.sash.height).toFixed(3)) + " x " + (4 * q),
            "Sash Rail": Number((result.sash.width).toFixed(3)) + " x " + (4 * q),
            "Interlock": Number((result.sash.height).toFixed(3)) + " x " + (2 * q),
            "Glazing Bead": Number(((result.sash.width * 2 + result.sash.height * 2) * 2).toFixed(3)) + " x " + q,
            "Reinforcement": Number(((result.sash.width * 2 + result.sash.height * 2) * 2).toFixed(3)) + " x " + q
        };
    }

    // Grid calculations if applicable
    if (formData.grid && formData.grid !== 'None') {
        result.grid = {
            width: Number((result.glass.width - 5 * 2).toFixed(0)),
            height: Number((result.glass.height - 5 * 2).toFixed(0))
        };
    }

    return result;
} 