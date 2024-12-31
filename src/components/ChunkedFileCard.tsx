import React, { useCallback } from "react";
import { FileAudio, Download, X, Archive } from "lucide-react";
import { formatFileSize } from "../utils/chunker";
import { downloadBlob } from "../utils/download";
import { createZipFromChunks } from "../utils/zip";

interface ChunkedFileCardProps {
  fileName: string;
  chunks: Blob[];
  onRemove: () => void;
}

export function ChunkedFileCard({
  fileName,
  chunks,
  onRemove,
}: ChunkedFileCardProps) {
  const downloadChunk = useCallback(
    async (chunk: Blob, index: number) => {
      try {
        const extension = fileName.split(".").pop() || "mp3";
        const baseName = fileName.replace(`.${extension}`, "");
        downloadBlob(chunk, `${baseName}_part${index + 1}.${extension}`);
      } catch (error) {
        console.error("Error downloading chunk:", error);
        alert("Failed to download chunk");
      }
    },
    [fileName]
  );

  const downloadZip = useCallback(async () => {
    try {
      const zip = await createZipFromChunks(fileName, chunks);
      const baseName = fileName.split(".")[0];
      downloadBlob(zip, `${baseName}_chunks.zip`);
    } catch (error) {
      console.error("Error downloading ZIP:", error);
      alert("Failed to create ZIP file");
    }
  }, [fileName, chunks]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <FileAudio className="w-5 h-5 text-blue-500 mr-2" />
          <span className="font-medium">{fileName}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadZip}
            className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-2 text-gray-400 hover:text-blue-500 transition-colors"
            title="Download all chunks as ZIP"
          >
            <Archive className="w-5 h-5" />
            Download ZIP
          </button>
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Remove file"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {chunks.map((chunk, chunkIndex) => (
          <button
            key={chunkIndex}
            onClick={() => downloadChunk(chunk, chunkIndex)}
            className="flex items-center justify-center p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors"
          >
            <Download className="w-4 h-4 mr-1" />
            Part {chunkIndex + 1} ({formatFileSize(chunk.size)})
          </button>
        ))}
      </div>
    </div>
  );
}
