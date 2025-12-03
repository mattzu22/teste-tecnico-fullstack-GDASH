import { Download } from "lucide-react";

export const DonwloadLogs = () => {
    const handleDownload = () => {
    console.log('Downloading weather report...');
  };

  return (
    <button
      onClick={handleDownload}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl transition-all hover:scale-110 active:scale-95"
    >
      <Download size={24} />
    </button>
  );
};
