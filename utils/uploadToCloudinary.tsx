export async function uploadToCloudinary(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'unsigned_clubsync');
  
    const isPDF = file.type === 'application/pdf';
    const isZip = file.type === 'application/zip';
    const isVideo = file.type.startsWith('video/');
    
    let resourceType = 'image';
    if (isVideo) resourceType = 'video';
    else if (isPDF || isZip) resourceType = 'raw';
    else resourceType = 'auto';
  
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dkea2wm45/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
  
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
  
    let fileUrl = data.secure_url;
  
    if (resourceType === 'raw') {
      const fileExt = file.name.split('.').pop(); // original extension (pdf/zip)
      const publicId = data.public_id;
  
      // Only add extension if Cloudinary didn't already include it
      const hasExtAlready = publicId.endsWith(`.${fileExt}`);
      fileUrl = `https://res.cloudinary.com/dkea2wm45/raw/upload/${publicId}${hasExtAlready ? '' : `.${fileExt}`}`;
    }
  
    return fileUrl;
  }
  