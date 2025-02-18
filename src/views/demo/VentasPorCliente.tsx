import { ApexOptions } from 'apexcharts'
import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'

interface Venta {
    x: string | null
    y: number
}

interface VentasPorClienteData {
    data: Venta[]
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

const VentasPorCliente = () => {
    const [chartData, setChartData] = useState<ChartData | null>(null)

    useEffect(() => {
        fetch('/data/ventasxcliente1.json')
            .then((response) => response.json())
            .then((data: VentasPorClienteData) => {
                const labels = data.data
                    .map((item) => item.x)
                    .filter((label) => label !== null) as string[]
                const series = data.data.map((item) => item.y)
                const colors = data.colors
                setChartData({
                    options: {
                        chart: {
                            type: 'pie',
                            width: 'auto', // Ajuste dinámico
                        },
                        labels: labels,
                        colors: colors,
                        responsive: [
                            {
                                breakpoint: 1024,
                                options: {
                                    chart: {
                                        width: '90%',
                                    },
                                    legend: {
                                        position: 'bottom',
                                    },
                                },
                            },
                        ],
                        title: {
                            text: 'Ventas por cliente:',
                            align: 'left',
                            offsetX: 10,
                            offsetY: 10,
                            style: {
                                fontSize: '25px',
                                fontWeight: 'bold',
                                color: '#000000',
                            },
                        },
                        legend: {
                            position: 'right',
                            offsetY: 25,
                            width: 290,
                        },
                    },

                    dataLabels: {
                        enabled: true,
                        formatter: (val: number) => `${val.toFixed(1)}%`, // Siempre muestra al menos un decimal
                        style: {
                            fontSize: '12px',
                        },
                    },
                    plotOptions: {
                        pie: {
                            expandOnClick: false, // Evita que los segmentos se agranden al hacer clic
                            customScale: 1.1, // Aumenta ligeramente el tamaño del gráfico
                        },
                    },
                    stroke: {
                        show: true,
                        width: 2, // Grosor del borde
                        colors: ['#ffffff'], // Borde blanco
                    },
                    series: series, // Los datos del gráfico
                })
            })
            .catch((error) => console.error('Error loading JSON data:', error))
    }, [])

    if (chartData === null) {
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

export default VentasPorCliente
