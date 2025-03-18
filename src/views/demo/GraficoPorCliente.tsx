import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'

interface VentasCliente {
    fecha: string
    importe: number
    empresa: string
}

interface Caso {
    x: string | null
    y: number
    cif: string
}

interface TiposDeCasosData {
    data: Caso[]
    colors: string[]
}

interface ChartData {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    options: any
    series: any
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
                const clientData = data.filter(
                    (item) => item.empresa === client,
                )

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
                    chart: { type: 'bar', height: 300 },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '50%',
                            borderRadius: 4,
                        },
                    },
                    colors: [COLORS[0]],
                    dataLabels: { enabled: false },
                    stroke: { show: true, width: 2, colors: ['transparent'] },
                    xaxis: { categories: chartData.labels },
                    yaxis: {
                        labels: {
                            formatter: (value) => value.toFixed(2),
                        },
                    },
                    fill: { opacity: 1 },
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
const TiposDeCaso = () => {
    const { cif } = useParams<{ cif: string }>()
    const navigate = useNavigate()
    const [chartData, setChartData] = useState<ChartData | null>(null)

    useEffect(() => {
        if (!cif) return

        fetch('/data/ventasxclientetarta.json')
            .then((response) => response.json())
            .then((data: TiposDeCasosData) => {
                const filteredData = data.data.filter(
                    (item) => item.cif === cif,
                )
                const sortedData = filteredData
                    .filter((item) => item.x !== null)
                    .sort((a, b) => b.y - a.y)

                setChartData({
                    options: {
                        chart: {
                            type: 'pie',
                            width: 'auto',
                            events: {
                                dataPointSelection: (
                                    _event: unknown,
                                    _chartContext: unknown,
                                    config: { dataPointIndex: number },
                                ) => {
                                    const selectedCase =
                                        sortedData[config.dataPointIndex]?.x
                                    const selectedCIF =
                                        sortedData[config.dataPointIndex]?.cif
                                    if (selectedCase && selectedCIF) {
                                        // Aquí pasamos tanto el 'cliente' como el 'cif' en la URL
                                        navigate(
                                            `/ingresos-por-cliente-desglosado?case=${encodeURIComponent(
                                                selectedCase,
                                            )}&cif=${encodeURIComponent(selectedCIF)}`,
                                        )
                                    }
                                },
                            },
                        },
                        labels: sortedData.map((item) => item.x) as string[],
                        colors: data.colors,
                        legend: {
                            position: 'bottom',
                            horizontalAlign: 'center',
                        },
                        title: {
                            text: 'Clientes según cif:',
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
                    series: sortedData.map((item) => item.y),
                })
            })
            .catch((error) => console.error('Error loading JSON data:', error))
    }, [cif, navigate])

    if (!chartData) {
        return <div>Loading...</div>
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <Chart
                options={chartData.options}
                series={chartData.series}
                height={590}
                type="pie"
            />
        </div>
    )
}

const Dashboard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GraficoPorCliente />
            <TiposDeCaso />
        </div>
    )
}

export default Dashboard
