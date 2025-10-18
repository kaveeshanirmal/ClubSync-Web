'use client';

import React from 'react';

interface CertificateProps {
  userName: string;
  eventName: string;
  clubName: string;
  eventDate: string;
  certificateId?: string;
}

export const Certificate = React.forwardRef<HTMLDivElement, CertificateProps>(
  ({ userName, eventName, clubName, eventDate, certificateId }, ref) => {
    // Standard hex colors for html2canvas compatibility (oklch not supported)
    const colors = {
      white: '#ffffff',
      black: '#000000',
      neutral900: '#171717',
      neutral800: '#262626',
      neutral700: '#404040',
      neutral600: '#525252',
      neutral500: '#737373',
      neutral400: '#a3a3a3',
      neutral300: '#d4d4d4',
    };

    return (
      <div
        ref={ref}
        style={{ 
          position: 'relative',
          width: '1200px',
          height: '850px',
          padding: '64px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflow: 'hidden',
          fontFamily: 'Georgia, serif',
          backgroundColor: colors.white,
        }}
      >
        {/* Decorative border */}
        <div 
          style={{ 
            position: 'absolute',
            top: '16px',
            right: '16px',
            bottom: '16px',
            left: '16px',
            border: `2px solid ${colors.neutral800}`,
            borderRadius: '2px',
          }}
        >
          <div 
            style={{ 
              position: 'absolute',
              top: '8px',
              right: '8px',
              bottom: '8px',
              left: '8px',
              border: `1px solid ${colors.neutral400}`,
            }}
          />
        </div>

        {/* Corner decorations */}
        <div 
          style={{ 
            position: 'absolute',
            top: '32px',
            left: '32px',
            width: '64px',
            height: '64px',
            borderTop: `4px solid ${colors.neutral800}`,
            borderLeft: `4px solid ${colors.neutral800}`,
          }}
        />
        <div 
          style={{ 
            position: 'absolute',
            top: '32px',
            right: '32px',
            width: '64px',
            height: '64px',
            borderTop: `4px solid ${colors.neutral800}`,
            borderRight: `4px solid ${colors.neutral800}`,
          }}
        />
        <div 
          style={{ 
            position: 'absolute',
            bottom: '32px',
            left: '32px',
            width: '64px',
            height: '64px',
            borderBottom: `4px solid ${colors.neutral800}`,
            borderLeft: `4px solid ${colors.neutral800}`,
          }}
        />
        <div 
          style={{ 
            position: 'absolute',
            bottom: '32px',
            right: '32px',
            width: '64px',
            height: '64px',
            borderBottom: `4px solid ${colors.neutral800}`,
            borderRight: `4px solid ${colors.neutral800}`,
          }}
        />

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          paddingTop: '40px',
          paddingBottom: '40px',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '16px',
              marginBottom: '20px',
            }}>
              <div 
                style={{ 
                  width: '96px', 
                  height: '4px',
                  backgroundColor: colors.neutral800,
                }}
              />
              <svg
                style={{ width: '48px', height: '48px' }}
                fill="none"
                stroke={colors.neutral800}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              <div 
                style={{ 
                  width: '96px', 
                  height: '4px',
                  backgroundColor: colors.neutral800,
                }}
              />
            </div>
            <h1 
              style={{ 
                fontSize: '64px',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                color: colors.neutral900,
                margin: '12px 0',
              }}
            >
              CERTIFICATE
            </h1>
            <p 
              style={{ 
                fontSize: '24px',
                letterSpacing: '0.25em',
                fontWeight: 300,
                color: colors.neutral600,
                margin: 0,
              }}
            >
              OF PARTICIPATION
            </p>
          </div>

          {/* Body */}
          <div style={{ 
            textAlign: 'center',
            maxWidth: '768px',
            marginTop: '10px',
            marginBottom: '10px',
          }}>
            <p 
              style={{ 
                fontSize: '19px',
                fontWeight: 300,
                color: colors.neutral700,
                marginBottom: '20px',
              }}
            >
              This is to certify that
            </p>

            <h2 
              style={{ 
                fontSize: '50px',
                fontWeight: 'bold',
                color: colors.neutral900,
                borderBottom: `2px solid ${colors.neutral300}`,
                paddingBottom: '14px',
                marginBottom: '20px',
              }}
            >
              {userName}
            </h2>

            <div>
              <p 
                style={{ 
                  fontSize: '19px',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  color: colors.neutral700,
                  marginBottom: '10px',
                }}
              >
                has successfully participated in
              </p>

              <h3 
                style={{ 
                  fontSize: '33px',
                  fontWeight: 600,
                  fontStyle: 'italic',
                  color: colors.neutral800,
                  marginBottom: '10px',
                }}
              >
                {eventName}
              </h3>

              <p 
                style={{ 
                  fontSize: '19px',
                  fontWeight: 300,
                  color: colors.neutral700,
                  marginBottom: '10px',
                }}
              >
                organized by
              </p>

              <h4 
                style={{ 
                  fontSize: '25px',
                  fontWeight: 600,
                  color: colors.neutral800,
                  marginBottom: '16px',
                }}
              >
                {clubName}
              </h4>

              <p 
                style={{ 
                  fontSize: '17px',
                  color: colors.neutral600,
                  margin: 0,
                }}
              >
                on {eventDate}
              </p>
            </div>
          </div>

          {/* Footer with branding and certificate ID */}
          <div style={{ 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}>
            {/* ClubSync Logo/Branding */}
            <div style={{ textAlign: 'center' }}>
              <p 
                style={{ 
                  fontSize: '24px',
                  fontWeight: 'bold',
                  letterSpacing: '-0.025em',
                  color: colors.neutral900,
                  margin: 0,
                  marginBottom: '4px',
                }}
              >
                ClubSync
              </p>
              <p 
                style={{ 
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  color: colors.neutral500,
                  margin: 0,
                }}
              >
                VOLUNTEER MANAGEMENT SYSTEM
              </p>
            </div>
            
            {/* Certificate ID */}
            {certificateId && (
              <div style={{ textAlign: 'center' }}>
                <p 
                  style={{ 
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    color: colors.neutral400,
                    margin: 0,
                  }}
                >
                  Certificate ID: {certificateId}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Watermark */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          opacity: 0.05,
        }}>
          <svg
            style={{ width: '384px', height: '384px' }}
            fill={colors.neutral800}
            viewBox="0 0 24 24"
          >
            <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
      </div>
    );
  }
);

Certificate.displayName = 'Certificate';

export default Certificate;
