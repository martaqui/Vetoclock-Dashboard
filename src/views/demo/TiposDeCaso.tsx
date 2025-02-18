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
    [key: string]: any
}

const TiposDeCaso = () => {
    const [chartData, setChartData] = useState<ChartData | null>(null)

    useEffect(() => {
        fetch('/data/tipos_de_casos.json')
            .then((response) => response.json())
            .then((data: TiposDeCasosData) => {
                const labels = data.data
                    .map((item) => item.x)
                    .filter((label) => label !== null) as string[]
                const series = data.data.map((item) => item.y)
                const colors = data.colors
                setChartData({
                    options: {
                        chart: {
                            type: 'pie',
                        },
                        plotOptions: {
                            pie: {
                                expandOnClick: true,
                                donut: {
                                    size: '0%', // Cutout en 0
                                },
                            },
                        },
                        tooltip: {
                            theme: 'dark', // Aplica un tema oscuro
                            style: {
                                fontSize: '14px',
                            },
                            fillSeriesColor: false, // Usa los colores personalizados
                            marker: {
                                show: true, // Muestra el indicador de color
                            },
                        },
                        labels: labels,
                        colors: colors,
                        responsive: [
                            {
                                breakpoint: 480,
                                options: {
                                    chart: {
                                        width: 200, // Ajuste de tamaño para pantallas pequeñas
                                    },
                                    legend: {
                                        position: 'bottom',
                                    },
                                },
                            },
                        ],
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
                        legend: {
                            position: 'right',
                        },
                    },
                    series: series,
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
