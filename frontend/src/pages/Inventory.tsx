import { useState, lazy, Suspense } from "react";
import { InventoryTabs } from "../utils/enums";
import Loading from "../components/Loading";

// Static component map - bundler can analyze this
const inventoryComponents = {
  [InventoryTabs.FIREWOOD]: lazy(
    () => import("../components/InventoryComponents/Firewood")
  ),
  [InventoryTabs.PACKINGMATERIALS]: lazy(
    () => import("../components/InventoryComponents/PackingMaterials")
  ),
  [InventoryTabs.MADETEA]: lazy(
    () => import("../components/InventoryComponents/Madetea")
  ),
  [InventoryTabs.GREENLEAF]: lazy(
    () => import("../components/InventoryComponents/GreenLeaf")
  ),
};

const Inventory = () => {
  const [selectTab, setSelectTab] = useState<InventoryTabs>(
    InventoryTabs.FIREWOOD
  );

  const SelectedComponent = inventoryComponents[selectTab];

  return (
    <div>
      <div className="flex justify-between items-baseline">
        
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-2 text-gray-600">
            Keep track of your stock levels and manage inventory efficiently!
          </p>
        </div>
        
        <select
          name="inventory"
          id="inventory-select"
          className="mt-4 p-2 border border-green-300 rounded"
          value={selectTab}
          onChange={(e) => setSelectTab(e.target.value as InventoryTabs)}
        >
          <option value={InventoryTabs.FIREWOOD}>Firewood</option>
          <option value={InventoryTabs.PACKINGMATERIALS}>
            Packing Materials
          </option>
          <option value={InventoryTabs.MADETEA}>Made Tea</option>
          <option value={InventoryTabs.GREENLEAF}>Green Leaf</option>
        </select>
      </div>

      <div className="mt-8">
        <Suspense fallback={<Loading />}>
          <SelectedComponent />
        </Suspense>
      </div>
    </div>
  );
};

export default Inventory;
