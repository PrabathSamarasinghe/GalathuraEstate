import { useState } from 'react';
import toast from 'react-hot-toast';

interface TransactionFormProps {
  itemName: string;
  currentStock: number;
  onSubmit?: (input: {
    type: string;
    quantity: number;
    factory?: string;
    supervisor?: string;
    remarks?: string;
    price?: number;
  }) => Promise<{ success: boolean; error?: unknown }>;
}

const TransactionForm = ({ itemName, currentStock, onSubmit }: TransactionFormProps) => {
  // Inflow state
  const [inflowQuantity, setInflowQuantity] = useState('');
  const [inflowPrice, setInflowPrice] = useState('');
  const [inflowRemarks, setInflowRemarks] = useState('');
  const [inflowLoading, setInflowLoading] = useState(false);

  // Outflow state
  const [outflowQuantity, setOutflowQuantity] = useState('');
  const [outflowFactory, setOutflowFactory] = useState('');
  const [outflowSupervisor, setOutflowSupervisor] = useState('');
  const [outflowRemarks, setOutflowRemarks] = useState('');
  const [outflowLoading, setOutflowLoading] = useState(false);

  // Error states
  const [inflowError, setInflowError] = useState('');
  const [outflowError, setOutflowError] = useState('');

  const handleInflowSubmit = async () => {
    setInflowError('');
    
    const quantity = parseFloat(inflowQuantity);
    const price = parseFloat(inflowPrice);

    // Validations
    if (!inflowQuantity || isNaN(quantity) || quantity <= 0) {
      setInflowError('Please enter a valid quantity greater than 0');
      return;
    }
    if (!inflowPrice || isNaN(price) || price <= 0) {
      setInflowError('Please enter a valid price greater than 0');
      return;
    }

    if (onSubmit) {
      setInflowLoading(true);
      const result = await onSubmit({
        type: 'Inflow',
        quantity,
        price,
        remarks: inflowRemarks || undefined,
      });
      setInflowLoading(false);

      if (result.success) {
        setInflowQuantity('');
        setInflowPrice('');
        setInflowRemarks('');
        toast.success('Inflow transaction added successfully!');
      } else {
        setInflowError('Failed to add inflow transaction. Please try again.');
      }
    }
  };

  const handleOutflowSubmit = async () => {
    setOutflowError('');
    
    const quantity = parseFloat(outflowQuantity);

    // Validations
    if (!outflowQuantity || isNaN(quantity) || quantity <= 0) {
      setOutflowError('Please enter a valid quantity greater than 0');
      return;
    }
    if (quantity > currentStock) {
      setOutflowError(`Insufficient stock! Current stock: ${currentStock} kg`);
      return;
    }
    if (!outflowFactory.trim()) {
      setOutflowError('Please select or enter a factory name');
      return;
    }
    if (!outflowSupervisor.trim()) {
      setOutflowError('Please enter the supervisor name');
      return;
    }

    if (onSubmit) {
      setOutflowLoading(true);
      const result = await onSubmit({
        type: 'Outflow',
        quantity,
        factory: outflowFactory,
        supervisor: outflowSupervisor,
        remarks: outflowRemarks || undefined,
      });
      setOutflowLoading(false);

      if (result.success) {
        setOutflowQuantity('');
        setOutflowFactory('');
        setOutflowSupervisor('');
        setOutflowRemarks('');
        toast.success('Outflow transaction added successfully!');
      } else {
        setOutflowError('Failed to add outflow transaction. Please try again.');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Add {itemName} Transaction
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inflow Section */}
        <div className="border-r border-gray-200 pr-6">
          <h4 className="text-md font-semibold text-green-700 mb-4">Inflow (Purchase/Received)</h4>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label htmlFor="inflow-quantity" className="block">
              <span className="text-sm font-medium text-gray-700 mb-1.5 block">
                Quantity (kg) <span className="text-red-500">*</span>
              </span>
              <input
                type="number"
                id="inflow-quantity"
                value={inflowQuantity}
                onChange={(e) => setInflowQuantity(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                placeholder="0"
                min="0"
                step="0.1"
              />
            </label>

            <label htmlFor="inflow-price" className="block">
              <span className="text-sm font-medium text-gray-700 mb-1.5 block">
                Price per kg (Rs.) <span className="text-red-500">*</span>
              </span>
              <input
                type="number"
                id="inflow-price"
                value={inflowPrice}
                onChange={(e) => setInflowPrice(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </label>
          </div>

          <label htmlFor="inflow-remarks" className="block">
            <span className="text-sm font-medium text-gray-700 mb-1.5 block">Remarks</span>
            <input
              type="text"
              id="inflow-remarks"
              value={inflowRemarks}
              onChange={(e) => setInflowRemarks(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              placeholder="Optional notes..."
            />
          </label>

          {inflowError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {inflowError}
            </div>
          )}

          <button
            type="button"
            onClick={handleInflowSubmit}
            disabled={inflowLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-md transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {inflowLoading ? 'Adding...' : 'Add Inflow'}
          </button>
        </div>
        </div>

        {/* Outflow Section */}
        <div className="pl-6">
          <h4 className="text-md font-semibold text-red-700 mb-4">Outflow (Used/Consumed)</h4>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label htmlFor="outflow-quantity" className="block">
              <span className="text-sm font-medium text-gray-700 mb-1.5 block">
                Quantity (kg) <span className="text-red-500">*</span>
              </span>
              <input
                type="number"
                id="outflow-quantity"
                value={outflowQuantity}
                onChange={(e) => setOutflowQuantity(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                placeholder="0"
                min="0"
                step="0.1"
              />
            </label>

            <label htmlFor="outflow-factory" className="block">
              <span className="text-sm font-medium text-gray-700 mb-1.5 block">
                Factory <span className="text-red-500">*</span>
              </span>
              <select
                id="outflow-factory"
                value={outflowFactory}
                onChange={(e) => setOutflowFactory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors bg-white"
              >
                <option value="">Select Factory</option>
                <option value="Factory A">Factory A</option>
                <option value="Factory B">Factory B</option>
                <option value="Factory C">Factory C</option>
              </select>
            </label>
          </div>

          <label htmlFor="outflow-supervisor" className="block">
            <span className="text-sm font-medium text-gray-700 mb-1.5 block">
              Supervisor Name <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              id="outflow-supervisor"
              value={outflowSupervisor}
              onChange={(e) => setOutflowSupervisor(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
              placeholder="Enter supervisor name"
            />
          </label>

          <label htmlFor="outflow-remarks" className="block">
            <span className="text-sm font-medium text-gray-700 mb-1.5 block">Remarks</span>
            <input
              type="text"
              id="outflow-remarks"
              value={outflowRemarks}
              onChange={(e) => setOutflowRemarks(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
              placeholder="Optional notes..."
            />
          </label>

          {outflowError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {outflowError}
            </div>
          )}

          <button
            type="button"
            onClick={handleOutflowSubmit}
            disabled={outflowLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-md transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {outflowLoading ? 'Adding...' : 'Add Outflow'}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
