import { useState } from 'react';

interface ProductionEntryProps {
  onSubmit?: (data: {
    batchNumber: string;
    greenLeafUsed: number;
    grades: Record<string, number>;
    totalOutput: number;
    yieldPercentage: number;
  }) => Promise<void>;
}

const ProductionEntry = ({ onSubmit }: ProductionEntryProps) => {
  const [batchNumber, setBatchNumber] = useState('');
  const [greenLeafUsed, setGreenLeafUsed] = useState('');
  const [grades, setGrades] = useState({
    OP1: '',
    OPA: '',
    BOP1: '',
    PEK: '',
    PEK1: '',
    FBOP: '',
    FBOPF1: '',
    BOPA: '',
    BOPFSP: '',
    BOPFEXSP: '',
    BM: '',
    BP: '',
    BOP1A: '',
    BT: '',
    DUST1: '',
    DUST: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalOutput = Object.values(grades).reduce(
    (sum, val) => sum + (parseFloat(val) || 0),
    0
  );
  const yieldPercentage =
    greenLeafUsed && parseFloat(greenLeafUsed) > 0
      ? (totalOutput / parseFloat(greenLeafUsed)) * 100
      : 0;

  const handleGradeChange = (grade: string, value: string) => {
    setGrades({ ...grades, [grade]: value });
  };

  const handleSubmit = async () => {
    setError('');

    const leafUsed = parseFloat(greenLeafUsed);

    // Validations
    if (!batchNumber.trim()) {
      setError('Please enter batch number');
      return;
    }
    if (!greenLeafUsed || isNaN(leafUsed) || leafUsed <= 0) {
      setError('Please enter valid green leaf quantity');
      return;
    }
    if (totalOutput <= 0) {
      setError('Please enter at least one grade quantity');
      return;
    }

    const productionData = {
      batchNumber,
      greenLeafUsed: leafUsed,
      grades: Object.fromEntries(
        Object.entries(grades).map(([k, v]) => [k, parseFloat(v) || 0])
      ),
      totalOutput,
      yieldPercentage,
    };

    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(productionData);
        // Success - clear form
        setBatchNumber('');
        setGreenLeafUsed('');
        setGrades({ OP1: '', OPA: '', BOP1: '', PEK: '', PEK1: '', FBOP: '', FBOPF1: '', BOPA: '', BOPFSP: '', BOPFEXSP: '', BM: '', BP: '', BOP1A: '', BT: '', DUST1: '', DUST: '' });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to record production');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('Production submitted:', productionData);
      setBatchNumber('');
      setGreenLeafUsed('');
        setGrades({ OP1: '', OPA: '', BOP1: '', PEK: '', PEK1: '', FBOP: '', FBOPF1: '', BOPA: '', BOPFSP: '', BOPFEXSP: '', BM: '', BP: '', BOP1A: '', BT: '', DUST1: '', DUST: '' });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Production Entry</h3>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Production Date:</span>{' '}
          <span className="text-gray-800">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Batch Info */}
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1.5 block">
              Batch Number <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors font-mono"
              placeholder="BATCH-231223-001"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1.5 block">
              Green Leaf Used (kg) <span className="text-red-500">*</span>
            </span>
            <input
              type="number"
              value={greenLeafUsed}
              onChange={(e) => setGreenLeafUsed(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              placeholder="0"
              min="0"
              step="0.1"
            />
          </label>
        </div>

        {/* Grade-wise Output */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">
            Grade-wise Output (kg) <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {Object.keys(grades).map((grade) => (
              <label key={grade} className="block">
                <span className="text-xs font-medium text-gray-600 mb-1 block">{grade}</span>
                <input
                  type="number"
                  value={grades[grade as keyof typeof grades]}
                  onChange={(e) => handleGradeChange(grade, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-sm"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Calculated Values */}
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div>
            <div className="text-sm text-gray-600 mb-1">Total Made Tea Output</div>
            <div className="text-2xl font-bold text-green-700">{totalOutput.toFixed(1)} kg</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Yield Percentage</div>
            <div className={`text-2xl font-bold ${
              yieldPercentage >= 22 ? 'text-green-700' : yieldPercentage >= 20 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {yieldPercentage.toFixed(1)}%
            </div>
          </div>
        </div>

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
          {isSubmitting ? 'Recording...' : 'Record Production'}
        </button>
      </div>
    </div>
  );
};

export default ProductionEntry;
