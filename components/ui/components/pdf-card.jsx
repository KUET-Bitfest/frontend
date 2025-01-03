import { FaFilePdf, FaUser } from "react-icons/fa";
import { Badge } from "./badge";
import { Switch } from "./switch";
import Link from "next/link";

export function PDFCard({ 
  title, 
  caption, 
  status, 
  fileName, 
  fileUrl, 
  onStatusChange, 
  isAdmin, 
  user,
  isSelectable 
}) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 
      ${isSelectable ? 'hover:border-primary transition-all duration-200' : 'hover:shadow-md transition-shadow'}`}>
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
          {!isAdmin && !isSelectable && onStatusChange && (
            <button
              onClick={() => onStatusChange(status === 'public' ? 'private' : 'public')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Toggle Status
            </button>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <a 
          href={fileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          onClick={(e) => isSelectable && e.preventDefault()}
        >
          <FaFilePdf className="w-5 h-5 text-red-500" />
          <span className="text-sm underline">{fileName}</span>
        </a>
        
        {isAdmin && user && !isSelectable && (
          <Link 
            href={`/profile/${user.id}`}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 group"
          >
            <FaUser className="w-4 h-4" />
            <span className="text-sm group-hover:underline">
              {user.name}
            </span>
          </Link>
        )}
      </div>
    </div>
  )
} 