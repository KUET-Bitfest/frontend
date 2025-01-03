"use client"

import BarChartComponent from '@/components/charts/BarChartComponent'
import LineChartComponent from '@/components/charts/LineChartComponent'
import Loading from '@/components/ui/components/loading';
import { useState, useEffect } from 'react'

export default function StatisticsPage() {
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/user/stats`, {
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

  if (loading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500 text-center">
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Statistics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Story Generation Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <BarChartComponent
            data={statistics.pdf_stats.pdf_stats_graph}
            title="Story Generation"
            dataKey="count"
            fill="#8884d8"
          />
        </div>
        
        {/* Chatbot Interactions Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <BarChartComponent
            data={statistics.chat_stats.chat_stats_graph}
            title="Chatbot Interactions"
            dataKey="count"
            fill="#82ca9d"
          />
        </div>
        
        {/* Translation Usage Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <LineChartComponent
            data={statistics.translation_stats.translation_stats_graph}
            title="Translation Usage"
            lines={[
              { dataKey: "count", color: "#8884d8" }
            ]}
          />
        </div>
        
        {/* Training Data Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <LineChartComponent
            data={statistics.training_data_stats.training_stats_graph}
            title="Training Data"
            lines={[
              { dataKey: "approved", color: "#82ca9d" },
              { dataKey: "unapproved", color: "#ffc658" },
              { dataKey: "total", color: "#8884d8" }
            ]}
          />
        </div>
      </div>
    </div>
  );
} 