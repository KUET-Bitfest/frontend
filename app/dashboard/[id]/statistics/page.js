"use client"
import { mockStatisticsData } from '@/mock/statistics-data'
import BarChartComponent from '@/components/charts/BarChartComponent'
import LineChartComponent from '@/components/charts/LineChartComponent'

export default function StatisticsPage() {
  const {
    pdf_stats,
    chat_stats,
    translation_stats,
    training_data_stats,
  } = mockStatisticsData

  return (
    <div className="space-y-6 h-full w-full">
      <h1 className="text-2xl font-bold">Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BarChartComponent
          data={pdf_stats.pdf_stats_graph}
          title="PDF Statistics"
          dataKey="count"
          fill="#8884d8"
        />
        
        <BarChartComponent
          data={chat_stats.chat_stats_graph}
          title="Chat Statistics"
          dataKey="count"
          fill="#82ca9d"
        />
        
        <LineChartComponent
          data={translation_stats.translation_stats_graph}
          title="Translation Statistics"
          lines={[
            { dataKey: "count", color: "#8884d8" }
          ]}
        />
        
        <LineChartComponent
          data={training_data_stats.training_stats_graph}
          title="Training Data Statistics"
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