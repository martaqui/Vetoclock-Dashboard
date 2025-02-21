import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'

interface VentasCliente {
    fecha: string
    importe: number
    empresa: string
}

const GraficoPorCliente = () => {
    const { client } = useParams<{ client: string }>()
    const [chartData, setChartData] = useState<{
        labels: string[]
        series: number[]
    } | null>(null)

    useEffect(() => {
        fetch('/data/ventasxclienteconcreto.json')
            .then((response) => response.json())
            .then((data: VentasCliente[]) => {
                console.log('Datos originales del JSON:', data)

                const clientData = data.filter(
                    (item) => item.empresa === client,
                )

                console.log('Datos filtrados por cliente:', clientData)

                const salesByMonth = clientData.reduce<Record<string, number>>(
                    (acc, { fecha, importe }) => {
                        const month = new Date(fecha).toLocaleString(
                            'default',
                            {
                                month: 'long',
                                year: 'numeric',
                            },
                        )

                        acc[month] = (acc[month] || 0) + importe
                        return acc
                    },
                    {},
                )

                console.log('Datos agrupados por mes:', salesByMonth)

                setChartData({
                    labels: Object.keys(salesByMonth),
                    series: Object.values(salesByMonth),
                })
            })
            .catch((error) => console.error('Error loading JSON data:', error))
    }, [client])

    if (!chartData) {
        return <div className="text-center text-lg">Cargando...</div>
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-700 mb-4">
                Ventas para el cliente: {client}
            </h1>
            <Chart
                options={{
                    chart: {
                        type: 'bar',
                        height: 300,
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '50%',
                            borderRadius: 4,
                        },
                    },
                    colors: [COLORS[0]],
                    dataLabels: {
                        enabled: false,
                    },
                    stroke: {
                        show: true,
                        width: 2,
                        colors: ['transparent'],
                    },
                    xaxis: {
                        categories: chartData.labels,
                    },
                    yaxis: {
                        labels: {
                            formatter: function (value) {
                                return value.toFixed(2)
                            },
                        },
                    },
                    fill: {
                        opacity: 1,
                    },
                    tooltip: {
                        y: {
                            formatter: (val) => `$${val.toLocaleString()} MXN`,
                        },
                    },
                }}
                series={[{ name: 'Ventas', data: chartData.series }]}
                height={300}
                type="bar"
            />
        </div>
    )
}

export default GraficoPorCliente
