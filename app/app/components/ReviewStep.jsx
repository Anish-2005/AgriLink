import React from 'react';

export default function ReviewStep({ formData, handleInputChange, classificationResult, isLoading, handleSubmit, preview, resetProcess }) {
  return (
    <div className="p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-emerald-800">Review Classified Details</h2>
        <p className="text-emerald-700 mt-2">Confirm or edit the detected data before submitting your listing.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold">Crop Type</label>
                <input name="cropType" value={formData.cropType} onChange={handleInputChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="text-sm font-bold">Quantity</label>
                <input name="quantity" value={formData.quantity} onChange={handleInputChange} className="w-full p-2 border rounded" />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-bold">Waste Description</label>
              <textarea name="wasteDescription" value={formData.wasteDescription} onChange={handleInputChange} className="w-full p-2 border rounded" rows={4} />
            </div>

            <div className="flex items-center justify-between mt-6">
              <button type="button" onClick={resetProcess} className="px-4 py-2 bg-gray-100 rounded">Start Over</button>
              <button type="submit" className={`px-6 py-2 bg-emerald-600 text-white rounded`}>{isLoading ? 'Submitting...' : 'Submit Listing'}</button>
            </div>
          </form>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-white border rounded-2xl p-4">
          {preview ? <img src={preview} alt="preview" className="w-full rounded" /> : <div className="h-40 w-full bg-gray-100 rounded" />}
          <div className="mt-3 text-sm text-emerald-700">Confidence: {classificationResult?.confidence || 'N/A'}</div>
          <div className="text-sm text-emerald-700">Estimated Value: ₹{classificationResult?.estimatedValue || 'N/A'}</div>
        </div>
      </div>
    </div>
  );
}
