import React from 'react';

export default function ReviewStep({ formData, handleInputChange, classificationResult, isLoading, handleSubmit, preview, resetProcess }) {
  return (
    <div className="p-8 md:p-12 bg-white">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-emerald-900">Review Classified Details</h2>
        <p className="text-emerald-700 mt-2">Confirm or edit the detected data before submitting your listing.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-extrabold text-emerald-800">Crop Type</label>
                <select
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-emerald-300 rounded-xl bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                >
                  <option value="">Select crop type</option>
                  <option value="Rice">Rice</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-extrabold text-emerald-800">Quantity</label>
                <input
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-emerald-300 rounded-xl bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-extrabold text-emerald-800">Waste Description</label>
              <textarea
                name="wasteDescription"
                value={formData.wasteDescription}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-emerald-300 rounded-xl bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none"
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between mt-6">
              <button type="button" onClick={resetProcess} className="px-4 py-2 bg-white border-2 border-emerald-300 text-emerald-800 rounded-lg">Start Over</button>
              <button type="submit" className={`px-6 py-2 bg-emerald-600 text-white rounded-xl shadow`}>
                {isLoading ? 'Submitting...' : 'Submit Listing'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-4 shadow-sm">
          {preview ? (
            <img src={preview} alt="preview" className="w-full rounded-xl border" />
          ) : (
            <div className="h-40 w-full bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 font-semibold">No Preview</div>
          )}
          <div className="mt-3 text-sm text-emerald-900 font-semibold">Confidence: {classificationResult?.confidence ?? 'N/A'}</div>
          <div className="text-sm text-emerald-900 font-semibold">Estimated Value: ₹{classificationResult?.estimatedValue ?? 'N/A'}</div>
        </div>
      </div>
    </div>
  );
}
