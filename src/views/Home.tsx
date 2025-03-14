import { useEffect, useState } from 'react'
import { Card, Segment } from '@/components/ui'
import Chart from 'react-apexcharts'

interface Cliente {
    x: string
    y: number
    porcentaje: number
}
interface Especialista {
    x: string
    y: number
    porcentaje: number
}
interface CaseItem {
    x: string | null
    y: number
}

interface ChartData {
    name: string
    data: number[]
}

const BasicLine = () => {
    const [data, setData] = useState<ChartData[]>([])

    useEffect(() => {
        fetch('/data/ventas_historicas.json')
            .then((response) => response.json())
            .then((json) => {
                const categorias = json.data.map(
                    (item: { x: string }) => item.x,
                ) // Extraemos los meses
                const valores = json.data.map((item: { y: number }) =>
                    parseFloat(item.y.toString()),
                ) // Convertimos los valores a números

                setData([
                    {
                        name: 'Ventas Históricas',
                        data: valores,
                    },
                ])

                // Configurar el gráfico con las categorías y los valores
                setOptions((prev) => ({
                    ...prev,
                    xaxis: {
                        categories: categorias,
                    },
                }))
            })
    }, [])

    const [options, setOptions] = useState<ApexCharts.ApexOptions>({
        chart: {
            type: 'line',
            zoom: {
                enabled: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        colors: ['#22C55E'], // Color rojo (puedes personalizarlo)
        xaxis: {
            categories: [], // Se actualizará con los datos
        },
    })

    return <Chart options={options} series={data} height={300} />
}

const CasosGraph = () => {
    const [data, setData] = useState<ChartData[]>([])

    useEffect(() => {
        fetch('/data/casos_por_anio.json')
            .then((response) => response.json())
            .then((json) => {
                const categorias = json.data.map(
                    (item: { x: string }) => item.x,
                ) // Extraemos los años
                const valores = json.data.map((item: { y: number }) => item.y) // Extraemos los casos

                setData([
                    {
                        name: 'Casos por Año',
                        data: valores,
                    },
                ])

                // Configurar el gráfico con las categorías y los valores
                setOptions((prev) => ({
                    ...prev,
                    xaxis: {
                        categories: categorias,
                    },
                }))
            })
    }, [])

    const [options, setOptions] = useState<ApexCharts.ApexOptions>({
        chart: {
            type: 'line',
            zoom: {
                enabled: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        colors: ['#3B82F6'], // Color verde (puedes personalizarlo)
        xaxis: {
            categories: [], // Se actualizará con los datos
        },
    })

    return <Chart options={options} series={data} height={300} />
}

const Home = () => {
    const [activeGraph, setActiveGraph] = useState<'ventas' | 'casos'>('ventas')
    const [topCases, setTopCases] = useState<CaseItem[]>([])
    const [topClientes, setTopClientes] = useState<Cliente[]>([])
    const [topEspecialistas, setTopEspecialistas] = useState<Especialista[]>([])

    useEffect(() => {
        fetch('/data/tipos_de_casos.json')
            .then((response) => response.json())
            .then((data: { data: CaseItem[] }) => {
                const sortedCases = data.data
                    .filter((item) => item.x !== null)
                    .sort((a, b) => b.y - a.y)
                setTopCases(sortedCases.slice(0, 3))
            })
            .catch((error) => console.error('Error loading JSON data:', error))

        // Cargar datos de clientes
        fetch('/data/ventasxcliente.json')
            .then((response) => response.json())
            .then((data: { data: CaseItem[] }) => {
                const clientesFiltrados: Cliente[] = data.data
                    .filter((item) => item.x !== null)
                    .map((item) => ({
                        x: item.x || 'Cliente Desconocido',
                        y: item.y,
                        porcentaje: 0, // Inicializamos con 0
                    }))

                // Ordenamos de mayor a menor
                const sortedClientes = clientesFiltrados.sort(
                    (a, b) => b.y - a.y,
                )

                // Calculamos el total de ventas
                const totalVentas = sortedClientes.reduce(
                    (sum, item) => sum + item.y,
                    0,
                )

                // Asignamos los porcentajes correctos
                const clientesConPorcentaje = sortedClientes.map((cliente) => ({
                    ...cliente,
                    porcentaje:
                        totalVentas > 0 ? (cliente.y / totalVentas) * 100 : 0,
                }))

                // Tomamos solo los 3 clientes con mayor porcentaje
                setTopClientes(clientesConPorcentaje.slice(0, 3))
            })
            .catch((error) => console.error('Error loading JSON data:', error))
        fetch('/data/costesxespecialista.json')
            .then((response) => response.json())
            .then((data: { data: Especialista[] }) => {
                const especialistasFiltrados: Especialista[] = data.data.map(
                    (item) => ({
                        x: item.x,
                        y: item.y,
                        porcentaje: 0, // Inicializamos en 0
                    }),
                )

                // Obtener la suma total de costos de todos los especialistas
                const totalCostes = especialistasFiltrados.reduce(
                    (sum, item) => sum + item.y,
                    0,
                )

                // Calcular el porcentaje correctamente
                const especialistasConPorcentaje = especialistasFiltrados.map(
                    (especialista) => ({
                        ...especialista,
                        porcentaje:
                            totalCostes > 0
                                ? (especialista.y / totalCostes) * 100
                                : 0,
                    }),
                )

                // Ordenar de mayor a menor y seleccionar los 3 primeros
                setTopEspecialistas(
                    especialistasConPorcentaje
                        .sort((a, b) => b.y - a.y)
                        .slice(0, 3),
                )
            })
            .catch((error) =>
                console.error('Error cargando especialistas:', error),
            )

        // 👈 Se cierra correctamente el `useEffect`
    }, [])

    return (
        <div className="relative">
            {/* Main grid container */}
            <div className="grid grid-cols-4 gap-4 md:h-[500px]">
                {/* Chart Section - Takes Full Height */}
                <div className="col-span-4 md:col-span-3">
                    <Card bordered={false} className="flex flex-col">
                        <div className="grid grid-rows-5 gap-4">
                            <Segment className="gap-4 md:flex-row flex-col h-full">
                                <Segment.Item
                                    value="left"
                                    className="md:w-1/2 h-full"
                                >
                                    <div
                                        className="flex w-100 h-100 cursor-pointer"
                                        onClick={() => setActiveGraph('ventas')}
                                    >
                                        Total ventas
                                    </div>
                                </Segment.Item>
                                <Segment.Item
                                    value="right"
                                    className="md:w-1/2 h-full"
                                >
                                    <div
                                        className="flex w-100 h-100 cursor-pointer"
                                        onClick={() => setActiveGraph('casos')}
                                    >
                                        Total casos
                                    </div>
                                </Segment.Item>
                            </Segment>
                            <div className="row-span-4 flex-1">
                                {activeGraph === 'casos' ? (
                                    <CasosGraph />
                                ) : (
                                    <BasicLine />
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Cases List - Takes Full Height */}
                <div className="col-span-4 md:col-span-1 h-full">
                    <Card bordered={false} className="h-full flex flex-col">
                        <div className="flex justify-between items-center">
                            <h5>Top Casos</h5>
                            <a
                                href="/tipos-de-caso"
                                className="text-blue-500 hover:underline"
                            >
                                Ver todos
                            </a>
                        </div>
                        <hr />
                        <div className="flex-1 flex flex-col justify-between mt-4">
                            <div className="casos">
                                <div className="caso1 space-y-6">
                                    {topCases.map((caseItem, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-2"
                                        >
                                            <img
                                                src="/img/others/vet.png"
                                                alt={`Caso ${index + 1}`}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <span>{`Caso ${index + 1}: ${caseItem.x}`}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* New "Top Clientes" section */}
            <div className="w-full mt-8">
                <Card bordered={false}>
                    <div className="flex justify-between items-center">
                        <h5>Top Clientes</h5>
                        <a
                            href="ventas-por-cliente"
                            className="text-blue-500 hover:underline"
                        >
                            Ver todos
                        </a>
                    </div>
                    <div className="clientes mt-6 space-y-6">
                        {topClientes.map((cliente, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2 w-full"
                            >
                                <img
                                    src="/img/others/clienticon.png"
                                    alt={`Cliente ${index + 1}`}
                                    className="w-10 h-10 rounded-full"
                                />
                                <span>{cliente.x}</span>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500"
                                        style={{
                                            width: `${cliente.porcentaje}%`,
                                        }}
                                    ></div>
                                </div>
                                <span className="ml-2 text-sm">
                                    {cliente.porcentaje.toFixed(1)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            <div className="w-full mt-8">
                <Card bordered={false}>
                    <div className="flex justify-between items-center">
                        <h5>Top Especialistas</h5>
                        <a
                            href="/especialistas'"
                            className="text-blue-500 hover:underline"
                        >
                            Ver todos
                        </a>
                    </div>
                    <div className="especialistas mt-6 space-y-6">
                        {topEspecialistas.map((especialista, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2 w-full"
                            >
                                <span>{especialista.x}</span>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500"
                                        style={{
                                            width: `${especialista.porcentaje}%`,
                                        }}
                                    ></div>
                                </div>
                                <span className="ml-2 text-sm">
                                    {especialista.porcentaje.toFixed(1)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Home
