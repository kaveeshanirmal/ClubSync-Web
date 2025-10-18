'use client';

import React, { useState, useRef } from 'react';
import Certificate from '@/components/Certificate';
import { generateAndDownloadCertificate } from '@/utils/generateCertificate';

export default function CertificatePreview() {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [certificateData, setCertificateData] = useState({
    userName: 'John Doe',
    eventName: 'Annual Tech Conference 2025',
    clubName: 'Computer Science Club',
    eventDate: 'January 15, 2025',
    certificateId: 'CERT-2025-001234',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setCertificateData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDownload = async (format: 'pdf' | 'png' | 'jpeg') => {
    if (!certificateRef.current) {
      alert('Certificate reference not found');
      return;
    }

    setIsGenerating(true);
    try {
      const fileName = `certificate-${certificateData.certificateId || 'preview'}`;
      await generateAndDownloadCertificate(
        certificateRef.current,
        fileName,
        format
      );
      alert(`Certificate downloaded successfully as ${format.toUpperCase()}!`);
    } catch (error) {
      console.error('Download error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to generate certificate: ${errorMessage}\n\nCheck browser console for details.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            Certificate Preview
          </h1>
          <p className="text-neutral-600">
            Preview and customize your certificate design
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-neutral-800">
            Certificate Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                User Name
              </label>
              <input
                type="text"
                value={certificateData.userName}
                onChange={(e) => handleInputChange('userName', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Event Name
              </label>
              <input
                type="text"
                value={certificateData.eventName}
                onChange={(e) => handleInputChange('eventName', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Club Name
              </label>
              <input
                type="text"
                value={certificateData.clubName}
                onChange={(e) => handleInputChange('clubName', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Event Date
              </label>
              <input
                type="text"
                value={certificateData.eventDate}
                onChange={(e) => handleInputChange('eventDate', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Certificate ID
              </label>
              <input
                type="text"
                value={certificateData.certificateId}
                onChange={(e) =>
                  handleInputChange('certificateId', e.target.value)
                }
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Download Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-neutral-800">
            Download Certificate
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleDownload('pdf')}
              disabled={isGenerating}
              className="px-6 py-3 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </button>
            <button
              onClick={() => handleDownload('png')}
              disabled={isGenerating}
              className="px-6 py-3 bg-neutral-700 text-white rounded-md hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isGenerating ? 'Generating...' : 'Download PNG'}
            </button>
            <button
              onClick={() => handleDownload('jpeg')}
              disabled={isGenerating}
              className="px-6 py-3 bg-neutral-700 text-white rounded-md hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isGenerating ? 'Generating...' : 'Download JPEG'}
            </button>
          </div>
          <p className="text-sm text-neutral-600 mt-4">
            Click any button to download the certificate in your preferred format.
          </p>
        </div>

        {/* Certificate Preview */}
        <div className="bg-neutral-100 rounded-lg shadow-2xl p-8 flex justify-center overflow-x-auto">
          <div className="transform scale-75 origin-top">
            <Certificate
              userName={certificateData.userName}
              eventName={certificateData.eventName}
              clubName={certificateData.clubName}
              eventDate={certificateData.eventDate}
              certificateId={certificateData.certificateId}
            />
          </div>
        </div>

        {/* Hidden full-size certificate for generation */}
        <div style={{
          position: 'fixed',
          left: '-9999px',
          top: '-9999px',
          background: 'transparent',
        }}>
          <Certificate
            ref={certificateRef}
            userName={certificateData.userName}
            eventName={certificateData.eventName}
            clubName={certificateData.clubName}
            eventDate={certificateData.eventDate}
            certificateId={certificateData.certificateId}
          />
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            📝 Next Steps
          </h3>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li>
              Customize the certificate details above to see how it looks
            </li>
            <li>
              The certificate is designed at 1200x850px for optimal quality
            </li>
            <li>
              Next, we&apos;ll implement certificate generation and storage with
              Cloudinary
            </li>
            <li>Then we&apos;ll add email functionality to send certificates</li>
            <li>Finally, we&apos;ll create a certificate wallet for users</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
