import React, { useState, useEffect, useRef } from 'react';
import { 
    calculatePrice, 
    calculateSectionTotals, 
    calculateGrandTotal, 
    getMaterialPrices 
} from '../utils/priceCalculator';
import PriceManager from './PriceManager';

function ResultDisplay({ formData, orders, onDeleteOrder }) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showPriceView, setShowPriceView] = useState(false);
    const [showPriceManager, setShowPriceManager] = useState(false);
    
    const latestOrder = orders[orders.length - 1];
    
    if (!latestOrder || !latestOrder.result) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="bg-gray-50 rounded-full p-2">
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-gray-900">No Results Available</h3>
                    <p className="mt-1 text-sm text-gray-600">Please fill out the form and calculate to see results.</p>
                </div>
            </div>
        );
    }

    const { result } = latestOrder;
    const hasFrame = result.frame && Object.keys(result.frame).length > 0;
    const hasSash = result.sash && Object.keys(result.sash).length > 0;
    const hasGlass = result.glass && Object.keys(result.glass).length > 0;
    const hasGrid = result.grid && Object.keys(result.grid).length > 0;
    const hasParts = result.parts && Object.keys(result.parts).length > 0;
    const hasScreen = result.screen && Object.keys(result.screen).length > 0;
    const quantity = parseInt(latestOrder.quantity) || 1;

    const formatMeasurement = (value, isMetric = false) => {
        if (typeof value !== 'number') return value;
        if (isMetric) {
            return value > 100 ? `${value.toFixed(1)} mm` : `${value.toFixed(3)} inches`;
        }
        return `${value.toFixed(3)} inches`;
    };

    const ResultSection = ({ title, icon, data, isMetric = false }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 rounded-md border border-gray-100 p-2.5 hover:bg-gray-100 transition-colors duration-150">
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </dt>
                            <dd className="mt-0.5 text-base font-semibold text-gray-900">
                                {formatMeasurement(value, isMetric)}
                            </dd>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // Item summary for the order list
    const OrderItem = ({ order, index }) => {
        const orderQuantity = parseInt(order.quantity) || 1;
        
        const handleClick = () => {
            setSelectedOrder(order);
            setShowModal(true);
        };

    return (
            <div 
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-2 hover:border-blue-200 hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                onClick={handleClick}
            >
                <div className="p-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="bg-blue-100 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium mr-2">
                                {index + 1}
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">{order.style} Window</h4>
                                <p className="text-xs text-gray-500">
                                    {order.width}" × {order.height}" | {orderQuantity} {orderQuantity === 1 ? 'unit' : 'units'}
                                </p>
                        </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">
                                {order.customer && `${order.customer}`}
                                {order.po && ` | PO: ${order.po}`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Modal for displaying item details
    const ItemDetailsModal = ({ order, onClose }) => {
        if (!order || !order.result) return null;
        
        const { result } = order;
        const hasFrame = result.frame && Object.keys(result.frame).length > 0;
        const hasSash = result.sash && Object.keys(result.sash).length > 0;
        const hasGlass = result.glass && Object.keys(result.glass).length > 0;
        const hasGrid = result.grid && Object.keys(result.grid).length > 0;
        const hasParts = result.parts && Object.keys(result.parts).length > 0;
        const hasScreen = result.screen && Object.keys(result.screen).length > 0;
        const quantity = parseInt(order.quantity) || 1;
        
        // Pie Chart Component
        const PieChart = ({ sectionTotals }) => {
            const canvasRef = useRef(null);
            const grandTotal = calculateGrandTotal(sectionTotals);
            
            // Colors for pie chart sections
            const colors = {
                Frame: '#4299E1', // blue
                Sash: '#48BB78',  // green
                Glass: '#F6AD55',  // orange
                Grid: '#F56565',   // red
                Screen: '#9F7AEA', // purple
                Parts: '#ED64A6'   // pink
            };
            
            // Filter out sections with zero value
            const filteredSections = Object.entries(sectionTotals)
                .filter(([_, value]) => value > 0)
                .map(([key, value]) => ({
                    name: key,
                    value,
                    percentage: ((value / grandTotal) * 100).toFixed(1),
                    color: colors[key]
                }));
            
            useEffect(() => {
                if (!canvasRef.current || filteredSections.length === 0) return;
                
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const radius = Math.min(centerX, centerY) - 30; // Reduced radius to make room for labels
                
                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw pie chart
                let startAngle = 0;
                filteredSections.forEach(section => {
                    const sliceAngle = (section.value / grandTotal) * 2 * Math.PI;
                    const midAngle = startAngle + sliceAngle / 2;
                    
                    // Draw pie slice
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
                    ctx.closePath();
                    
                    ctx.fillStyle = section.color;
                    ctx.fill();
                    
                    // Draw label and arrow
                    const labelRadius = radius * 1.2; // Position for label
                    const arrowStartRadius = radius * 0.8; // Start position for arrow (inside the slice)
                    
                    // Calculate label position
                    const labelX = centerX + Math.cos(midAngle) * labelRadius;
                    const labelY = centerY + Math.sin(midAngle) * labelRadius;
                    
                    // Calculate arrow start position
                    const arrowStartX = centerX + Math.cos(midAngle) * arrowStartRadius;
                    const arrowStartY = centerY + Math.sin(midAngle) * arrowStartRadius;
                    
                    // Draw arrow
                    ctx.beginPath();
                    ctx.moveTo(arrowStartX, arrowStartY);
                    ctx.lineTo(labelX - Math.cos(midAngle) * 15, labelY - Math.sin(midAngle) * 15);
                    ctx.strokeStyle = section.color;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    // Draw arrowhead
                    const arrowheadSize = 6;
                    const arrowEndX = labelX - Math.cos(midAngle) * 15;
                    const arrowEndY = labelY - Math.sin(midAngle) * 15;
                    
                    ctx.beginPath();
                    ctx.moveTo(arrowEndX, arrowEndY);
                    ctx.lineTo(
                        arrowEndX - arrowheadSize * Math.cos(midAngle - Math.PI/6),
                        arrowEndY - arrowheadSize * Math.sin(midAngle - Math.PI/6)
                    );
                    ctx.lineTo(
                        arrowEndX - arrowheadSize * Math.cos(midAngle + Math.PI/6),
                        arrowEndY - arrowheadSize * Math.sin(midAngle + Math.PI/6)
                    );
                    ctx.closePath();
                    ctx.fillStyle = section.color;
                    ctx.fill();
                    
                    // Draw label
                    ctx.font = 'bold 12px Arial';
                    ctx.fillStyle = section.color;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
                    // Format label text
                    const labelText = `${section.name}: ${section.percentage}%`;
                    
                    // Draw label background for better readability
                    const textMetrics = ctx.measureText(labelText);
                    const textWidth = textMetrics.width;
                    const textHeight = 16; // Approximate height
                    
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.fillRect(
                        labelX - textWidth/2 - 4,
                        labelY - textHeight/2 - 2,
                        textWidth + 8,
                        textHeight + 4
                    );
                    
                    // Draw text
                    ctx.fillStyle = section.color;
                    ctx.fillText(labelText, labelX, labelY);
                    
                    startAngle += sliceAngle;
                });
                
                // Draw a white circle in the center for a donut chart effect
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius * 0.4, 0, 2 * Math.PI);
                ctx.fillStyle = 'white';
                ctx.fill();
                
                // Draw total in the center
                ctx.font = 'bold 14px Arial';
                ctx.fillStyle = '#4A5568';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Total', centerX, centerY - 10);
                ctx.font = 'bold 16px Arial';
                ctx.fillText(`$${grandTotal.toFixed(2)}`, centerX, centerY + 10);
                
            }, [filteredSections]);
            
            return (
                <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-700 mb-4">Price Distribution</h4>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <div className="relative w-80 h-80">
                            <canvas ref={canvasRef} width="320" height="320" className="w-full h-full"></canvas>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {filteredSections.map(section => (
                                <div key={section.name} className="flex items-center">
                                    <div 
                                        className="w-4 h-4 mr-2 rounded-sm" 
                                        style={{ backgroundColor: section.color }}
                                    ></div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">{section.name}: </span>
                                        <span className="text-sm text-gray-600">${section.value.toFixed(2)} ({section.percentage}%)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        };
        
        // Material table component
        const MaterialTable = ({ data }) => {
            // Calculate total price for all materials in this section
            const totalSectionPrice = Object.entries(data).reduce((total, [key, value]) => {
                const { totalPrice } = calculatePrice(key, value);
                return total + totalPrice;
            }, 0);
            
            // Calculate grand total for percentage calculation
            const sectionTotals = calculateSectionTotals(result);
            const grandTotal = calculateGrandTotal(sectionTotals);
            
            // Find the section name based on the data
            let sectionName = '';
            if (data === result.frame) sectionName = 'Frame';
            else if (data === result.sash) sectionName = 'Sash';
            else if (data === result.glass) sectionName = 'Glass';
            else if (data === result.grid) sectionName = 'Grid';
            else if (data === result.screen) sectionName = 'Screen';
            else if (data === result.parts) sectionName = 'Parts';
            
            // Calculate percentage of grand total
            const sectionPercentage = grandTotal > 0 ? ((totalSectionPrice / grandTotal) * 100).toFixed(1) : 0;
            
            return (
                <div className="overflow-x-auto">
                    <div className="flex justify-between items-center mb-2">
                        <h5 className="text-sm font-medium text-gray-500">
                            {sectionPercentage > 0 && `${sectionPercentage}% of total cost`}
                        </h5>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Material
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Length
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Unit Price
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Price
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Object.entries(data).map(([key, value]) => {
                                const { unitPrice, totalPrice } = calculatePrice(key, value);
                                return (
                                    <tr key={key} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {typeof value === 'number' ? value.toFixed(3) + ' inches' : value}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${unitPrice.toFixed(2)}/inch
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            ${totalPrice.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                            <tr className="bg-gray-50">
                                <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                    Section Total:
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                    ${totalSectionPrice.toFixed(2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        };
        
        // Calculate section totals for pie chart
        const sectionTotals = calculateSectionTotals(result);
        const grandTotal = calculateGrandTotal(sectionTotals);
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {order.style} Window Details
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {order.width}" × {order.height}" | {quantity} {quantity === 1 ? 'unit' : 'units'}
                                    {order.customer && ` | ${order.customer}`}
                                    {order.po && ` | PO: ${order.po}`}
                                    {order.batchNo && ` | Batch: ${order.batchNo}`}
                                </p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Price Distribution Pie Chart */}
                        <PieChart sectionTotals={sectionTotals} />
                        
                        <div className="space-y-6 mt-6">
                            {/* Frame */}
            {hasFrame && (
                                <div>
                                    <h4 className="text-md font-medium text-gray-700 mb-2">Frame</h4>
                                    <MaterialTable data={result.frame} />
                                </div>
                            )}
                            
                            {/* Sash */}
            {hasSash && (
                                <div>
                                    <h4 className="text-md font-medium text-gray-700 mb-2">Sash</h4>
                                    <MaterialTable data={result.sash} />
                                </div>
                            )}
                            
                            {/* Glass */}
            {hasGlass && (
                                <div>
                                    <h4 className="text-md font-medium text-gray-700 mb-2">Glass</h4>
                                    <MaterialTable data={result.glass} />
                                </div>
                            )}
                            
                            {/* Grid */}
                            {hasGrid && (
                                <div>
                                    <h4 className="text-md font-medium text-gray-700 mb-2">Grid</h4>
                                    <MaterialTable data={result.grid} />
                                </div>
                            )}
                            
                            {/* Screen */}
                            {hasScreen && (
                                <div>
                                    <h4 className="text-md font-medium text-gray-700 mb-2">Screen</h4>
                                    <MaterialTable data={result.screen} />
                                </div>
                            )}
                            
                            {/* Parts */}
            {hasParts && (
                                <div>
                                    <h4 className="text-md font-medium text-gray-700 mb-2">Additional Parts</h4>
                                    <MaterialTable data={result.parts} />
                                </div>
            )}

            {/* Notes */}
                            {order.gridNote && (
                                <div>
                                    <h4 className="text-md font-medium text-gray-700 mb-2">Notes</h4>
                                    <div className="bg-yellow-50 rounded-md border border-yellow-100 p-2.5">
                                        <p className="text-sm text-yellow-800">{order.gridNote}</p>
                                    </div>
                                </div>
                            )}
                            
                            {/* Order Total */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-lg font-medium text-gray-900">Order Total</h4>
                                    <div className="text-xl font-bold text-gray-900">
                                        ${(grandTotal * quantity).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 border-t border-gray-200 flex justify-end">
                        <button 
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Price Table Component 
    const PriceTable = ({ order, index }) => {
        const { result } = order;
        const quantity = parseInt(order.quantity) || 1;
        const sectionTotals = calculateSectionTotals(result);
        const grandTotal = calculateGrandTotal(sectionTotals);
        
        // Sort sections by price in descending order
        const sortedSections = Object.entries(sectionTotals)
            .filter(([_, value]) => value > 0)
            .sort((a, b) => b[1] - a[1])
            .map(([key, value]) => ({
                name: key,
                value,
                percentage: ((value / grandTotal) * 100).toFixed(1)
            }));
        
        // Bar chart max width in percentage
        const maxBarWidth = 70;
        
        // Extract frame type, glass type, etc. from the order data
        const frameType = order.frameType || order.frame || 'Standard';
        const glassType = order.glassType || order.glass || 'Clear';
        const hasArgon = order.argon ? 'Yes' : 'No';
        const gridType = order.grid || 'None';
        const color = order.color || 'White';
        
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-2">
                <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                            <div className="bg-blue-100 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium mr-2">
                                {index + 1}
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">{order.style} Window</h4>
                                <p className="text-xs text-gray-500">
                                    {order.width}" × {order.height}" | {quantity} {quantity === 1 ? 'unit' : 'units'}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">
                                ${(grandTotal * quantity).toFixed(2)}
                            </p>
                        </div>
                    </div>
                    
                    {/* 添加窗户规格信息 */}
                    <div className="flex flex-wrap gap-1 mb-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-800">
                            Frame: {frameType}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-800">
                            Glass: {glassType}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-800">
                            Argon: {hasArgon}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-800">
                            Grid: {gridType}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-800">
                            Color: {color}
                        </span>
                        {order.gridNote && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-50 text-yellow-800">
                                <svg className="mr-1 h-2 w-2 text-yellow-600" fill="currentColor" viewBox="0 0 8 8">
                                    <circle cx="4" cy="4" r="3" />
                                </svg>
                                Note
                            </span>
                        )}
                    </div>
                    
                    <div className="mt-3 space-y-2">
                        {sortedSections.map(section => (
                            <div key={section.name} className="relative">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-700">
                                        {section.name}
                                    </span>
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-900 mr-2">
                                            ${section.value.toFixed(2)}
                                        </span>
                                        <span className="text-xs font-medium text-gray-500">
                                            {section.percentage}%
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div 
                                        className="h-2.5 rounded-full" 
                                        style={{ 
                                            width: `${Math.min(parseFloat(section.percentage), 100) * maxBarWidth / 100}%`,
                                            backgroundColor: 
                                                section.name === 'Frame' ? '#4299E1' : 
                                                section.name === 'Sash' ? '#48BB78' : 
                                                section.name === 'Glass' ? '#F6AD55' : 
                                                section.name === 'Grid' ? '#F56565' : 
                                                section.name === 'Screen' ? '#9F7AEA' : '#ED64A6'
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-3 flex justify-end">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onDeleteOrder) {
                                    onDeleteOrder(order.id);
                                }
                            }}
                            className="text-red-600 hover:text-red-900 focus:outline-none text-sm flex items-center"
                            title="Delete item"
                        >
                            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Order Items Header with View Toggle */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
                <div className="flex items-center">
                    <div className="text-sm text-gray-500 mr-4">
                        Total: {orders.length} item{orders.length !== 1 ? 's' : ''} | {' '}
                        {orders.reduce((total, order) => total + (parseInt(order.quantity) || 1), 0)} units
                    </div>
                    <div className="flex bg-gray-100 rounded-lg p-0.5">
                        <button
                            onClick={() => setShowPriceView(false)}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-150 ${
                                !showPriceView 
                                    ? 'bg-white text-gray-800 shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Details
                        </button>
                        <button
                            onClick={() => setShowPriceView(true)}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-150 ${
                                showPriceView 
                                    ? 'bg-white text-gray-800 shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Price
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Order Items List - Price View */}
            {showPriceView && (
                <div>
                    {orders.map((order, index) => (
                        <PriceTable key={order.id} order={order} index={index} />
                    ))}
                </div>
            )}
            
            {/* Order Items List - Table View */}
            {!showPriceView && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            #
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Batch No.
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Style
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            W
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            H
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Frame
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Glass
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Argon
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Grid
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Color
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Note
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order, index) => {
                                        // Extract frame type, glass type, etc. from the order data
                                        const frameType = order.frameType || order.frame || 'Standard';
                                        const glassType = order.glassType || order.glass || 'Clear';
                                        const hasArgon = order.argon ? 'Yes' : 'No';
                                        const gridType = order.grid || 'None';
                                        const color = order.color || 'White';
                                        
                                        return (
                                            <tr 
                                                key={order.id} 
                                                className="hover:bg-blue-50 transition-colors duration-150"
                                            >
                                                <td 
                                                    className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <div className="bg-blue-100 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium">
                                                        {index + 1}
                                                    </div>
                                                </td>
                                                <td 
                                                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    {order.batchNo || '-'}
                                                </td>
                                                <td 
                                                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    {order.customer || '-'}
                                                </td>
                                                <td 
                                                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    {order.style || '-'}
                                                </td>
                                                <td 
                                                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    {order.width ? parseFloat(order.width).toFixed(3) : '-'}
                                                </td>
                                                <td 
                                                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    {order.height ? parseFloat(order.height).toFixed(3) : '-'}
                                                </td>
                                                <td 
                                                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    {frameType}
                                                </td>
                                                <td 
                                                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    {glassType}
                                                </td>
                                                <td 
                                                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    {hasArgon}
                                                </td>
                                                <td 
                                                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    {gridType}
                                                </td>
                                                <td 
                                                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    {color}
                                                </td>
                                                <td 
                                                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    {order.gridNote ? 
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            <svg className="mr-1.5 h-2 w-2 text-yellow-400" fill="currentColor" viewBox="0 0 8 8">
                                                                <circle cx="4" cy="4" r="3" />
                                                            </svg>
                                                            Note
                                                        </span> : '-'
                                                    }
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (onDeleteOrder) {
                                                                onDeleteOrder(order.id);
                                                            }
                                                        }}
                                                        className="text-red-600 hover:text-red-900 focus:outline-none"
                                                        title="Delete item"
                                                    >
                                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Button */}
            <div className="flex justify-end mt-6">
                <button 
                    onClick={() => setShowPriceManager(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                >
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    价格设置
                </button>
                <button 
                    onClick={window.print}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                    </svg>
                    Print Order
                </button>
            </div>

            {/* Item Details Modal */}
            {showModal && selectedOrder && (
                <ItemDetailsModal 
                    order={selectedOrder} 
                    onClose={() => {
                        setShowModal(false);
                        setSelectedOrder(null);
                    }} 
                />
            )}

            {/* Price Manager Modal */}
            {showPriceManager && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">材料价格设置</h3>
                            <button 
                                onClick={() => setShowPriceManager(false)}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4">
                            <PriceManager />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ResultDisplay; 