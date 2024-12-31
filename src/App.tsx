import { FileUploader } from "./components/FileUploader";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MP3 File Chunker
          </h1>
          <p className="text-gray-600">
            Split your MP3 files into 25MB chunks for use in whisper
          </p>
        </div>
        <FileUploader />
      </div>
    </div>
  );
}

export default App;
