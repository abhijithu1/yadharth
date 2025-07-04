"use client"

import React, { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export default function UploadParticipantsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;
  
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [eventName, setEventName] = useState("Your Event");
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch event name
  useEffect(() => {
    async function fetchEventDetails() {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (res.ok) {
          const eventData = await res.json();
          setEventName(eventData.event_name || "Your Event");
        }
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      }
    }
    
    fetchEventDetails();
  }, [eventId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setSuccess(false);
      setError(null);
      setDownloadUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setSuccess(false);
    setError(null);
    setDownloadUrl(null);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("eventId", eventId);
      
      const res = await fetch("/api/upload-participants", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Upload failed");
      }
      
      // Handle the ZIP file download
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      // Automatically trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `participants-verification-${eventId}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setSuccess(true);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Create a simple CSV template
    const headers = "Name,Email,Phone\n";
    const sampleRow = "John Doe,john@example.com,1234567890\n";
    const csvContent = headers + sampleRow;
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `${eventName.replace(/\s+/g, '-').toLowerCase()}-template.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white py-12 px-4"
    >
      <motion.div 
        className="max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center mb-2">
          <button 
            onClick={() => router.back()} 
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-black">Upload Participants</h1>
        </motion.div>

        <motion.p variants={itemVariants} className="text-gray-600 mb-6 ml-11">
          Add participants to your event by uploading an Excel file
        </motion.p>

        {/* Step 1: Template Info (highlighted) */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-5 flex items-start gap-4 shadow-sm">
            <div className="pt-1">
              <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-yellow-800 uppercase tracking-wide text-sm">Step 1:</span>
                <span className="font-semibold text-yellow-900">Review Template</span>
              </div>
              <p className="text-gray-800 mb-2">
                Make sure your Excel file follows the required format before uploading. This helps us process your participants correctly!
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                <button 
                  onClick={() => setShowTemplateModal(true)}
                  className="text-yellow-900 font-semibold underline underline-offset-2 hover:text-yellow-700 transition-colors"
                >
                  View template
                </button>
                <button
                  onClick={handleDownloadTemplate}
                  className="text-yellow-900 font-semibold underline underline-offset-2 flex items-center hover:text-yellow-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download template
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step 2: Upload Form */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-black">{eventName}</h2>
              <p className="text-gray-600 text-sm mt-1">
                ID: <span className="font-mono font-medium">{eventId}</span>
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                Excel Upload
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.label 
              className="block cursor-pointer"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className={`
                flex flex-col items-center justify-center 
                border-2 border-dashed rounded-xl p-8
                transition-colors duration-200
                ${file ? 'border-black bg-gray-50' : 'border-gray-300'}
                hover:border-black hover:bg-gray-50
              `}> 
                <svg className="h-10 w-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-black font-medium mb-1">{file ? file.name : "Select an Excel file"}</span>
                <span className="text-sm text-gray-500">{file ? "Click to change file" : ".xlsx, .xls or .csv format"}</span>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  ref={inputRef}
                  className="hidden"
                  required
                />
              </div>
            </motion.label>
            
            <motion.button
              type="submit"
              disabled={uploading || !file}
              whileHover={!uploading && file ? { scale: 1.02 } : {}}
              whileTap={!uploading && file ? { scale: 0.98 } : {}}
              className={`w-full py-3 rounded-lg font-medium text-lg transition-all duration-200 ${
                uploading || !file
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Upload File"}
            </motion.button>
          </form>
        </motion.div>

        {success && (
          <motion.div 
            variants={itemVariants}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6"
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black">Upload Successful</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Your file has been processed successfully. The verification files are ready for download.
            </p>
            
            {downloadUrl && (
              <motion.div 
                className="flex justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <a 
                  href={downloadUrl}
                  download={`participants-verification-${eventId}.zip`}
                  className="inline-flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Verification Files
                </a>
              </motion.div>
            )}
            
            <p className="text-xs text-gray-500 text-center mt-3">
              If the download didn't start automatically, click the button above.
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div 
            variants={itemVariants}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-red-200 p-6 mb-6"
          >
            <div className="flex items-center mb-3">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black">Upload Failed</h3>
            </div>
            <p className="text-gray-700">{error}</p>
          </motion.div>
        )}
      </motion.div>

      {/* Template Modal */}
      <AnimatePresence>
        {showTemplateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowTemplateModal(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-black">Excel Template Format</h3>
                <button 
                  onClick={() => setShowTemplateModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Your Excel file must contain the following columns for {eventName}:
                </p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          Column Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          Required
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-black border-r">
                          Name
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 border-r">
                          Full name of the participant
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <span className="text-green-600 font-medium">Yes</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-black border-r">
                          Email
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 border-r">
                          Email address of the participant
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <span className="text-green-600 font-medium">Yes</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-black border-r">
                          Phone
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 border-r">
                          Phone number of the participant
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <span className="text-yellow-600 font-medium">Optional</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-black mb-2">Example:</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-2 text-left text-xs font-medium text-gray-600 border-r">
                            Name
                          </th>
                          <th className="px-6 py-2 text-left text-xs font-medium text-gray-600 border-r">
                            Email
                          </th>
                          <th className="px-6 py-2 text-left text-xs font-medium text-gray-600">
                            Phone
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr>
                          <td className="px-6 py-2 text-sm text-gray-700 border-r">
                            John Doe
                          </td>
                          <td className="px-6 py-2 text-sm text-gray-700 border-r">
                            john@example.com
                          </td>
                          <td className="px-6 py-2 text-sm text-gray-700">
                            9876543210
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-2 text-sm text-gray-700 border-r">
                            Jane Smith
                          </td>
                          <td className="px-6 py-2 text-sm text-gray-700 border-r">
                            jane@example.com
                          </td>
                          <td className="px-6 py-2 text-sm text-gray-700">
                            8765432109
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm text-gray-500">
                  Save your file as .xlsx, .xls, or .csv format
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowTemplateModal(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleDownloadTemplate}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Template
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}