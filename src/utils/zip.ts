import JSZip from 'jszip';

export async function createZipFromChunks(
  fileName: string, 
  chunks: Blob[]
): Promise<Blob> {
  try {
    const zip = new JSZip();
    const extension = fileName.split('.').pop() || 'mp3';
    const baseName = fileName.replace(`.${extension}`, '');

    chunks.forEach((chunk, index) => {
      zip.file(`${baseName}_part${index + 1}.${extension}`, chunk);
    });

    return await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });
  } catch (error) {
    console.error('Error creating ZIP file:', error);
    throw new Error('Failed to create ZIP file');
  }
}