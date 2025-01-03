"use client"

import BarChartComponent from '@/components/charts/BarChartComponent'
import LineChartComponent from '@/components/charts/LineChartComponent'
import Loading from '@/components/ui/components/loading';
import { useState, useEffect } from 'react'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/components/table"
import { useRouter } from 'next/navigation'

export default function AdminStatisticsPage() {
  const router = useRouter()
  const [statistics, setStatistics] = useState({
    pdf_stats: {
      pdf_stats_graph: []
    },
    chat_stats: {
      chat_stats_graph: []
    },
    translation_stats: {
      translation_stats_graph: []
    },
    training_data_stats: {
      training_stats_graph: []
    },
    top_contributors: {
      translators: [],
      training_data: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchStatistics() {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/admin/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420',
          'Authorization': `Bearer ${JSON.parse(token).access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();
      setStatistics(data);
      console.log(data)
    } catch (err) {
      setError(err.message);
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatistics();
  }, []);

  const handleUserClick = (userId) => {
    router.push(`/profile/${userId}`)
  }

  if (loading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-5rem)] w-full">
        <div className="text-red-500 text-center flex flex-col items-center justify-center h-full">
          <p className="text-xl font-semibold">Error loading statistics</p>
          <p className="text-sm mt-2">{error}</p>
          <button 
            onClick={fetchStatistics}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 space-y-6 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Statistics</h1>
        <button
          onClick={fetchStatistics}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <BarChartComponent
            data={statistics.pdf_stats.pdf_stats_graph}
            title="Story Generation (All Users)"
            dataKey="count"
            fill="#8884d8"
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <BarChartComponent
            data={statistics.chat_stats.chat_stats_graph}
            title="Chatbot Interactions (All Users)"
            dataKey="count"
            fill="#82ca9d"
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <LineChartComponent
            data={statistics.translation_stats.translation_stats_graph}
            title="Translation Usage (All Users)"
            lines={[
              { dataKey: "count", color: "#8884d8" }
            ]}
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <LineChartComponent
            data={statistics.training_data_stats.training_stats_graph}
            title="Training Data Status"
            lines={[
              { dataKey: "approved", color: "#82ca9d", name: "Approved" },
              { dataKey: "unapproved", color: "#ffc658", name: "Pending" },
              { dataKey: "total", color: "#8884d8", name: "Total" }
            ]}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-32">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-12">
          <h2 className="text-lg font-semibold mb-4">Top Translators</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Translations</TableHead>
                <TableHead>Words</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statistics?.top_contributors?.translators.map((translator) => (
                <TableRow key={translator.user_id}>
                  <TableCell>
                    <button
                      onClick={() => handleUserClick(translator.user_id)}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-left"
                    >
                      {translator.name}
                    </button>
                  </TableCell>
                  <TableCell>{translator.translation_count}</TableCell>
                  <TableCell>{translator.words_translated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-12">
          <h2 className="text-lg font-semibold mb-4">Top Training Contributors</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Approved</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statistics?.top_contributors?.training_data.map((contributor) => (
                <TableRow key={contributor.user_id}>
                  <TableCell>
                    <button
                      onClick={() => handleUserClick(contributor.user_id)}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-left"
                    >
                      {contributor.name}
                    </button>
                  </TableCell>
                  <TableCell>{contributor.total_contributions}</TableCell>
                  <TableCell>{contributor.approved_contributions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
} 