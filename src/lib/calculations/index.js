import { calculateXO_OX } from './window/XO';
import { calculateDoorXO_OX } from './door/Door_XO_OX';       
import { calculateScreen as calculateScreenDoor } from './door/ScreenDoor';
import { calculateOXXO as calculateDoorOXXO } from './door/Door_OXXO';
import { calculateFXO_FOX_XOF_OXF } from './door/FXO_FOX_XOF_OXF';

import { calculateXOX } from './window/XOX';
import { calculateXOX_1_3 } from './window/XOX_1_3';
import { calculateSH } from './window/SH';
import { calculatePW } from './window/PW';
import { calculateXO_P } from './window/XO_P';
import { calculateSH_P } from './window/SH_P';
import { calculatePSH } from './window/PSH';
import { calculateHPP } from './window/HPP';
import { calculateVPP } from './window/VPP';
import { calculateXO_PP_OX_PP } from './window/XO_PP_OX_PP';
import { calculateXOX_PPP } from './window/XOX_PPP';
import { calculatePPP_XOX } from './window/PPP_XOX';
import { calculateXOX_PP } from './window/XOX_PP';
import { calculatePP_XOX } from './window/PP_XOX';
import { calculateIGU } from './IGU';

/**
 * Main calculation function that handles all window styles
 * @param {Object} formData - The form data containing all input values
 * @returns {Object} Calculated measurements for the window
 */
export function calculate(formData) {
    try {
        // Validate required input data
        if (!formData) {
            console.error('Calculation error: No form data provided');
            return null;
        }

        const style = formData.style || '';
        
        // Validate numeric inputs
        const width = parseFloat(formData.width);
        const height = parseFloat(formData.height);
        const quantity = parseInt(formData.quantity) || 1;
        
        if (isNaN(width) || width <= 0) {
            console.error('Calculation error: Width must be a positive number');
            return null;
        }
        
        if (isNaN(height) || height <= 0) {
            console.error('Calculation error: Height must be a positive number');
            return null;
        }

        // Log input parameters
        console.log('\nCalculation Input:');
        console.log('=================');
        console.log('Style:', style);
        console.log('Width:', width, 'inches');
        console.log('Height:', height, 'inches');
        console.log('Frame:', formData.frame);
        console.log('Glass:', formData.glass);
        console.log('Grid:', formData.grid);
        console.log('Quantity:', quantity);
        console.log('=================\n');

        let result = null;

        // Choose calculation function based on style
        switch (style) {
            case 'XO':
            case 'OX':
                result = calculateXO_OX(formData);
                break;
            case 'XOX':
                result = calculateXOX(formData);
                break;
            case 'XOX-1/3':
                result = calculateXOX_1_3(formData);
                break;
            case 'SH':
                result = calculateSH(formData);
                break;
            case 'PW':
                result = calculatePW(formData);
                break;
            case 'XO-P':
                result = calculateXO_P(formData);
                break;
            case 'SH-P':
                result = calculateSH_P(formData);
                break;
            case 'PSH':
                result = calculatePSH(formData);
                break;
            case 'HPP':
                result = calculateHPP(formData);
                break;
            case 'VPP':
                result = calculateVPP(formData);
                break;
            case 'XO-PP-OX-PP':
                result = calculateXO_PP_OX_PP(formData);
                break;
            case 'XOX-PPP':
                result = calculateXOX_PPP(formData);
                break;
            case 'PPP-XOX':
                result = calculatePPP_XOX(formData);
                break;
            case 'XOX-PP':
                result = calculateXOX_PP(formData);
                break;
            case 'PP-XOX':
                result = calculatePP_XOX(formData);
                break;
            case 'IGU':
                result = calculateIGU(formData);
                break;
            case 'Screen':
                result = calculateScreenDoor(formData);
                break;
            case 'Door-XO-OX':
                result = calculateDoorXO_OX(formData);
                break;
            default:
                console.error(`Calculation error: Unknown style type "${style}"`);
                return null;
        }

        // Log calculation results
        if (result) {
            console.log('\nCalculation Result:');
            console.log('==================');
            
            // Frame measurements
            if (result.frame && Object.keys(result.frame).length > 0) {
                console.log('\nFrame:');
                console.log('------');
                Object.entries(result.frame).forEach(([key, value]) => {
                    console.log(`${key}: ${value} inches`);
                });
            }

            // Sash measurements
            if (result.sash && Object.keys(result.sash).length > 0) {
                console.log('\nSash:');
                console.log('-----');
                Object.entries(result.sash).forEach(([key, value]) => {
                    console.log(`${key}: ${value} inches`);
                });
            }

            // Screen measurements
            if (result.screen && Object.keys(result.screen).length > 0) {
                console.log('\nScreen:');
                console.log('-------');
                Object.entries(result.screen).forEach(([key, value]) => {
                    console.log(`${key}: ${value} mm`);
                });
            }

            // Glass measurements
            if (result.glass && Object.keys(result.glass).length > 0) {
                console.log('\nGlass:');
                console.log('------');
                Object.entries(result.glass).forEach(([key, value]) => {
                    console.log(`${key}: ${value} mm`);
                });
            }

            // Parts measurements
            if (result.parts && Object.keys(result.parts).length > 0) {
                console.log('\nParts:');
                console.log('------');
                Object.entries(result.parts).forEach(([key, value]) => {
                    console.log(`${key}: ${value} inches`);
                });
            }

            // Grid measurements
            if (result.grid && Object.keys(result.grid).length > 0) {
                console.log('\nGrid:');
                console.log('-----');
                Object.entries(result.grid).forEach(([key, value]) => {
                    if (key.toLowerCase().includes('hole')) {
                        console.log(`${key}: ${value} mm`);
                    } else if (key.toLowerCase().includes('quantity')) {
                        console.log(`${key}: ${value} pcs`);
                    } else {
                        console.log(`${key}: ${value} mm`);
                    }
                });
            }

            // Glass orders
            if (result.orders && result.orders.length > 0) {
                console.log('\nGlass Orders:');
                console.log('------------');
                result.orders.forEach((order, index) => {
                    console.log(`\nOrder ${index + 1}:`);
                    Object.entries(order).forEach(([key, value]) => {
                        if (key.toLowerCase().includes('width') || key.toLowerCase().includes('height')) {
                            console.log(`${key}: ${value} ${key.toLowerCase().includes('glass') ? 'mm' : 'inches'}`);
                        } else {
                            console.log(`${key}: ${value}`);
                        }
                    });
                });
            }

            console.log('\n==================');
        }

        // Add metadata to the result
        if (result) {
            result.metadata = {
                style: style,
                width: width,
                height: height,
                frame: formData.frame,
                glass: formData.glass,
                grid: formData.grid,
                quantity: quantity
            };
        }

        return result;
    } catch (error) {
        console.error('Error during calculation:', error);
        return null;
    }
}

// Export all calculation functions
export {
    // Door types
    calculateDoorOXXO,
    calculateFXO_FOX_XOF_OXF,
    calculateScreenDoor,
    
    // Window types
    calculateXOX,
    calculateXOX_1_3,
    calculateSH,
    calculatePW,
    calculateXO_P,
    calculateSH_P,
    calculatePSH,
    calculateHPP,
    calculateVPP,
    calculateXO_PP_OX_PP,
    calculateXOX_PPP,
    calculatePPP_XOX,
    calculateXOX_PP,
    calculatePP_XOX,
    
    // Others
    calculateIGU
};