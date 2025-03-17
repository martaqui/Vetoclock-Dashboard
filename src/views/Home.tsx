import { useEffect, useState } from 'react'
import { Card } from '@/components/ui'
import TotalCasosHome from './demo/TotalCasosHome'
import TotalVentasHome from './demo/TotalVentasHome'
import TotalMargenHome from './demo/TotalMargenHome'
import TotalCostesHome from './demo/TotalCostesHome'

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

const Home = () => {
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
    }, [])

    return (
        <div className="relative">
            {/* Main grid container */}
            <div className="grid grid-cols-4 gap-4 md:h-[500px]">
                {/* Chart Section - Takes Full Height */}
                <div
                    className="col-span-4 md:col-span-3 overflow-auto"
                    style={{ maxHeight: '600px' }}
                >
                    <Card bordered={false} className="flex flex-col p-0">
                        <div className="grid grid-rows-3 gap-2">
                            {' '}
                            {/* Ajustar la distancia entre las filas */}
                            {/* Gráfico Total Casos */}
                            <div className="mb-4">
                                {' '}
                                {/* Reducción del margen entre gráficos */}
                                <h3>Casos</h3>
                                <TotalCasosHome />
                            </div>
                            {/* Gráfico Ventas Históricas */}
                            <div className="mb-4">
                                <h3>Ingresos</h3>
                                <TotalVentasHome />
                            </div>
                            {/* Gráfico Margen */}
                            <div className="mb-4">
                                <h3>Margen</h3>
                                <TotalMargenHome />
                            </div>
                            <div className="mb-4">
                                <h3>Costes</h3>
                                <TotalCostesHome />
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
                            href="/single-menu-view"
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
