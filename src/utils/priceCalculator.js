import materialPrices from '../data/materialPrices.json';

/**
 * 根据材料类型计算价格
 * @param {string} key - 材料名称或标识符
 * @param {number|any} value - 材料的长度（英寸）或其他值
 * @returns {Object} 包含单价和总价的对象
 */
export const calculatePrice = (key, value) => {
  // 默认单价
  let unitPrice = materialPrices.defaultPricePerInch;
  
  // 检查是否是特殊固定价格项
  for (const [specialKey, price] of Object.entries(materialPrices.specialPrices)) {
    if (key.toLowerCase().includes(specialKey.toLowerCase())) {
      return {
        unitPrice: price,
        totalPrice: price
      };
    }
  }
  
  // 根据材料类型设置单价
  for (const material of materialPrices.materialTypes) {
    if (key.toLowerCase().includes(material.identifier.toLowerCase())) {
      unitPrice = material.pricePerInch;
      break;
    }
  }
  
  // 计算总价
  const totalPrice = typeof value === 'number' ? value * unitPrice : 0;
  
  return {
    unitPrice,
    totalPrice
  };
};

/**
 * 计算部分总价
 * @param {Object} data - 包含多个材料及其长度的对象
 * @returns {number} 总价
 */
export const calculateSectionTotal = (data) => {
  if (!data || Object.keys(data).length === 0) return 0;
  
  return Object.entries(data).reduce((total, [key, value]) => {
    const { totalPrice } = calculatePrice(key, value);
    return total + totalPrice;
  }, 0);
};

/**
 * 计算各部分总价
 * @param {Object} result - 包含窗户各部分数据的对象
 * @returns {Object} 各部分总价的对象
 */
export const calculateSectionTotals = (result) => {
  if (!result) return {};
  
  const sectionTotals = {
    Frame: 0,
    Sash: 0,
    Glass: 0,
    Grid: 0,
    Screen: 0,
    Parts: 0
  };
  
  // 计算框架总价
  if (result.frame && Object.keys(result.frame).length > 0) {
    sectionTotals.Frame = calculateSectionTotal(result.frame);
  }
  
  // 计算窗扇总价
  if (result.sash && Object.keys(result.sash).length > 0) {
    sectionTotals.Sash = calculateSectionTotal(result.sash);
  }
  
  // 计算玻璃总价
  if (result.glass && Object.keys(result.glass).length > 0) {
    sectionTotals.Glass = calculateSectionTotal(result.glass);
  }
  
  // 计算格栅总价
  if (result.grid && Object.keys(result.grid).length > 0) {
    sectionTotals.Grid = calculateSectionTotal(result.grid);
  }
  
  // 计算纱窗总价
  if (result.screen && Object.keys(result.screen).length > 0) {
    sectionTotals.Screen = calculateSectionTotal(result.screen);
  }
  
  // 计算其他部件总价
  if (result.parts && Object.keys(result.parts).length > 0) {
    sectionTotals.Parts = calculateSectionTotal(result.parts);
  }
  
  return sectionTotals;
};

/**
 * 计算总价
 * @param {Object} sectionTotals - 各部分总价的对象
 * @returns {number} 总价
 */
export const calculateGrandTotal = (sectionTotals) => {
  return Object.values(sectionTotals).reduce((total, value) => total + value, 0);
};

/**
 * 获取所有材料价格列表
 * @returns {Object} 材料价格数据
 */
export const getMaterialPrices = () => {
  return materialPrices;
};

/**
 * 获取特定材料的价格
 * @param {string} materialIdentifier - 材料标识符
 * @returns {number|null} 材料的单价，如果未找到则返回null
 */
export const getMaterialUnitPrice = (materialIdentifier) => {
  // 检查特殊固定价格
  if (materialPrices.specialPrices[materialIdentifier]) {
    return materialPrices.specialPrices[materialIdentifier];
  }
  
  // 检查材料类型
  const material = materialPrices.materialTypes.find(
    m => m.identifier.toLowerCase() === materialIdentifier.toLowerCase()
  );
  
  return material ? material.pricePerInch : null;
}; 