import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'
import DatePickerComponent from './DatePickerComponent/DatePickerComponent'

interface VentasItem {
    empresa: string
    fecha: string
    importe: number
}

const VentasPorClienteDesglosado = () => {
    const location = useLocation()
    const [chartData, setChartData] = useState<
        { name: string; data: number[] }[]
    >([])
    const [categories, setCategories] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)

    // Obtener 'case' y 'cif' desde la URL
    const params = new URLSearchParams(location.search)
    const cliente = params.get('case')
    const cif = params.get('cif')

    useEffect(() => {
        if (!cliente || !cif) return

        // Realizamos la solicitud al JSON de ventas
        fetch('/data/ventasxclinicaconcreta.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud al servidor')
                }
                return response.json()
            })
            .then((data: VentasItem[]) => {
                // Verificamos si data existe
                if (!data || data.length === 0) {
                    console.error(
                        'No se encontraron datos en la respuesta',
                        data,
                    )
                    setLoading(false)
                    return
                }

                // Filtramos los datos para el cliente seleccionado
                const filteredData = data.filter(
                    (item) => item.empresa === cliente,
                )

                // Comprobamos si hay datos filtrados
                if (filteredData.length === 0) {
                    console.error(
                        'No se encontraron datos para el cliente:',
                        cliente,
                    )
                    setLoading(false)
                    return
                }

                // Filtrar por fechas si se seleccionaron
                const filteredByDate = filteredData.filter((item) => {
                    const itemDate = new Date(item.fecha)
                    return (
                        (!startDate || itemDate >= startDate) &&
                        (!endDate || itemDate <= endDate)
                    )
                })

                // Estructuramos los datos para el gráfico
                setCategories(filteredByDate.map((item) => item.fecha))
                setChartData([
                    {
                        name: 'Ventas',
                        data: filteredByDate.map((item) => item.importe),
                    },
                ])
                setLoading(false)
            })
            .catch((error) => {
                console.error('Error loading JSON data:', error)
                setLoading(false)
            })
    }, [cliente, cif, startDate, endDate]) // Asegurarnos de que se recargue cuando cambie el cliente, cif o las fechas

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-700 mb-4">
                Ventas Por Cliente Desglosado: {cliente} ({cif})
            </h1>

            {/* Añadir DatePickerComponent aquí */}
            <DatePickerComponent
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
            />

            {/* Mostrar el gráfico solo si los datos están cargados */}
            {loading ? (
                <div>Loading...</div>
            ) : chartData.length === 0 ? (
                <div>No data available for the selected client</div>
            ) : (
                <Chart
                    options={{
                        chart: {
                            type: 'line',
                            zoom: { enabled: false },
                        },
                        colors: COLORS, // Usamos el array de colores de la constante
                        dataLabels: { enabled: false },
                        stroke: {
                            width: 3,
                            curve: 'smooth',
                            dashArray: [0],
                        },
                        xaxis: {
                            categories: categories, // Asignamos las fechas como categorías
                        },
                        tooltip: {
                            y: {
                                formatter: (val: number) => `${val} EUR`, // Formato para mostrar el importe
                            },
                        },
                        grid: { borderColor: '#f1f1f1' },
                    }}
                    series={chartData}
                    height={300}
                />
            )}
        </div>
    )
}

export default VentasPorClienteDesglosado
