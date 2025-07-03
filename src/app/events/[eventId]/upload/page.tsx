"use client"

import React, { useRef, useState } from "react";
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useParams } from 'next/navigation';

export default function UploadParticipantsPage() {
  // Use the useParams hook to get the params
  const params = useParams();
  const eventId = params.eventId as string;
  
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 p-6">
      <div className="w-full max-w-lg mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-tr from-blue-500 to-purple-500 p-4 rounded-full shadow-lg mb-4">
            <CloudArrowUpIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2 text-center drop-shadow-lg">Upload Participants</h1>
          <p className="text-lg text-blue-100 mb-1 text-center">Event ID: <span className="font-mono text-blue-200">{eventId}</span></p>
          <p className="text-sm text-purple-200 text-center">Upload your Excel file (.xlsx or .xls) with participant details.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block cursor-pointer group">
            <div className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-colors duration-200 ${file ? 'border-green-400 bg-green-50/10' : 'border-blue-400 bg-blue-50/10'} group-hover:border-purple-400 group-hover:bg-purple-50/10`}> 
              <CloudArrowUpIcon className="h-8 w-8 text-blue-400 group-hover:text-purple-400 mb-2" />
              <span className="text-white font-medium">{file ? file.name : "Click to select an Excel file"}</span>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                ref={inputRef}
                className="hidden"
                required
              />
            </div>
          </label>
          <button
            type="submit"
            disabled={uploading || !file}
            className={`w-full py-3 rounded-xl font-bold text-lg shadow-md transition-all duration-200 ${uploading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'}`}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                Uploading...
              </span>
            ) : "Upload Excel File"}
          </button>
        </form>
        {success && (
          <div className="mt-6 space-y-4">
            <div className="text-center text-green-400 font-semibold bg-green-900/30 rounded-lg py-2 px-4 shadow">
              File uploaded and processed successfully!
            </div>
            {downloadUrl && (
              <div className="text-center">
                <a 
                  href={downloadUrl}
                  download={`participants-verification-${eventId}.zip`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Download Verification Files
                </a>
                <p className="text-xs text-blue-200 mt-2">
                  If the download didn't start automatically, click the button above.
                </p>
              </div>
            )}
          </div>
        )}
        {error && <div className="mt-6 text-center text-red-400 font-semibold bg-red-900/30 rounded-lg py-2 px-4 shadow">{error}</div>}
      </div>
    </main>
  );
}