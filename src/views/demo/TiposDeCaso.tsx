import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

interface Caso {
    x: string | null
    y: number
}

interface TiposDeCasosData {
    data: Caso[]
    colors: string[]
}

interface ChartData {
    type?:
        | 'line'
        | 'area'
        | 'bar'
        | 'pie'
        | 'donut'
        | 'radialBar'
        | 'scatter'
        | 'bubble'
        | 'heatmap'
        | 'candlestick'
        | 'boxPlot'
        | 'radar'
        | 'polarArea'
        | 'rangeBar'
        | 'rangeArea'
        | 'treemap'
    series?: ApexOptions['series']
    width?: string | number
    height?: string | number
    options?: ApexOptions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
}

const TiposDeCaso = () => {
    const [chartData, setChartData] = useState<ChartData | null>(null)
    useEffect(() => {
        fetch('/data/tipos_de_casos.json')
            .then((response) => response.json())
            .then((data: TiposDeCasosData) => {
                // Ordenar los datos de mayor a menor según 'y'
                const sortedData = data.data
                    .filter((item) => item.x !== null) // Filtrar nulos
                    .sort((a, b) => b.y - a.y) // Ordenar de mayor a menor

                const labels = sortedData.map((item) => item.x) as string[]
                const series = sortedData.map((item) => item.y)
                const colors = data.colors

                setChartData({
                    options: {
                        chart: {
                            type: 'pie',
                            width: 'auto',
                        },
                        labels: labels, // Ahora en orden
                        colors: colors,
                        legend: {
                            position: 'right',
                        },
                        title: {
                            text: 'Tipos de caso:',
                            align: 'left',
                            offsetX: 10,
                            style: {
                                fontSize: '25px',
                                fontWeight: 'bold',
                                color: '#000000',
                            },
                        },
                        tooltip: {
                            theme: 'dark',
                            style: { fontSize: '14px' },
                            fillSeriesColor: false,
                            marker: { show: true },
                        },
                        responsive: [
                            {
                                breakpoint: 480,
                                options: {
                                    chart: { width: 200 },
                                    legend: { position: 'bottom' },
                                },
                            },
                        ],
                    },
                    series: series, // Ahora en orden
                })
            })
            .catch((error) => console.error('Error loading JSON data:', error))
    }, [])

    if (!chartData) {
        return <div>Loading...</div>
    }

    return (
        <Chart
            options={chartData.options}
            series={chartData.series}
            height={590}
            type="pie"
        />
    )
}

export default TiposDeCaso
