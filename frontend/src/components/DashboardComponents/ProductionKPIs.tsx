interface InventoryMetrics {
  greenLeaf: { today: number; thisMonth: number };
  madeTea: { today: number; currentStock: number };
  firewood: { currentStock: number; daysRemaining: number; todayConsumption: number };
  packingMaterials: { lowStock: boolean };
}

interface ProductionKPIsProps {
  inventoryMetrics: InventoryMetrics;
}

const ProductionKPIs = ({ inventoryMetrics }: ProductionKPIsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg p-5 shadow border border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Green Leaf (Today)</p>
            <p className="text-2xl font-bold text-gray-800">{inventoryMetrics.greenLeaf.today.toLocaleString()} kg</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5 shadow border border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Made Tea Stock</p>
            <p className="text-2xl font-bold text-gray-800">{inventoryMetrics.madeTea.currentStock.toLocaleString()} kg</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5 shadow border border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Firewood Stock</p>
            <p className="text-2xl font-bold text-gray-800">{inventoryMetrics.firewood.currentStock.toLocaleString()} kg</p>
            <p className="text-xs text-gray-500 mt-1">
              {inventoryMetrics.firewood.daysRemaining > 0 ? `~${inventoryMetrics.firewood.daysRemaining} days remaining` : 'Data unavailable'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5 shadow border border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Made Tea (Today)</p>
            <p className="text-2xl font-bold text-gray-800">{inventoryMetrics.madeTea.today.toLocaleString()} kg</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionKPIs;
