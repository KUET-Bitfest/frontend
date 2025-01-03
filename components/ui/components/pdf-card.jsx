import { FaFilePdf } from "react-icons/fa";
import { Badge } from "./badge";
import { Switch } from "./switch";

export function PDFCard({ title, caption, status, fileName, fileUrl, onStatusChange }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {caption}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {status === 'public' ? 'Public' : 'Private'}
          </span>
          <Switch
            checked={status === 'public'}
            onCheckedChange={(checked) => onStatusChange(checked ? 'public' : 'private')}
          />
        </div>
      </div>
      
      <a 
        href={fileUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
      >
        <FaFilePdf className="w-5 h-5 text-red-500" />
        <span className="text-sm underline">{fileName}</span>
      </a>
    </div>
  )
} 