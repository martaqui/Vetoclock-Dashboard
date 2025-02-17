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
                                        position: 'bottom', // Colocación de la leyenda
                                    },
                                },
                            },
                        ],
                        title: {
                            text: 'Tipos de  caso',
                            align: 'left', // Mueve el título a la izquierda
                            offsetX: 10, // Ajusta el desplazamiento si es necesario
                            style: {
                                fontSize: '25px',
                                fontWeight: 'bold',
                                color: '#000000',
                            },
                        },
                        legend: {
                            position: 'right', // Posición de la leyenda
                        },
                    },
                    series: series, // Los datos del gráfico
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
