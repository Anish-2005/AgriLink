import React from 'react';

export default function UploadStep({
  fileInputRef,
  handleImageUpload,
  preview,
  inputMethod,
  setInputMethod,
  description,
  setDescription,
  handleDescriptionSubmit,
  setImage,
  setPreview,
  setStep,
  isLoading
}) {
  return (
    <div className="p-8 md:p-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-emerald-800 drop-shadow-lg mb-4">Upload or Describe Your Waste</h2>
        <p className="text-lg text-emerald-900 drop-shadow-md font-semibold max-w-2xl mx-auto">Provide a photo (optional) and detailed description of your agricultural waste for AI analysis</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <button onClick={() => setInputMethod('image')} className={`px-4 py-2 rounded-xl font-bold ${inputMethod === 'image' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>Image</button>
            <button onClick={() => setInputMethod('text')} className={`px-4 py-2 rounded-xl font-bold ${inputMethod === 'text' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>Description</button>
          </div>

          {inputMethod === 'image' && (
            <div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
              {preview && (
                <div className="mb-4">
                  <img src={preview} alt="preview" className="w-full rounded-xl border" />
                  <div className="flex justify-between mt-2">
                    <button onClick={() => { setImage(null); setPreview(null); }} className="px-4 py-2 bg-gray-100 rounded">Remove</button>
                    <button onClick={handleDescriptionSubmit} className={`px-4 py-2 bg-emerald-600 text-white rounded`}>{isLoading ? 'Analyzing...' : 'Analyze'}</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {inputMethod === 'text' && (
            <div>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="w-full p-3 border rounded-lg" placeholder="Describe your waste in detail" />
              <div className="flex justify-end mt-3">
                <button onClick={handleDescriptionSubmit} className={`px-4 py-2 bg-emerald-600 text-white rounded`}>{isLoading ? 'Analyzing...' : 'Analyze'}</button>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="bg-gradient-to-br from-emerald-50 to-white border rounded-2xl p-6">
            <h3 className="font-extrabold text-emerald-800 mb-2">Tips for Accurate Analysis</h3>
            <ul className="text-emerald-700 list-disc pl-6">
              <li>Clear, well-lit photos</li>
              <li>Include quantity and moisture details</li>
              <li>Mention intended use or storage condition</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
