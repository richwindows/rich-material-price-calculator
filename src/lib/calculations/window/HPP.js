function H_PP() {
    // Get the last cell from Info sheet
    const idend = getLastCell("Info", 2);
    
    let width, height, w, h, q, framew, frameh, slop, fixedgridw, fixedgridh, coverw, coverh, bigmullion;
    let fixedglassw, fixedglassh;
    
    width = parseFloat(document.getElementById("txtWidth").value);
    height = parseFloat(document.getElementById("txtHeight").value);
    w = width * 25.4;
    h = height * 25.4;
    q = parseInt(document.getElementById("txtQty").value);
    
    const frameIndex = document.getElementById("cmbFrame").selectedIndex;
    
    if (frameIndex === 0) { // Nailon
        framew = round((w + 3 * 2) / 25.4, 3);
        frameh = round((h + 3 * 2) / 25.4, 3);
        framewrite("", "", "", "", framew.toString(), "2", frameh.toString(), "2", "", "", "", "");
        
        coverw = round((w / 2 - 6 - 14 * 2 - 15 - 3 - 13) / 25.4, 3);
        coverh = round((h - 14 * 2 - 15 * 2 - 22 * 2) / 25.4, 3);
        bigmullion = round((h - 14 * 2 - 15 * 2 - 2 + (1.5)) / 25.4, 3);
        partswrite("", "", "", "", "", coverw.toString(), coverh.toString(), bigmullion.toString(), "1", "", "", "");
        
        fixedglassw = w / 2 - 6 - 20.5 * 2 - 3 * 2 - 15 - (3);
        fixedglassh = h - 20.5 * 2 - 3 * 2 - 15 * 2 - (2);
        
        fixedgridw = round(fixedglassw - 18 - (2), 0);
        fixedgridh = round(fixedglassh - 18 - (2), 0);
        
        const gridIndex = document.getElementById("cmbGrid").selectedIndex;
        
        switch (gridIndex) {
            case 1: // Standard
                gridwrite("", "", "", "", "", "", fixedgridw.toString(), "", "", fixedgridh.toString(), "", "");
                break;
            case 2: // Marginal
                gridwrite("", "", "", "", "", "", fixedgridw.toString(), (q * 4).toString(), "102", fixedgridh.toString(), (q * 4).toString(), "102");
                break;
            case 3: // Perimeter
                gridwrite("", "", "", "", "", "", fixedgridw.toString(), (q * 4).toString(), "102", fixedgridh.toString(), (q * 4).toString(), "102");
                break;
        }
        
        const glassIndex = document.getElementById("cmbGlass").selectedIndex;
        const customer = document.getElementById("txtCustomer").value;
        const style = document.getElementById("cmbStyle").value;
        
        switch (glassIndex) {
            case 0: // Clear/Clear
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 4 * q, "clear", "", fixedglassw, fixedglassh);
                break;
            case 1: // Clear/Lowe2
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "clear", "", fixedglassw, fixedglassh);
                glasswrite("", "", "", "", "", idend, idend + "--01", 2 * q, "lowe2", "", fixedglassw, fixedglassh);
                break;
            case 2: // Clear/Lowe3
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "clear", "", fixedglassw, fixedglassh);
                glasswrite("", "", "", "", "", idend, idend + "--01", 2 * q, "lowe3", "", fixedglassw, fixedglassh);
                break;
            case 3: // OBS/Clear
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "clear", "", fixedglassw, fixedglassh);
                glasswrite("", "", "", "", "", idend, idend + "--01", 2 * q, "OBS", "", fixedglassw, fixedglassh);
                break;
            case 4: // OBS/Lowe2
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "lowe2", "", fixedglassw, fixedglassh);
                glasswrite("", "", "", "", "", idend, idend + "--01", 2 * q, "OBS", "", fixedglassw, fixedglassh);
                break;
            case 5: // OBS/Lowe3
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "lowe3", "", fixedglassw, fixedglassh);
                glasswrite("", "", "", "", "", idend, idend + "--01", 2 * q, "OBS", "", fixedglassw, fixedglassh);
                break;
            case 6: // Clear/Clear Tmp
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 4 * q, "clear", "T", fixedglassw, fixedglassh);
                orderwrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 4 * q, "Clear", "Tempered", fixedglassw, fixedglassh);
                break;
            case 7: // Clear/Lowe2 Tmp
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "clear", "T", fixedglassw, fixedglassh);
                glasswrite("", "", "", "", "", idend, idend + "--01", 2 * q, "lowe2", "T", fixedglassw, fixedglassh);
                orderwrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "Clear", "Tempered", fixedglassw, fixedglassh);
                orderwrite("", "", "", "", "", idend, idend + "--01", 2 * q, "Lowe270", "Tempered", fixedglassw, fixedglassh);
                break;
            case 8: // Clear/Lowe3 Tmp
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "clear", "T", fixedglassw, fixedglassh);
                glasswrite("", "", "", "", "", idend, idend + "--01", 2 * q, "lowe3", "T", fixedglassw, fixedglassh);
                orderwrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "Clear", "Tempered", fixedglassw, fixedglassh);
                orderwrite("", "", "", "", "", idend, idend + "--01", 2 * q, "Lowe366", "Tempered", fixedglassw, fixedglassh);
                break;
            case 9: // OBS/Clear Tmp
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "clear", "T", fixedglassw, fixedglassh);
                glasswrite("", "", "", "", "", idend, idend + "--01", 2 * q, "OBS", "T", fixedglassw, fixedglassh);
                orderwrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "Clear", "Tempered", fixedglassw, fixedglassh);
                orderwrite("", "", "", "", "", idend, idend + "--01", 2 * q, "P516", "Tempered", fixedglassw, fixedglassh);
                break;
            case 10: // OBS/Lowe2 Tmp
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "lowe2", "T", fixedglassw, fixedglassh);
                glasswrite("", "", "", "", "", idend, idend + "--01", 2 * q, "OBS", "T", fixedglassw, fixedglassh);
                orderwrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "Lowe270", "Tempered", fixedglassw, fixedglassh);
                orderwrite("", "", "", "", "", idend, idend + "--01", 2 * q, "P516", "Tempered", fixedglassw, fixedglassh);
                break;
            case 11: // OBS/Lowe3 Tmp
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "lowe3", "T", fixedglassw, fixedglassh);
                glasswrite("", "", "", "", "", idend, idend + "--01", 2 * q, "OBS", "T", fixedglassw, fixedglassh);
                orderwrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "Lowe366", "Tempered", fixedglassw, fixedglassh);
                orderwrite("", "", "", "", "", idend, idend + "--01", 2 * q, "P516", "Tempered", fixedglassw, fixedglassh);
                break;
        }
    } else if (frameIndex === 1 || frameIndex === 2 || frameIndex === 3 || frameIndex === 4) { // Retrofit Block Block-slop 1 3/4 block-slop 1/2
        framew = round((w + 3 * 2) / 25.4, 3);
        frameh = round((h + 3 * 2) / 25.4, 3);
        
        if (frameIndex === 1) {
            framewrite(framew.toString(), "2", frameh.toString(), "2", "", "", "", "", "", "", "", "");
        }
        if (frameIndex === 2 || frameIndex === 4) {
            framewrite("", "", "", "", "", "", "", "", framew.toString(), "2", frameh.toString(), "2");
        }
        if (frameIndex === 3) {
            framewrite(framew.toString(), "1", "", "", "", "", "", "", framew.toString(), "1", frameh.toString(), "2");
        }
        
        coverw = round((w / 2 - 6 - 14 * 2 - 3 - 13) / 25.4, 3);
        coverh = round((h - 14 * 2 - 22 * 2) / 25.4, 3);
        bigmullion = round((h - 14 * 2 - 2 + (1.5)) / 25.4, 3);
        slop = round((w - 10) / 25.4, 1);
        
        if (frameIndex === 4) {
            partswrite("", "", "", "", "", coverw.toString(), coverh.toString(), bigmullion.toString(), "1", "", "", slop.toString());
        } else {
            partswrite("", "", "", "", "", coverw.toString(), coverh.toString(), bigmullion.toString(), "1", "", "", "");
        }
        
        fixedglassw = w / 2 - 6 - 20.5 * 2 - 3 * 2 - (3);
        fixedglassh = h - 20.5 * 2 - 3 * 2 - (2);
        
        fixedgridw = round(fixedglassw - 18 - (2), 0);
        fixedgridh = round(fixedglassh - 18 - (2), 0);
        
        const gridIndex = document.getElementById("cmbGrid").selectedIndex;
        
        switch (gridIndex) {
            case 1: // Standard
                gridwrite("", "", "", "", "", "", fixedgridw.toString(), "", "", fixedgridh.toString(), "", "");
                break;
            case 2: // Marginal
                gridwrite("", "", "", "", "", "", fixedgridw.toString(), (q * 4).toString(), "102", fixedgridh.toString(), (q * 4).toString(), "102");
                break;
            case 3: // Perimeter
                gridwrite("", "", "", "", "", "", fixedgridw.toString(), (q * 4).toString(), "102", fixedgridh.toString(), (q * 4).toString(), "102");
                break;
        }
        
        const glassIndex = document.getElementById("cmbGlass").selectedIndex;
        const customer = document.getElementById("txtCustomer").value;
        const style = document.getElementById("cmbStyle").value;
        
        switch (glassIndex) {
            case 0: // Clear/Clear
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 4 * q, "clear", "", fixedglassw, fixedglassh);
                break;
            case 1: // Clear/Lowe2
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "clear", "", fixedglassw, fixedglassh);
                glasswrite("", "", "", "", "", idend, idend + "--01", 2 * q, "lowe2", "", fixedglassw, fixedglassh);
                break;
            case 2: // Clear/Lowe3
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "clear", "", fixedglassw, fixedglassh);
                glasswrite("", "", "", "", "", idend, idend + "--01", 2 * q, "lowe3", "", fixedglassw, fixedglassh);
                break;
            case 3: // OBS/Clear
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "clear", "", fixedglassw, fixedglassh);
                glasswrite("", "", "", "", "", idend, idend + "--01", 2 * q, "OBS", "", fixedglassw, fixedglassh);
                break;
            case 4: // OBS/Lowe2
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "lowe2", "", fixedglassw, fixedglassh);
                glasswrite("", "", "", "", "", idend, idend + "--01", 2 * q, "OBS", "", fixedglassw, fixedglassh);
                break;
            case 5: // OBS/Lowe3
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "lowe3", "", fixedglassw, fixedglassh);
                glasswrite("", "", "", "", "", idend, idend + "--01", 2 * q, "OBS", "", fixedglassw, fixedglassh);
                break;
            case 6: // Clear/Clear Tmp
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 4 * q, "clear", "T", fixedglassw, fixedglassh);
                orderwrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 4 * q, "Clear", "Tempered", fixedglassw, fixedglassh);
                break;
            case 7: // Clear/Lowe2 Tmp
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "clear", "T", fixedglassw, fixedglassh);
                glasswrite("", "", "", "", "", idend, idend + "--01", 2 * q, "lowe2", "T", fixedglassw, fixedglassh);
                orderwrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "Clear", "Tempered", fixedglassw, fixedglassh);
                orderwrite("", "", "", "", "", idend, idend + "--01", 2 * q, "Lowe270", "Tempered", fixedglassw, fixedglassh);
                break;
            case 8: // Clear/Lowe3 Tmp
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "clear", "T", fixedglassw, fixedglassh);
                glasswrite("", "", "", "", "", idend, idend + "--01", 2 * q, "lowe3", "T", fixedglassw, fixedglassh);
                orderwrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "Clear", "Tempered", fixedglassw, fixedglassh);
                orderwrite("", "", "", "", "", idend, idend + "--01", 2 * q, "Lowe366", "Tempered", fixedglassw, fixedglassh);
                break;
            case 9: // OBS/Clear Tmp
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "clear", "T", fixedglassw, fixedglassh);
                glasswrite("", "", "", "", "", idend, idend + "--01", 2 * q, "OBS", "T", fixedglassw, fixedglassh);
                orderwrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "Clear", "Tempered", fixedglassw, fixedglassh);
                orderwrite("", "", "", "", "", idend, idend + "--01", 2 * q, "P516", "Tempered", fixedglassw, fixedglassh);
                break;
            case 10: // OBS/Lowe2 Tmp
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "lowe2", "T", fixedglassw, fixedglassh);
                glasswrite("", "", "", "", "", idend, idend + "--01", 2 * q, "OBS", "T", fixedglassw, fixedglassh);
                orderwrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "Lowe270", "Tempered", fixedglassw, fixedglassh);
                orderwrite("", "", "", "", "", idend, idend + "--01", 2 * q, "P516", "Tempered", fixedglassw, fixedglassh);
                break;
            case 11: // OBS/Lowe3 Tmp
                glasswrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "lowe3", "T", fixedglassw, fixedglassh);
                glasswrite("", "", "", "", "", idend, idend + "--01", 2 * q, "OBS", "T", fixedglassw, fixedglassh);
                orderwrite(customer, style, width.toString(), height.toString(), "", idend, idend + "--01", 2 * q, "Lowe366", "Tempered", fixedglassw, fixedglassh);
                orderwrite("", "", "", "", "", idend, idend + "--01", 2 * q, "P516", "Tempered", fixedglassw, fixedglassh);
                break;
        }
    }
}

