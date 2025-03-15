import React, { useState } from 'react';
import { calculate } from '../lib/calculations';
import ResultDisplay from './ResultDisplay';

function OrderForm() {
    const [formData, setFormData] = useState({
        customer: '',
        po: '',
        batchNo: '',
        style: '',
        width: '',
        height: '',
        fixHeight: '',
        frame: '',
        color: '',
        glass: '',
        argon: '',
        grid: '',
        gridNote: '',
        quantity: '1'
    });
    const [allOrders, setAllOrders] = useState([]);
    const [showGridDetails, setShowGridDetails] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [touchedFields, setTouchedFields] = useState({});

    const handleBlur = (fieldName) => {
        setTouchedFields(prev => ({
            ...prev,
            [fieldName]: true
        }));
    };

    const getFieldError = (fieldName) => {
        if (!touchedFields[fieldName]) return '';
        
        switch (fieldName) {
            case 'width':
            case 'height':
                return !formData[fieldName] ? `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required` :
                       isNaN(formData[fieldName]) || parseFloat(formData[fieldName]) <= 0 ? `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be a positive number` : '';
            case 'style':
            case 'frame':
            case 'glass':
                return !formData[fieldName] ? `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required` : '';
            default:
                return '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError('');
        setFormSuccess('');
        
        try {
            // Mark all fields as touched for validation
            const allFields = {
                style: true,
                width: true,
                height: true,
                frame: true,
                glass: true
            };
            setTouchedFields(allFields);

            // Validate required fields
            const requiredFields = ['style', 'width', 'height', 'frame', 'glass'];
            const missingFields = requiredFields.filter(field => !formData[field]);
            
            if (missingFields.length > 0) {
                setFormError(`Please fill in all required fields: ${missingFields.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', ')}`);
                setIsSubmitting(false);
                return;
            }

            // Validate numeric inputs
            const width = parseFloat(formData.width);
            const height = parseFloat(formData.height);
            
            if (isNaN(width) || width <= 0) {
                setFormError('Width must be a positive number');
                setIsSubmitting(false);
                return;
            }
            
            if (isNaN(height) || height <= 0) {
                setFormError('Height must be a positive number');
                setIsSubmitting(false);
                return;
            }

            // Calculate
            const calculationResult = calculate(formData);
            
            if (calculationResult) {
                const newOrder = {
                    ...formData,
                    result: calculationResult,
                    id: Date.now()
                };
                
                // Add the new order to the list without clearing the form
                setAllOrders(prevOrders => [...prevOrders, newOrder]);
                setShowResults(true);
                setIsSubmitting(false);
                
                // Display a success message
                setFormSuccess(`Item added successfully! (${formData.style}, ${width}×${height}, Qty: ${formData.quantity})`);
                setTimeout(() => setFormSuccess(''), 3000);
            } else {
                setFormError(`Calculation failed for style "${formData.style}". Please check your input values.`);
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Calculation error:', error);
            setFormError(`An error occurred during calculation: ${error.message || 'Unknown error'}. Please check your input values.`);
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value ? parseFloat(value) : '') : value
        }));

        if (name === 'grid') {
            setShowGridDetails(value === 'Standard');
        }
    };

    const handleReset = () => {
        setFormData({
            customer: '',
            po: '',
            batchNo: '',
            style: '',
            width: '',
            height: '',
            fixHeight: '',
            frame: '',
            color: '',
            glass: '',
            argon: '',
            grid: '',
            gridNote: '',
            quantity: '1'
        });
        setShowResults(false);
        setFormError('');
        setTouchedFields({});
    };

    const inputClasses = (fieldName) => `
        mt-1 block w-full rounded-md shadow-sm transition duration-150 ease-in-out
        ${touchedFields[fieldName] && getFieldError(fieldName) 
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-300 focus:ring-red-300'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
        sm:text-sm
    `;

    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
    const requiredLabelClasses = "block text-sm font-medium text-gray-700 mb-1 after:content-['*'] after:ml-0.5 after:text-red-500";

    const handleDeleteOrder = (orderId) => {
        // 确认删除
        if (window.confirm('确定要删除这个订单项吗？')) {
            setAllOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {formError && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{formError}</p>
                        </div>
                    </div>
                </div>
            )}

            {formSuccess && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">{formSuccess}</p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Customer Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
                                    Customer
                                </label>
                                <input
                                    type="text"
                                    id="customer"
                                    name="customer"
                                    value={formData.customer}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter customer name"
                                />
                            </div>
                            <div>
                                <label htmlFor="po" className="block text-sm font-medium text-gray-700">
                                    P.O
                                </label>
                                <input
                                    type="text"
                                    id="po"
                                    name="po"
                                    value={formData.po}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter purchase order"
                                />
                            </div>
                            <div>
                                <label htmlFor="batchNo" className="block text-sm font-medium text-gray-700">
                                    Batch NO.
                                </label>
                                <input
                                    type="text"
                                    id="batchNo"
                                    name="batchNo"
                                    value={formData.batchNo}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter batch number"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Window Specifications */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                            <div>
                                <label htmlFor="style" className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500">
                                    Style
                                </label>
                                <select
                                    id="style"
                                    name="style"
                                    value={formData.style}
                                    onChange={handleInputChange}
                                    onBlur={() => handleBlur('style')}
                                    className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Style</option>
                                    <option value="XO">XO</option>
                                    <option value="OX">OX</option>
                                    <option value="XOX">XOX</option>
                                    <option value="XOX-1/3">XOX-1/3</option>
                                    <option value="SH">SH</option>
                                    <option value="PW">PW</option>
                                    <option value="XO-P">XO-P</option>
                                    <option value="SH-P">SH-P</option>
                                    <option value="PSH">PSH</option>
                                    <option value="HPP">HPP</option>
                                    <option value="VPP">VPP</option>
                                    <option value="XO-PP-OX-PP">XO-PP-OX-PP</option>
                                    <option value="XOX-PPP">XOX-PPP</option>
                                    <option value="PPP-XOX">PPP-XOX</option>
                                    <option value="XOX-PP">XOX-PP</option>
                                    <option value="PP-XOX">PP-XOX</option>
                                    <option value="IGU">IGU</option>
                                    <option value="Screen">Screen</option>
                                </select>
                                {touchedFields.style && getFieldError('style') && (
                                    <p className="mt-1 text-xs text-red-600">{getFieldError('style')}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="width" className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500">
                                    Width
                                </label>
                                <div className="mt-1 relative rounded-lg shadow-sm">
                                    <input
                                        type="number"
                                        id="width"
                                        name="width"
                                        value={formData.width}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur('width')}
                                        className="block w-full rounded-lg border-gray-200 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0.000"
                                        step="0.001"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">in</span>
                                    </div>
                                </div>
                                {touchedFields.width && getFieldError('width') && (
                                    <p className="mt-1 text-xs text-red-600">{getFieldError('width')}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="height" className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500">
                                    Height
                                </label>
                                <div className="mt-1 relative rounded-lg shadow-sm">
                                    <input
                                        type="number"
                                        id="height"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur('height')}
                                        className="block w-full rounded-lg border-gray-200 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0.000"
                                        step="0.001"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">in</span>
                                    </div>
                                </div>
                                {touchedFields.height && getFieldError('height') && (
                                    <p className="mt-1 text-xs text-red-600">{getFieldError('height')}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="fixHeight" className="block text-sm font-medium text-gray-700">
                                    Fix Height
                                </label>
                                <div className="mt-1 relative rounded-lg shadow-sm">
                                    <input
                                        type="number"
                                        id="fixHeight"
                                        name="fixHeight"
                                        value={formData.fixHeight}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-lg border-gray-200 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0.000"
                                        step="0.001"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">in</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                    Qty
                                </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                                    min="1"
                                    step="1"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Frame and Color */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="frame" className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500">
                                    Frame
                                </label>
                                <select
                                    id="frame"
                                    name="frame"
                                    value={formData.frame}
                                    onChange={handleInputChange}
                                    onBlur={() => handleBlur('frame')}
                                    className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Frame</option>
                                    <option value="nailon">Nailon</option>
                                    <option value="retrofit">Retrofit</option>
                                    <option value="block">Block</option>
                                    <option value="block-slop">Block-Slop</option>
                                </select>
                                {touchedFields.frame && getFieldError('frame') && (
                                    <p className="mt-1 text-xs text-red-600">{getFieldError('frame')}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                                    Color
                                </label>
                                <select
                                    id="color"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Color</option>
                                    <option value="White">White</option>
                                    <option value="Black">Black</option>
                                    <option value="Brown">Brown</option>
                                    <option value="Beige">Beige</option>
                                    <option value="Grey">Grey</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Glass and Grid */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label htmlFor="glass" className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500">
                                    Glass
                                </label>
                                <select
                                    id="glass"
                                    name="glass"
                                    value={formData.glass}
                                    onChange={handleInputChange}
                                    onBlur={() => handleBlur('glass')}
                                    className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Glass</option>
                                    <option value="Clear/Clear">Clear/Clear</option>
                                    <option value="Clear/Lowe2">Clear/Lowe2</option>
                                    <option value="Clear/Lowe3">Clear/Lowe3</option>
                                    <option value="OBS/Clear">OBS/Clear</option>
                                    <option value="OBS/Lowe2">OBS/Lowe2</option>
                                    <option value="OBS/Lowe3">OBS/Lowe3</option>
                                    <option value="Clear/Clear TP">Clear/Clear TP</option>
                                    <option value="Clear/Lowe2 TP">Clear/Lowe2 TP</option>
                                    <option value="Clear/Lowe3 TP">Clear/Lowe3 TP</option>
                                    <option value="OBS/Clear TP">OBS/Clear TP</option>
                                    <option value="OBS/Lowe2 TP">OBS/Lowe2 TP</option>
                                    <option value="OBS/Lowe3 TP">OBS/Lowe3 TP</option>
                                </select>
                                {touchedFields.glass && getFieldError('glass') && (
                                    <p className="mt-1 text-xs text-red-600">{getFieldError('glass')}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="argon" className="block text-sm font-medium text-gray-700">
                                    Argon
                                </label>
                                <select
                                    id="argon"
                                    name="argon"
                                    value={formData.argon}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Argon</option>
                                    <option value="Argon">Argon</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="grid" className="block text-sm font-medium text-gray-700">
                                    Grid
                                </label>
                                <select
                                    id="grid"
                                    name="grid"
                                    value={formData.grid}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Grid</option>
                                    <option value="None">None</option>
                                    <option value="Standard">Standard</option>
                                    <option value="Marginal">Marginal</option>
                                    <option value="Perimeter">Perimeter</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Details */}
                {showGridDetails && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="gridW" className="block text-sm font-medium text-gray-700">
                                        Grid Width
                                    </label>
                                    <div className="mt-1 relative rounded-lg shadow-sm">
                                        <input
                                            type="number"
                                            id="gridW"
                                            name="gridW"
                                            value={formData.gridW}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-lg border-gray-200 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0.000"
                                            step="0.001"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">in</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="gridH" className="block text-sm font-medium text-gray-700">
                                        Grid Height
                                    </label>
                                    <div className="mt-1 relative rounded-lg shadow-sm">
                                        <input
                                            type="number"
                                            id="gridH"
                                            name="gridH"
                                            value={formData.gridH}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-lg border-gray-200 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0.000"
                                            step="0.001"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">in</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Additional Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-3">
                        <div>
                            <label htmlFor="gridNote" className="block text-sm font-medium text-gray-700">
                                Grid Note
                            </label>
                            <input
                                type="text"
                                id="gridNote"
                                name="gridNote"
                                value={formData.gridNote}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Additional notes about grid"
                            />
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`
                            inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent 
                            rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                            transition-colors duration-150 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                        `}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            <>
                                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                                Calculate & Add Item
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Results */}
            {showResults && allOrders.length > 0 && (
                <div className="mt-8">
                    <ResultDisplay 
                        formData={formData}
                        orders={allOrders}
                        onDeleteOrder={handleDeleteOrder}
                    />
                </div>
            )}
        </div>
    );
}

export default OrderForm; 