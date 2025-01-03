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
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 h-[140px] flex flex-col justify-between
      ${isSelectable ? 'hover:border-primary transition-all duration-200' : 'hover:shadow-md transition-shadow'}`}>
      <div className="flex justify-between items-start">
        <div className="overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {caption}
          </p>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {status === 'public' ? 'Public' : 'Private'}
          </span>
          {!isAdmin && onStatusChange && (
            <Switch
              checked={status === 'public'}
              onCheckedChange={(checked) => onStatusChange(checked ? 'public' : 'private')}
            />
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <a 
          href={`${process.env.NEXT_PUBLIC_ENDPOINT}/${fileUrl}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          onClick={(e) => isSelectable && e.preventDefault()}
        >
          <FaFilePdf className="w-5 h-5 text-red-500" />
          <span className="text-sm underline truncate max-w-[200px]">{title+'.pdf'}</span>
        </a>
        
        {isAdmin && user && !isSelectable && (
          <Link 
            href={`/profile/${user.id}`}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 group flex-shrink-0"
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