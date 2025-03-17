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

interface AsignadoItem {
    asignado_nombre: string
    total_casos: string
    tiempo_medio_horas: string
}

const Home = () => {
    const [topClientes, setTopClientes] = useState<Cliente[]>([])
    const [topAsignados, setTopAsignados] = useState<AsignadoItem[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch de asignados
                const asignadosResponse = await fetch(
                    '/data/tiempo_medio_respuesta.json',
                )
                const asignadosData: AsignadoItem[] =
                    await asignadosResponse.json()
                console.log('Asignados:', asignadosData) // Verifica los datos

                // Tomar los 6 primeros asignados
                const sortedAsignados = asignadosData.slice(0, 6)
                setTopAsignados(sortedAsignados)

                // Fetch de clientes
                const clientesResponse = await fetch(
                    '/data/ventasxcliente.json',
                )
                const clientesData = await clientesResponse.json()
                console.log('Clientes:', clientesData) // Verifica los datos

                // Filtrar y organizar los datos de clientes
                const clientesFiltrados = clientesData.data
                    .filter(
                        (item: { x: string | null; y: number }) =>
                            item.x !== null,
                    )
                    .map((item: { x: string; y: number }) => ({
                        x: item.x || 'Cliente Desconocido',
                        y: item.y,
                        porcentaje: 0, // Inicializamos con 0
                    }))

                const sortedClientes = clientesFiltrados.sort(
                    (a: Cliente, b: Cliente) => b.y - a.y, // Aseguramos que b.y y a.y son números
                )

                const totalVentas = sortedClientes.reduce(
                    (sum: number, item: Cliente) => sum + item.y, // Especificamos que sum y item.y son números
                    0,
                )

                const clientesConPorcentaje = sortedClientes.map(
                    (cliente: Cliente) => ({
                        ...cliente,
                        porcentaje:
                            totalVentas > 0
                                ? (cliente.y / totalVentas) * 100
                                : 0,
                    }),
                )

                setTopClientes(clientesConPorcentaje.slice(0, 3))
            } catch (error) {
                console.error('Error loading JSON data:', error)
            }
        }

        fetchData()
    }, []) // Solo ejecutamos este useEffect una vez al montar el componente

    return (
        <div className="relative">
            <div className="grid grid-cols-4 gap-4 md:h-[500px]">
                <div
                    className="col-span-4 md:col-span-3 overflow-auto"
                    style={{ maxHeight: '600px' }}
                >
                    <Card bordered={false} className="flex flex-col p-0">
                        <div className="grid grid-rows-3 gap-2">
                            <div className="mb-4">
                                <h3>Casos</h3>
                                <TotalCasosHome />
                            </div>
                            <div className="mb-4">
                                <h3>Ingresos</h3>
                                <TotalVentasHome />
                            </div>
                            <div className="mb-4">
                                <h3>Costes</h3>
                                <TotalCostesHome />
                            </div>
                            <div className="mb-4">
                                <h3>Margen</h3>
                                <TotalMargenHome />
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-span-4 md:col-span-1 h-full">
                    <Card bordered={false} className="h-full flex flex-col">
                        <div className="flex justify-between items-center">
                            <h5>Tiempo de respuesta</h5>
                            <a
                                href="/tiempo-de-respuesta"
                                className="text-blue-500 hover:underline"
                            >
                                Ver todos
                            </a>
                        </div>
                        <hr />
                        <div className="flex-1 flex flex-col justify-between mt-4">
                            <div className="casos">
                                <div className="caso1 space-y-6">
                                    {topAsignados.map((asignado, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-2 mt-4"
                                        >
                                            <span>{` ${asignado.asignado_nombre}`}</span>
                                            <span className="ml-2 text-sm">
                                                {asignado.tiempo_medio_horas}{' '}
                                                hrs
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

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
        </div>
    )
}

export default Home
