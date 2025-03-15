import React, { useState, useEffect } from 'react';
import { getMaterialPrices } from '../utils/priceCalculator';

function PriceManager() {
    const [prices, setPrices] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPrices, setEditedPrices] = useState(null);
    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        // 加载价格数据
        const materialPrices = getMaterialPrices();
        setPrices(materialPrices);
        setEditedPrices(JSON.parse(JSON.stringify(materialPrices))); // 深拷贝
    }, []);

    const handleEditToggle = () => {
        if (isEditing) {
            // 如果正在编辑，则切换为保存模式
            try {
                // 这里可以添加保存到文件或API的逻辑
                // 在实际应用中，您需要调用API或本地存储来保存数据
                console.log('保存价格数据:', editedPrices);
                setPrices(editedPrices);
                setSaveStatus('价格数据已成功保存！');
                setTimeout(() => setSaveStatus(''), 3000);
            } catch (error) {
                console.error('保存价格数据失败:', error);
                setSaveStatus('保存失败，请重试！');
                setTimeout(() => setSaveStatus(''), 3000);
            }
        }
        setIsEditing(!isEditing);
    };

    const handlePriceChange = (type, index, field, value) => {
        const newEditedPrices = { ...editedPrices };
        
        if (type === 'default') {
            newEditedPrices.defaultPricePerInch = parseFloat(value);
        } else if (type === 'material') {
            newEditedPrices.materialTypes[index][field] = field === 'pricePerInch' 
                ? parseFloat(value) 
                : value;
        } else if (type === 'special') {
            const key = Object.keys(newEditedPrices.specialPrices)[index];
            newEditedPrices.specialPrices[key] = parseFloat(value);
        }
        
        setEditedPrices(newEditedPrices);
    };

    if (!prices) {
        return <div className="p-4">加载价格数据...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">材料价格管理</h2>
                    <div className="flex items-center space-x-2">
                        {saveStatus && (
                            <span className={`text-sm ${saveStatus.includes('成功') ? 'text-green-600' : 'text-red-600'}`}>
                                {saveStatus}
                            </span>
                        )}
                        <button
                            onClick={handleEditToggle}
                            className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                isEditing
                                    ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
                            }`}
                        >
                            {isEditing ? '保存价格' : '编辑价格'}
                        </button>
                    </div>
                </div>

                {/* 默认价格 */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">默认价格</h3>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-700 w-32">默认单价（每英寸）：</span>
                            {isEditing ? (
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={editedPrices.defaultPricePerInch}
                                    onChange={(e) => handlePriceChange('default', null, null, e.target.value)}
                                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-24 sm:text-sm border rounded-md"
                                />
                            ) : (
                                <span className="text-sm text-gray-900">${prices.defaultPricePerInch.toFixed(2)}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* 材料类型价格 */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">材料类型价格</h3>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            标识符
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            描述
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            单价（每英寸）
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {(isEditing ? editedPrices : prices).materialTypes.map((material, index) => (
                                        <tr key={material.identifier} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={material.identifier}
                                                        onChange={(e) => handlePriceChange('material', index, 'identifier', e.target.value)}
                                                        className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border rounded-md"
                                                    />
                                                ) : (
                                                    material.identifier
                                                )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={material.description}
                                                        onChange={(e) => handlePriceChange('material', index, 'description', e.target.value)}
                                                        className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border rounded-md"
                                                    />
                                                ) : (
                                                    material.description
                                                )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={material.pricePerInch}
                                                        onChange={(e) => handlePriceChange('material', index, 'pricePerInch', e.target.value)}
                                                        className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-24 sm:text-sm border rounded-md"
                                                    />
                                                ) : (
                                                    `$${material.pricePerInch.toFixed(2)}`
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 特殊价格 */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">特殊项目固定价格</h3>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            项目名称
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            价格
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {Object.entries((isEditing ? editedPrices : prices).specialPrices).map(([key, value], index) => (
                                        <tr key={key} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {key}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={value}
                                                        onChange={(e) => handlePriceChange('special', index, null, e.target.value)}
                                                        className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-24 sm:text-sm border rounded-md"
                                                    />
                                                ) : (
                                                    `$${value.toFixed(2)}`
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PriceManager; 