import { useState } from 'react';

interface IntakeFormProps {
  onSubmit?: (data: {
    supplier: string;
    supplierType: string;
    vehicleNumber?: string;
    grossWeight: number;
    tareWeight: number;
    quality?: string;
    session: string;
    remarks?: string;
  }) => Promise<{ success: boolean; error?: unknown }>;
}

const IntakeForm = ({ onSubmit }: IntakeFormProps) => {
  const [supplier, setSupplier] = useState('');
  const [supplierType, setSupplierType] = useState<'estate' | 'smallholder'>('estate');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [grossWeight, setGrossWeight] = useState('');
  const [tareWeight, setTareWeight] = useState('');
  const [quality, setQuality] = useState('');
  const [session, setSession] = useState<'AM' | 'PM'>('AM');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const netWeight = (parseFloat(grossWeight) || 0) - (parseFloat(tareWeight) || 0);

  const handleSubmit = async () => {
    setError('');

    const gross = parseFloat(grossWeight);
    const tare = parseFloat(tareWeight);

    // Validations
    if (!supplier.trim()) {
      setError('Please enter supplier name');
      return;
    }
    if (!vehicleNumber.trim()) {
      setError('Please enter vehicle number');
      return;
    }
    if (!grossWeight || isNaN(gross) || gross <= 0) {
      setError('Please enter a valid gross weight greater than 0');
      return;
    }
    if (!tareWeight || isNaN(tare) || tare < 0) {
      setError('Please enter a valid tare weight');
      return;
    }
    if (tare >= gross) {
      setError('Tare weight cannot be greater than or equal to gross weight');
      return;
    }
    if (!quality.trim()) {
      setError('Please select leaf quality');
      return;
    }

    const intakeData = {
      supplier,
      supplierType: supplierType.toUpperCase(),
      vehicleNumber,
      grossWeight: gross,
      tareWeight: tare,
      netWeight: netWeight,
      quality,
      session,
      remarks: remarks || undefined,
    };

    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(intakeData);
        // Success - clear form
        setSupplier('');
        setVehicleNumber('');
        setGrossWeight('');
        setTareWeight('');
        setQuality('');
        setRemarks('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to record intake');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('Intake submitted:', intakeData);
      // Success - clear form
      setSupplier('');
      setVehicleNumber('');
      setGrossWeight('');
      setTareWeight('');
      setQuality('');
      setRemarks('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Add Green Leaf Intake</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-md px-3 py-1.5 text-sm text-blue-700">
          <span className="font-medium">ℹ️ Note:</span> Green leaf consumption is automatically calculated from production records
        </div>
      </div>

      <div className="space-y-4">
        {/* Supplier Info */}
        <div className="grid grid-cols-3 gap-4">
          <label className="block col-span-2">
            <span className="text-sm font-medium text-gray-700 mb-1.5 block">
              Supplier Name <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              placeholder="Enter estate or smallholder name"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1.5 block">
              Supplier Type <span className="text-red-500">*</span>
            </span>
            <select
              value={supplierType}
              onChange={(e) => setSupplierType(e.target.value as 'estate' | 'smallholder')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors bg-white"
            >
              <option value="estate">Estate</option>
              <option value="smallholder">Smallholder</option>
            </select>
          </label>
        </div>

        {/* Vehicle and Session */}
        <div className="grid grid-cols-3 gap-4">
          <label className="block col-span-2">
            <span className="text-sm font-medium text-gray-700 mb-1.5 block">
              Vehicle Number <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors font-mono"
              placeholder="ABC-1234"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1.5 block">
              Session <span className="text-red-500">*</span>
            </span>
            <select
              value={session}
              onChange={(e) => setSession(e.target.value as 'AM' | 'PM')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors bg-white"
            >
              <option value="AM">AM (Morning)</option>
              <option value="PM">PM (Afternoon)</option>
            </select>
          </label>
        </div>

        {/* Weights */}
        <div className="grid grid-cols-4 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1.5 block">
              Gross Weight (kg) <span className="text-red-500">*</span>
            </span>
            <input
              type="number"
              value={grossWeight}
              onChange={(e) => setGrossWeight(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              placeholder="0"
              min="0"
              step="0.1"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1.5 block">
              Tare Weight (kg) <span className="text-red-500">*</span>
            </span>
            <input
              type="number"
              value={tareWeight}
              onChange={(e) => setTareWeight(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              placeholder="0"
              min="0"
              step="0.1"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1.5 block">Net Weight (kg)</span>
            <div className="w-full px-4 py-2.5 border border-gray-200 rounded-md bg-gray-50 text-gray-800 font-semibold">
              {netWeight > 0 ? netWeight.toFixed(1) : '0.0'}
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1.5 block">
              Quality Grade <span className="text-red-500">*</span>
            </span>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors bg-white"
            >
              <option value="">Select Grade</option>
              <option value="Grade A">Grade A</option>
              <option value="Grade B">Grade B</option>
              <option value="Grade C">Grade C</option>
            </select>
          </label>
        </div>

        {/* Remarks */}
        <label className="block">
          <span className="text-sm font-medium text-gray-700 mb-1.5 block">Remarks</span>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
            placeholder="Optional notes about quality, moisture, etc."
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
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2.5 px-6 rounded-md transition-colors duration-200 shadow-sm"
        >
          {isSubmitting ? 'Recording...' : 'Record Intake'}
        </button>
      </div>
    </div>
  );
};

export default IntakeForm;
