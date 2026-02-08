import { useState } from 'react';

interface DispatchFormProps {
  gradeStocks: {
    grade: string;
    quantity: number;
  }[];
  onSubmit?: (data: {
    grade: string;
    quantity: number;
    buyer: string;
    invoiceNumber: string;
    packingType: string;
    remarks?: string;
  }) => Promise<void>;
}

const DispatchForm = ({ gradeStocks, onSubmit }: DispatchFormProps) => {
  const [grade, setGrade] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyer, setBuyer] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [packingType, setPackingType] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableStock = gradeStocks.find((g) => g.grade === grade)?.quantity || 0;

  const handleSubmit = async () => {
    setError('');

    const qty = parseFloat(quantity);

    // Validations
    if (!grade) {
      setError('Please select tea grade');
      return;
    }
    if (!quantity || isNaN(qty) || qty <= 0) {
      setError('Please enter valid quantity');
      return;
    }
    if (qty > availableStock) {
      setError(`Insufficient stock! Only ${availableStock} kg available for ${grade}`);
      return;
    }
    if (!buyer.trim()) {
      setError('Please enter buyer/broker/auction lot');
      return;
    }
    if (!invoiceNumber.trim()) {
      setError('Please enter invoice/lot number');
      return;
    }
    if (!packingType) {
      setError('Please select packing type');
      return;
    }

    const dispatchData = {
      grade,
      quantity: qty,
      buyer,
      invoiceNumber,
      packingType,
      remarks: remarks || undefined,
    };

    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(dispatchData);
        // Success - clear form
        setGrade('');
        setQuantity('');
        setBuyer('');
        setInvoiceNumber('');
        setPackingType('');
        setRemarks('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to record dispatch');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('Dispatch submitted:', dispatchData);
      setGrade('');
      setQuantity('');
      setBuyer('');
      setInvoiceNumber('');
      setPackingType('');
      setRemarks('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Dispatch / Outflow Entry</h3>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Dispatch Date:</span>{' '}
          <span className="text-gray-800">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Grade and Quantity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1.5 block">
              Tea Grade <span className="text-red-500">*</span>
            </span>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
            >
              <option value="">Select Grade</option>
              {gradeStocks.map((g) => (
                <option key={g.grade} value={g.grade}>
                  {g.grade} ({g.quantity} kg available)
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1.5 block">
              Quantity (kg) <span className="text-red-500">*</span>
            </span>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="0"
              min="0"
              step="0.1"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1.5 block">
              Packing Type <span className="text-red-500">*</span>
            </span>
            <select
              value={packingType}
              onChange={(e) => setPackingType(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
            >
              <option value="">Select Type</option>
              <option value="Bulk">Bulk (Sacks)</option>
              <option value="Cartons">Cartons</option>
              <option value="Tea Chests">Tea Chests</option>
              <option value="Mixed">Mixed</option>
            </select>
          </label>
        </div>

        {/* Available Stock Info */}
        {grade && (
          <div className="bg-blue-50 border border-blue-200 rounded-md px-3 py-2 text-sm text-blue-700">
            Available Stock for <span className="font-semibold">{grade}</span>:{' '}
            <span className="font-bold">{availableStock} kg</span>
          </div>
        )}

        {/* Buyer and Invoice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1.5 block">
              Buyer / Broker / Auction Lot <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={buyer}
              onChange={(e) => setBuyer(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Enter buyer or auction information"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1.5 block">
              Invoice / Lot Number <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-mono"
              placeholder="INV-2023-001"
            />
          </label>
        </div>

        {/* Remarks */}
        <label className="block">
          <span className="text-sm font-medium text-gray-700 mb-1.5 block">Remarks</span>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="Optional dispatch notes"
          />
        </label>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-6 rounded-md transition-colors duration-200 shadow-sm"
        >
          {isSubmitting ? 'Recording...' : 'Record Dispatch'}
        </button>
      </div>
    </div>
  );
};

export default DispatchForm;
