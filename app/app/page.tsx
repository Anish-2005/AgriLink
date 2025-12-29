'use client'
import { useState, useRef } from 'react';
import Head from 'next/head';
import { FiUpload, FiCamera, FiInfo, FiCheckCircle, FiXCircle, FiEdit2 } from 'react-icons/fi';
import { uploadWasteInfo, uploadWasteImage } from "../actions/mongodbfunctions";
import { v4 as uuidv4 } from 'uuid';
import { uploadWasteData } from '../actions/mongodbfunctions';
import Link from 'next/link';
import { useUser } from '@civic/auth/react'; // Add this import
import Navbar from '../components/Navbar';
import Image from 'next/image';
export default function AppPage() {
    const { user } = useUser(); // Get the user from Civic auth
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [classificationResult, setClassificationResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        cropType: '',
        wasteDescription: '',
        quantity: '',
        quantityUnit: 'kg',
        moistureLevel: '',
        ageOfWaste: '',
        location: '',
        intendedUse: '',
        additionalNotes: ''
    });
    const fileInputRef = useRef(null);
    const [step, setStep] = useState(1);
    const [inputMethod, setInputMethod] = useState('image');
    const [description, setDescription] = useState('');

    // Helper function to convert file to base64
    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    // Call Gemini API for waste analysis
    const analyzeWaste = async (data) => {
        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response) {
                throw new Error('No response from server');
            }

            const text = await response.text();
            if (!text) {
                throw new Error('Empty response from server');
            }

            try {
                const result = JSON.parse(text);
                if (!response.ok) {
                    throw new Error(result.error || 'Failed to analyze waste');
                }
                return result;
            } catch (parseError) {
                console.error('Failed to parse response:', parseError);
                throw new Error('Invalid server response');
            }
        } catch (error) {
            console.error('Error analyzing waste:', error);
            throw new Error(error.message || 'Failed to analyze waste. Please try again.');
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleDescriptionSubmit = async () => {
        if (!description.trim()) {
            alert("Please provide a description of the waste");
            return;
        }

        setIsLoading(true);

        try {
            let dataToSend = { analysisType: 'text', description: description };

            // If image is available, include it in the analysis
            if (image) {
                const base64Image = await convertFileToBase64(image);
                dataToSend = {
                    ...dataToSend,
                    analysisType: 'both',
                    image: base64Image
                };
            }

            // Send data to Gemini API
            const geminiResponse = await analyzeWaste(dataToSend);

            // Map Gemini response to our form structure
            const geminiData = {
                cropType: geminiResponse.cropType || '',
                wasteDescription: description, // Use the user-provided description
                moistureLevel: geminiResponse.moistureLevel || '',
                ageOfWaste: geminiResponse.ageOfWaste || '',
            };

            // Fix: If Gemini returns 0 or missing estimatedValue, set a fallback value
            let estimatedValue = geminiResponse.estimatedValue;
            if (!estimatedValue || estimatedValue === 0) {
                // Fallback: set a default price based on crop type
                const defaultPrices = {
                    Rice: 1850,
                    Wheat: 2200,
                    Sugarcane: 1500,
                };
                estimatedValue = defaultPrices[geminiResponse.cropType] || 1200;
            }

            // Update form data with Gemini's analysis
            setFormData(prev => ({
                ...prev,
                ...geminiData
            }));

            // Set classification result for display
            setClassificationResult({
                cropType: geminiResponse.cropType,
                confidence: geminiResponse.confidence,
                moistureLevel: geminiResponse.moistureLevel,
                estimatedValue // Use the fixed value
            });

            setStep(2);
        } catch (err) {
            console.error("Analysis failed:", err);
            alert(err.message || "Something went wrong while analyzing. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Convert image to base64 if it exists
            const imageBase64 = image ? await convertFileToBase64(image) : null;

            // Prepare final data for MongoDB including user ID
            await uploadWasteInfo({
                classificationResult,
                formData,
                imageBase64,
                userId: user?.id, // Add the user ID from Civic auth
                userName: user?.name || user?.email || 'Anonymous' // Add user name/email if available
            });

            setStep(3);
        } catch (err) {
            console.error("Submission failed:", err);
            alert("Something went wrong while submitting. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const resetProcess = () => {
        setImage(null);
        setPreview(null);
        setClassificationResult(null);
        setFormData({
            cropType: '',
            wasteDescription: '',
            quantity: '',
            quantityUnit: 'kg',
            moistureLevel: '',
            ageOfWaste: '',
            location: '',
            intendedUse: '',
            additionalNotes: ''
        });
        setDescription('');
        setInputMethod('image');
        setStep(1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50">
            <Head>
                <title>AgriLink | Waste Upload</title>
            </Head>

            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden -z-10">
                <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-green-200 opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-yellow-200 opacity-20 animate-blob animation-delay-4000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full bg-orange-200 opacity-20 animate-blob"></div>
            </div>

            <Navbar />

            {/* Main Content */}
            < main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden" data-aos="fade-up">
                    {/* Progress Steps */}
                    <div className="border-b border-gray-200">
                        <div className="flex justify-between px-8 py-4">
                            <div className={`flex flex-col items-center ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`} data-aos="fade-up" data-aos-delay="100">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'} transition-all duration-300`}>
                                    {step > 1 ? (
                                        <FiCheckCircle className="h-5 w-5" />
                                    ) : (
                                        <span>1</span>
                                    )}
                                </div>
                                <span className="mt-2 text-sm font-medium">Upload/Describe</span>
                            </div>
                            <div className={`flex flex-col items-center ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`} data-aos="fade-up" data-aos-delay="200">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'} transition-all duration-300`}>
                                    {step > 2 ? (
                                        <FiCheckCircle className="h-5 w-5" />
                                    ) : (
                                        <span>2</span>
                                    )}
                                </div>
                                <span className="mt-2 text-sm font-medium">Details</span>
                            </div>
                            <div className={`flex flex-col items-center ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`} data-aos="fade-up" data-aos-delay="300">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'} transition-all duration-300`}>
                                    <span>3</span>
                                </div>
                                <span className="mt-2 text-sm font-medium">Results</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 1: Image Upload or Description */}
                    {/* Step 1: Image Upload or Description */}
                    {step === 1 && (
                        <div className="p-8" data-aos="fade-up">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-800">Upload or Describe Waste</h2>
                                <p className="mt-2 text-gray-600">
                                    Upload a photo (optional) and provide a description (required) of your agricultural waste
                                </p>
                            </div>

                            <div className="mt-6 flex justify-center space-x-4">
                                <button
                                    onClick={() => setInputMethod('image')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${inputMethod === 'image' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                    Upload Image
                                </button>
                                <button
                                    onClick={() => setInputMethod('text')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${inputMethod === 'text' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    Describe Waste
                                </button>
                            </div>

                            <div className="mt-8 flex flex-col items-center">
                                {inputMethod === 'image' && (
                                    <>
                                        {preview ? (
                                            <div className="relative" data-aos="zoom-in">
                                                <Image height={64}
                                                    width={100}
                                                    src={preview}
                                                    alt="Waste preview"
                                                    className="h-64 w-full object-cover rounded-lg border-2 border-dashed border-green-300"
                                                    unoptimized
                                                />
                                                <button
                                                    onClick={() => {
                                                        setImage(null);
                                                        setPreview(null);
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                    <FiXCircle className="h-5 w-5" />
                                                </button>
                                                {isLoading && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg">
                                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div
                                                className="h-64 w-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-400 transition-colors duration-300 group"
                                                onClick={() => fileInputRef.current.click()}
                                                data-aos="fade-up"
                                                data-aos-delay="100"
                                            >
                                                <FiUpload className="h-12 w-12 text-gray-400 group-hover:text-green-500 transition-colors duration-300" />
                                                <p className="mt-2 text-gray-600">Click to upload (optional)</p>
                                                <p className="text-sm text-gray-500">JPG, PNG up to 5MB</p>
                                            </div>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            name="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className='hidden'
                                        />
                                    </>
                                )}

                                {/* Description Field (Always Visible) */}
                                <div className="w-full max-w-md mt-6" data-aos="fade-up" data-aos-delay="200">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Waste Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg bg-white text-black focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                                        placeholder="Describe your agricultural waste (e.g., type, condition, approximate quantity)..."
                                        required
                                    />
                                </div>

                                <div className="mt-6">
                                    <button
                                        onClick={handleDescriptionSubmit}
                                        className="relative group px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 disabled:opacity-50"
                                        disabled={!description.trim() || isLoading}
                                        data-aos="fade-up"
                                        data-aos-delay="300"
                                    >
                                        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                        <FiEdit2 className="mr-2 inline" />
                                        {isLoading ? 'Processing...' : 'Submit Waste Information'}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded" data-aos="fade-up" data-aos-delay="400">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <FiInfo className="h-5 w-5 text-yellow-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            For best results: Provide a detailed description of your waste.
                                            Adding a photo can help improve the accuracy of the analysis.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Waste Details Form */}
                    {step === 2 && (
                        <div className="p-8" data-aos="fade-up">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-extrabold text-gray-800">Waste Classification & Details</h2>
                                <p className="mt-2 text-gray-600 text-sm max-w-xl mx-auto">
                                    Review the AI's classification and refine the details to help us process your agricultural waste efficiently.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* AI Result Summary */}
                                <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-md transition hover:shadow-lg" data-aos="fade-right">
                                    <h3 className="text-lg font-semibold text-green-800 mb-4">AI Prediction</h3>
                                    {classificationResult && (
                                        <div className="space-y-4 text-sm text-gray-800">
                                            <div>
                                                <p className="font-medium">Crop Type:</p>
                                                <div className="flex items-center justify-between">
                                                    <span>{classificationResult.cropType}</span>
                                                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                        {classificationResult.confidence * 100}% confidence
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-medium">Moisture Level:</p>
                                                <span>{classificationResult.moistureLevel}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium">Estimated Value:</p>
                                                <span>₹{classificationResult.estimatedValue} per ton</span>
                                            </div>
                                            <div className="pt-4">
                                                <button
                                                    onClick={() => setStep(1)}
                                                    className="text-sm text-green-600 hover:underline font-medium"
                                                >
                                                    ↺ Re-upload or re-describe
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md space-y-5" data-aos="fade-left">
                                    <h3 className="text-lg font-semibold text-gray-800">Provide Details</h3>

                                    {/* Group 1 */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="cropType" className="block text-sm font-medium text-gray-700 mb-1">
                                                Type of Crop
                                            </label>
                                            <select
                                                id="cropType"
                                                name="cropType"
                                                value={formData.cropType}
                                                onChange={handleInputChange}
                                                className="form-select bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 focus:ring-green-500 focus:border-green-500"
                                                required
                                            >
                                                <option value="">Select crop type</option>
                                                <option value="Rice">Rice</option>
                                                <option value="Wheat">Wheat</option>
                                                <option value="Sugarcane">Sugarcane</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="moistureLevel" className="block text-sm font-medium text-gray-700 mb-1">
                                                Moisture Level
                                            </label>
                                            <select
                                                id="moistureLevel"
                                                name="moistureLevel"
                                                value={formData.moistureLevel}
                                                onChange={handleInputChange}
                                                className="form-select bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 focus:ring-green-500 focus:border-green-500"
                                                required
                                            >
                                                <option value="">Select moisture level</option>
                                                <option value="Low">Low (Dry)</option>
                                                <option value="Medium">Medium (Some moisture)</option>
                                                <option value="High">High (Wet)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Waste Description */}
                                    <div>
                                        <label htmlFor="wasteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                            Waste Description
                                        </label>
                                        <textarea
                                            id="wasteDescription"
                                            name="wasteDescription"
                                            rows={3}
                                            value={formData.wasteDescription}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 text-black bg-white rounded-md p-3 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Describe the waste material (e.g., straw, husk, stalks)..."
                                            required
                                        />
                                    </div>

                                    {/* Group 2 */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                id="quantity"
                                                name="quantity"
                                                min="0.1"
                                                step="0.1"
                                                value={formData.quantity}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 bg-white text-black rounded-md p-2.5 focus:ring-green-500 focus:border-green-500"
                                                placeholder="e.g. 2.5"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="quantityUnit" className="block text-sm font-medium text-gray-700 mb-1">
                                                Unit
                                            </label>
                                            <select
                                                id="quantityUnit"
                                                name="quantityUnit"
                                                value={formData.quantityUnit}
                                                onChange={handleInputChange}
                                                className="form-select bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 focus:ring-green-500 focus:border-green-500"
                                                required
                                            >
                                                <option value="kg">Kilograms (kg)</option>
                                                <option value="ton">Tons</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Age + Location */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="ageOfWaste" className="block text-sm font-medium text-gray-700 mb-1">
                                                Age of Waste
                                            </label>
                                            <select
                                                id="ageOfWaste"
                                                name="ageOfWaste"
                                                value={formData.ageOfWaste}
                                                onChange={handleInputChange}
                                                className="form-select bg-white border border-gray-300 text-gray-900 rounded-md w-full py-2 px-3 focus:ring-green-500 focus:border-green-500"
                                                required
                                            >
                                                <option value="">Select age of waste</option>
                                                <option value="Fresh">Fresh (0–1 week)</option>
                                                <option value="1-2 weeks">1–2 weeks</option>
                                                <option value="2-4 weeks">2–4 weeks</option>
                                                <option value="1-2 months">1–2 months</option>
                                                <option value="2+ months">2+ months</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                                Location (Nearest Landmark)
                                            </label>
                                            <input
                                                type="text"
                                                id="location"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 bg-white text-black rounded-md p-2.5 focus:ring-green-500 focus:border-green-500"
                                                placeholder="e.g. Near Krishi Farm, Pune Highway"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Additional Notes */}
                                    <div>
                                        <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
                                            Additional Notes
                                        </label>
                                        <textarea
                                            id="additionalNotes"
                                            name="additionalNotes"
                                            rows={2}
                                            value={formData.additionalNotes}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 text-black bg-white rounded-md p-3 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Any special instructions or details about the waste..."
                                        />
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all relative group"
                                        >
                                            {isLoading ? 'Processing...' : 'Submit Waste Listing'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}


                    {/* Step 3: Results */}
                    {step === 3 && (
                        <div className="p-8">
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                    <FiCheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <h2 className="mt-3 text-2xl font-bold text-gray-800">Waste Successfully Listed!</h2>
                                <p className="mt-2 text-gray-600">
                                    Your agricultural waste is now visible to our network of buyers.
                                </p>
                            </div>

                            <div className="mt-8 bg-green-50 rounded-lg overflow-hidden shadow">
                                <div className="px-6 py-5 border-b border-green-200 bg-green-100">
                                    <h3 className="text-lg font-medium text-green-800">Listing Summary</h3>
                                </div>
                                <div className="px-6 py-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Crop Type</p>
                                        <p className="mt-1 text-sm text-gray-900">{formData.cropType}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Waste Description</p>
                                        <p className="mt-1 text-sm text-gray-900">{formData.wasteDescription}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Quantity</p>
                                        <p className="mt-1 text-sm text-gray-900">{formData.quantity} {formData.quantityUnit}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Moisture Level</p>
                                        <p className="mt-1 text-sm text-gray-900">{formData.moistureLevel}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Age of Waste</p>
                                        <p className="mt-1 text-sm text-gray-900">{formData.ageOfWaste}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Location</p>
                                        <p className="mt-1 text-sm text-gray-900">{formData.location}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Intended Use</p>
                                        <p className="mt-1 text-sm text-gray-900">{formData.intendedUse}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Estimated Value</p>
                                        <p className="mt-1 text-sm text-gray-900">
                                            ₹{Math.round(classificationResult.estimatedValue * parseFloat(formData.quantity || 1))}
                                            <span className="text-gray-500"> (₹{classificationResult.estimatedValue}/ton)</span>
                                        </p>
                                    </div>
                                    {formData.additionalNotes && (
                                        <div className="sm:col-span-2">
                                            <p className="text-sm font-medium text-gray-500">Additional Notes</p>
                                            <p className="mt-1 text-sm text-gray-900">{formData.additionalNotes}</p>
                                        </div>
                                    )}
                                    {preview && (
                                        <div className="sm:col-span-2">
                                            <p className="text-sm font-medium text-gray-500">Uploaded Image</p>
                                            <Image
                                                src={preview}
                                                alt="Waste preview"
                                                className="mt-2 h-48 w-full object-contain rounded-lg border border-gray-200"
                                                unoptimized
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-gray-900">What Happens Next?</h3>
                                <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                                    <ul className="divide-y divide-gray-200">
                                        <li className="p-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span className="text-blue-600">1</span>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-900">Buyers Review Your Listing</p>
                                                    <p className="text-sm text-gray-500">
                                                        Our verified industrial buyers will review your waste listing and may submit offers.
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="p-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span className="text-blue-600">2</span>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-900">Receive Offers</p>
                                                    <p className="text-sm text-gray-500">
                                                        You'll receive notifications when buyers make offers. Compare prices and terms.
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="p-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span className="text-blue-600">3</span>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-900">Finalize Transaction</p>
                                                    <p className="text-sm text-gray-500">
                                                        Accept the best offer, arrange logistics, and get paid upon delivery.
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-center space-x-4">
                                <button
                                    onClick={resetProcess}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    List Another Waste
                                </button>
                                <button
                                    onClick={() => {/* Navigate to dashboard */ }}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    View Dashboard
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main >
        </div >
    );
}