import { useState, useEffect } from 'react'
import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'
import { ApexOptions } from 'apexcharts'

// Define types
interface DataPoint {
    x: string
    y: number
}

interface Dataset {
    label: string
    data: DataPoint[]
}

interface FetchedData {
    datasets: Dataset[]
}

const CasosUltimosDosMeses = () => {
    const [chartData, setChartData] = useState<{
        series: { name: string; data: number[]; color: string }[]
        categories: string[]
    }>({
        series: [],
        categories: [],
    })

    useEffect(() => {
        fetch('/data/casos_ultimos_dos_meses1.json')
            .then((response) => response.json())
            .then((data: FetchedData) => {
                const labels = data.datasets[0].data.map(
                    (item: DataPoint) => item.x,
                )
                const series = data.datasets.map(
                    (dataset: Dataset, index: number) => ({
                        name: dataset.label,
                        data: dataset.data.map((item: DataPoint) => item.y),
                        color: COLORS[index],
                    }),
                )

                setChartData({ series, categories: labels })
            })
            .catch((error) => console.error('Error loading JSON data:', error))
    }, [])

    const options: ApexOptions = {
        chart: {
            type: 'line',
            zoom: { enabled: false },
        },
        colors: [COLORS[0], COLORS[1]],
        dataLabels: { enabled: false },
        stroke: {
            width: [3, 3],
            curve: 'straight',
            dashArray: [0, 0],
        },
        markers: { size: 4 },
        legend: { position: 'top' },
        xaxis: { categories: chartData.categories },
        tooltip: {
            y: {
                formatter: (val: number) => `${val} unidades`,
            },
        },
        grid: { borderColor: '#f1f1f1' },
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Casos ultimos dos meses</h2>
            <Chart options={options} series={chartData.series} height={300} />
        </div>
    )
}

export default CasosUltimosDosMeses
