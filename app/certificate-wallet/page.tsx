'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Certificate {
  id: string;
  certificateId: string;
  certificateUrl: string;
  userName: string;
  eventName: string;
  clubName: string;
  eventDate: string;
  issuedAt: string;
  event: {
    id: string;
    title: string;
    club: {
      name: string;
    };
  };
}

export default function CertificateWalletPage() {
  const { status } = useSession();
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchCertificates();
    }
  }, [status, router]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/certificates');
      
      if (!response.ok) {
        throw new Error('Failed to fetch certificates');
      }

      const data = await response.json();
      setCertificates(data.certificates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading certificates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchCertificates}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
          <p className="mt-2 text-gray-600">
            View and download all your event certificates
          </p>
        </div>

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No certificates yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Participate in events to earn certificates!
            </p>
            <div className="mt-6">
              <Link
                href="/events"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Events
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Certificate Preview */}
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏆</div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {cert.eventName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{cert.clubName}</p>
                  </div>
                </div>

                {/* Certificate Info */}
                <div className="p-4">
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Certificate ID
                    </p>
                    <p className="text-sm font-mono text-gray-700">
                      {cert.certificateId}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500">Event Date</p>
                    <p className="text-sm text-gray-700">
                      {formatDate(cert.eventDate)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 text-center"
                    >
                      View
                    </a>
                    <a
                      href={cert.certificateUrl}
                      download={`${cert.certificateId}.pdf`}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 text-center"
                    >
                      Download
                    </a>
                  </div>

                  <div className="mt-2 text-xs text-gray-500 text-center">
                    Issued on {formatDate(cert.issuedAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
