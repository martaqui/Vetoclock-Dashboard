import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { useNavigate } from 'react-router-dom' // Para la navegación
import { COLOR_1 } from '@/constants/chart.constant'
import { ApexOptions } from 'apexcharts' // Importamos el tipo correcto

// Definimos el tipo para los elementos de los datos
interface DataItem {
    x: string // Año como string
    y: number // Casos (número)
}

// Definimos el tipo para los datos del gráfico
interface ChartData {
    series: {
        name: string
        data: number[]
    }[]
    options: ApexOptions // Usamos ApexOptions en lugar de un tipo manual
}

const CasosHistoricoAnual = () => {
    const [chartData, setChartData] = useState<ChartData | null>(null)
    const navigate = useNavigate() // Usamos el hook navigate para redirigir

    // Función que maneja el clic en el gráfico
    const handleClick = () => {
        navigate('/casos_historico_anual_mes_anio') // Redirige a la ruta deseada
    }

    useEffect(() => {
        fetch('/data/casos_por_anio.json')
            .then((response) => response.json())
            .then((data: { data: DataItem[] }) => {
                // Verifica que data.data exista y tenga elementos
                if (!data || !data.data || data.data.length === 0) {
                    console.error('No data available')
                    return
                }

                // Mapea los datos directamente, sin necesidad de traducir meses
                const labels = data.data.map((item) => item.x) // Usamos directamente el año
                const dataPoints = data.data.map((item) => item.y)

                // Verifica que las etiquetas y los valores estén correctamente mapeados
                console.log('Labels:', labels)
                console.log('Data points:', dataPoints)

                // Asignamos el estado con los datos procesados
                setChartData({
                    series: [
                        {
                            name: 'Casos por Año',
                            data: dataPoints,
                        },
                    ],
                    options: {
                        chart: {
                            type: 'line', // Especificamos el tipo de gráfico
                            zoom: {
                                enabled: false, // Desactivamos el zoom
                            },
                            events: {
                                // Evento de clic en el gráfico
                                click: handleClick,
                            },
                        },
                        colors: [COLOR_1],
                        fill: {
                            type: 'gradient',
                            gradient: {
                                shadeIntensity: 1,
                                opacityFrom: 0.7,
                                opacityTo: 0.9,
                                stops: [0, 80, 100],
                            },
                        },
                        dataLabels: {
                            enabled: false, // Desactivamos las etiquetas de datos
                        },
                        stroke: {
                            curve: 'smooth', // Hacemos que la línea sea suave
                            width: 3,
                        },
                        xaxis: {
                            categories: labels, // Usamos los años como etiquetas
                            type: 'category', // Eje X con categorías
                        },
                        yaxis: {
                            opposite: true, // Posicionamos el eje Y en el lado opuesto
                        },
                        legend: {
                            horizontalAlign: 'left', // Alineamos la leyenda a la izquierda
                        },
                    },
                })
            })
            .catch((error) => console.error('Error loading JSON data:', error))
    }, []) // Ya no dependemos de startDate ni endDate

    // Comprobamos si chartData ya está disponible antes de renderizar el gráfico
    if (!chartData) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h2 className="text-lg font-bold mb-4">Casos Históricos Anual</h2>
            <div onClick={handleClick}>
                {' '}
                {/* Añadimos el onClick al contenedor */}
                <Chart
                    options={chartData.options} // options ahora es seguro de usar
                    series={chartData.series} // series ahora es seguro de usar
                    type="area"
                    height={300}
                />
            </div>
        </div>
    )
}

export default CasosHistoricoAnual
