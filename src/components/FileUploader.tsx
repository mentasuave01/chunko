import React, { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import { chunkFile } from '../utils/chunker';
import { ChunkedFileCard } from './ChunkedFileCard';

const CHUNK_SIZE = 25 * 1024 * 1024; // 25MB in bytes

interface ChunkedFile {
  originalName: string;
  chunks: Blob[];
}

export function FileUploader() {
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [chunkedFiles, setChunkedFiles] = useState<ChunkedFile[]>([]);

  const handleFiles = useCallback(async (files: FileList) => {
    setProcessing(true);
    const newChunkedFiles: ChunkedFile[] = [];

    for (const file of files) {
      if (file.type.startsWith('audio/')) {
        const chunks = await chunkFile(file, CHUNK_SIZE);
        newChunkedFiles.push({
          originalName: file.name,
          chunks
        });
      }
    }

    setChunkedFiles(prev => [...prev, ...newChunkedFiles]);
    setProcessing(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((index: number) => {
    setChunkedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${processing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => !processing && document.getElementById('fileInput')?.click()}
      >
        <input
          id="fileInput"
          type="file"
          multiple
          accept="audio/mp3"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          disabled={processing}
        />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg mb-2">Drag and drop MP3 files here</p>
        <p className="text-sm text-gray-500">or click to select files</p>
      </div>

      {processing && (
        <div className="mt-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Processing files...</p>
        </div>
      )}

      {chunkedFiles.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Processed Files</h2>
          <div className="space-y-4">
            {chunkedFiles.map((file, fileIndex) => (
              <ChunkedFileCard
                key={fileIndex}
                fileName={file.originalName}
                chunks={file.chunks}
                onRemove={() => removeFile(fileIndex)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}