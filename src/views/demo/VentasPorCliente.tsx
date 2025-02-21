import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

interface Venta {
    x: string | null
    y: number
}

interface VentasPorClienteData {
    data: Venta[]
    colors: string[]
}

const VentasPorCliente = () => {
    const [chartData, setChartData] = useState<{
        options: ApexOptions
        series: number[]
        labels: string[]
    } | null>(null)

    const navigate = useNavigate()

    useEffect(() => {
        fetch('/data/ventasxcliente1.json')
            .then((response) => response.json())
            .then((data: VentasPorClienteData) => {
                const labels = data.data
                    .map((item) => item.x)
                    .filter((label): label is string => label !== null)
                const series = data.data.map((item) => item.y)

                setChartData({
                    options: {
                        chart: {
                            type: 'pie',
                            events: {
                                dataPointSelection: (
                                    event,
                                    chartContext,
                                    config,
                                ) => {
                                    const selectedIndex = config.dataPointIndex
                                    const selectedClient = labels[selectedIndex]
                                    console.log(
                                        'Cliente seleccionado:',
                                        selectedClient,
                                    )
                                    setTimeout(() => {
                                        navigate(
                                            `/ventas_por_cliente_en_concreto/${selectedClient}`,
                                        )
                                    }, 100)
                                },
                            },
                        },
                        labels: labels,
                        colors: data.colors,
                        plotOptions: {
                            pie: {
                                expandOnClick: true,
                                customScale: 1.1,
                                donut: {
                                    size: '0%',
                                },
                            },
                        },
                        tooltip: {
                            theme: 'dark',
                            style: {
                                fontSize: '14px',
                            },
                            fillSeriesColor: false,
                            marker: {
                                show: true,
                            },
                        },
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
                        },
                    },
                    series: series,
                    labels: labels,
                })
            })
            .catch((error) => console.error('Error loading JSON data:', error))
    }, [navigate])

    if (!chartData) {
        return <div className="text-center text-lg">Cargando...</div>
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

export default VentasPorCliente
