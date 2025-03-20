// ChartComponent.tsx
import { ApexOptions } from 'apexcharts'
import React from 'react'
import Chart from 'react-apexcharts'

interface ChartProps {
    chartData: {
        series: { name: string; data: number[] }[]
        options: ApexOptions
    }
}

const ChartComponent: React.FC<ChartProps> = ({ chartData }) => {
    if (!chartData) return <div>Loading...</div>

    return (
        <div className="cursor-pointer">
            <Chart
                options={chartData.options}
                series={chartData.series}
                type="area"
                height={300}
            />
        </div>
    )
}

export default ChartComponent
