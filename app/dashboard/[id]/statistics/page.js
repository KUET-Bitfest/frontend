"use client"
import { mockStatisticsData } from '@/mock/statistics-data'
import BarChartComponent from '@/components/charts/BarChartComponent'
import LineChartComponent from '@/components/charts/LineChartComponent'
import { useState, useEffect } from 'react'
export default function StatisticsPage() {

  const [pdf_stats, setPdfStats] = useState(mockStatisticsData.pdf_stats)
  const [chat_stats, setChatStats] = useState(mockStatisticsData.chat_stats)
  const [translation_stats, setTranslationStats] = useState(mockStatisticsData.translation_stats)
  const [training_data_stats, setTrainingDataStats] = useState(mockStatisticsData.training_data_stats)

  async function fetchStatistics() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/user/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access_token}`
      }
    })
    const data = await response.json()
    console.log("data", data)
    setPdfStats(data.pdf_stats)
    setChatStats(data.chat_stats)
    setTranslationStats(data.translation_stats)
    setTrainingDataStats(data.training_data_stats)
  }

  useEffect(() => {
    fetchStatistics()

  }, [])

  return (
    <div className="space-y-6 h-full w-full">
      <h1 className="text-2xl font-bold">Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BarChartComponent
          data={pdf_stats.pdf_stats_graph}
          title="Story Generation"
          dataKey="count"
          fill="#8884d8"
        />
        
        <BarChartComponent
          data={chat_stats.chat_stats_graph}
          title="Chatbot Interactions"
          dataKey="count"
          fill="#82ca9d"
        />
        
        <LineChartComponent
          data={translation_stats.translation_stats_graph}
          title="Translation Usage"
          lines={[
            { dataKey: "count", color: "#8884d8" }
          ]}
        />
        
        <LineChartComponent
          data={training_data_stats.training_stats_graph}
          title="Training Data"
          lines={[
            { dataKey: "approved", color: "#82ca9d" },
            { dataKey: "unapproved", color: "#ffc658" },
            { dataKey: "total", color: "#8884d8" }
          ]}
        />
      </div>
    </div>
  )
} 