// Helper functions
function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

// This function would need to be implemented based on how you're storing data
function getLastCell(sheetName, column) {
    // In a web context, this might be retrieving the last row from a table or data structure
    // For now, returning a placeholder implementation
    return document.getElementById("lastCellValue").value || "1";
}

// These functions would need to be implemented based on your specific requirements
function framewrite(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11, param12) {
    // Implementation for framewrite
    console.log("framewrite called with parameters:", arguments);
    // Add your implementation here
}

function partswrite(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11, param12) {
    // Implementation for partswrite
    console.log("partswrite called with parameters:", arguments);
    // Add your implementation here
}

function gridwrite(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11, param12) {
    // Implementation for gridwrite
    console.log("gridwrite called with parameters:", arguments);
    // Add your implementation here
}

function glasswrite(customer, style, width, height, param5, idend, idendSuffix, quantity, glassType, temperedFlag, glassWidth, glassHeight) {
    // Implementation for glasswrite
    console.log("glasswrite called with parameters:", arguments);
    // Add your implementation here
}

function orderwrite(customer, style, width, height, param5, idend, idendSuffix, quantity, glassType, temperedFlag, glassWidth, glassHeight) {
    // Implementation for orderwrite
    console.log("orderwrite called with parameters:", arguments);
    // Add your implementation here
} 