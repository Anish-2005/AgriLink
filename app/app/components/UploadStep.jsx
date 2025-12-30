import React from 'react';
import { Camera, FileText } from 'lucide-react';

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

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              role="button"
              onClick={() => setInputMethod('image')}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-shadow duration-200 ${
                inputMethod === 'image'
                  ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-emerald-800">Image</h4>
                  <p className="text-sm text-emerald-700 mt-1">Upload a photo for more accurate AI analysis</p>
                </div>
                <div className="text-emerald-600">
                  <Camera className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div
              role="button"
              onClick={() => setInputMethod('text')}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-shadow duration-200 ${
                inputMethod === 'text'
                  ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-emerald-800">Description</h4>
                  <p className="text-sm text-emerald-700 mt-1">Provide details like quantity, moisture, storage</p>
                </div>
                <div className="text-emerald-600">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          <div>
            {inputMethod === 'image' && (
              <div className="p-4 bg-white border rounded-xl">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="mb-4 w-full" />
                {preview ? (
                  <div className="mb-4">
                    <img src={preview} alt="preview" className="w-full rounded-xl border" />
                    <div className="flex justify-between mt-2">
                      <button onClick={() => { setImage(null); setPreview(null); }} className="px-4 py-2 bg-gray-100 rounded">Remove</button>
                      <button onClick={handleDescriptionSubmit} className="px-4 py-2 bg-emerald-600 text-white rounded">{isLoading ? 'Analyzing...' : 'Analyze'}</button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed rounded-xl">
                    <p className="text-emerald-700 font-semibold">No file chosen</p>
                    <p className="text-sm text-emerald-600 mt-2">Click to choose an image or drag it here</p>
                  </div>
                )}
              </div>
            )}

            {inputMethod === 'text' && (
              <div className="p-4 bg-white border rounded-xl">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full p-4 border-2 border-emerald-300 rounded-xl bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 resize-none"
                  placeholder="Describe your waste in detail"
                />
                <div className="flex justify-end mt-3">
                  <button onClick={handleDescriptionSubmit} className="px-4 py-2 bg-emerald-600 text-white rounded">{isLoading ? 'Analyzing...' : 'Analyze'}</button>
                </div>
              </div>
            )}
          </div>
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
