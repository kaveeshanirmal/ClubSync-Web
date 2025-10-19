import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface GenerateCertificateOptions {
  element: HTMLElement;
  fileName: string;
  format: 'pdf' | 'png' | 'jpeg';
  quality?: number; // For image formats (0-1)
}

/**
 * Generates a certificate as PDF or image from a DOM element
 * Creates an isolated iframe to avoid oklch color conflicts
 * @param options Configuration options for certificate generation
 * @returns Promise<Blob> - The generated certificate as a Blob
 */
export async function generateCertificate(
  options: GenerateCertificateOptions
): Promise<Blob> {
  const { element, format, quality = 0.95 } = options;

  // Create an isolated iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-9999px';
  iframe.style.top = '-9999px';
  iframe.style.width = '1200px';
  iframe.style.height = '850px';
  document.body.appendChild(iframe);

  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error('Could not access iframe document');
    }

    // Write basic HTML structure with NO external stylesheets
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              margin: 0; 
              padding: 0; 
              background: #ffffff;
              font-family: Georgia, serif;
            }
          </style>
        </head>
        <body></body>
      </html>
    `);
    iframeDoc.close();

    // Clone the certificate element into iframe
    const clonedElement = element.cloneNode(true) as HTMLElement;
    iframeDoc.body.appendChild(clonedElement);

    // Wait for fonts and rendering
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 500));

    // Capture with html2canvas from iframe
    const canvas = await html2canvas(iframeDoc.body, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: false,
      width: 1200,
      height: 850,
    });

    if (!canvas) {
      throw new Error('Failed to create canvas from element');
    }

    // Remove iframe
    document.body.removeChild(iframe);

    if (format === 'pdf') {
      // Convert to PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      const pdfWidth = 297; // A4 landscape
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      return pdf.output('blob');
      
    } else {
      // Convert to PNG or JPEG
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to generate image blob'));
            }
          },
          format === 'png' ? 'image/png' : 'image/jpeg',
          quality
        );
      });
    }
  } catch (error) {
    // Clean up iframe on error
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
    console.error('Error in generateCertificate:', error);
    throw error;
  }
}

/**
 * Downloads a certificate file
 * @param blob The certificate blob
 * @param fileName The name for the downloaded file
 */
export function downloadCertificate(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a certificate in one step
 * @param element The certificate DOM element
 * @param fileName The name for the downloaded file (without extension)
 * @param format The output format
 */
export async function generateAndDownloadCertificate(
  element: HTMLElement,
  fileName: string,
  format: 'pdf' | 'png' | 'jpeg' = 'pdf'
): Promise<void> {
  try {
    const fileExtension = format === 'pdf' ? 'pdf' : format;
    const fullFileName = `${fileName}.${fileExtension}`;
    
    const blob = await generateCertificate({
      element,
      fileName: fullFileName,
      format,
    });
    
    downloadCertificate(blob, fullFileName);
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw error;
  }
}

/**
 * Generates a certificate and returns it as a base64 string
 * Useful for uploading to cloud storage
 */
export async function generateCertificateBase64(
  element: HTMLElement,
  format: 'pdf' | 'png' | 'jpeg' = 'pdf'
): Promise<string> {
  const blob = await generateCertificate({
    element,
    fileName: 'certificate',
    format,
  });
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
