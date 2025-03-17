import { useEffect, useState } from 'react'

interface Especialista {
    x: string
    y: number
    porcentaje?: number
}

const Especialistas = () => {
    const [especialistas, setEspecialistas] = useState<Especialista[]>([])

    useEffect(() => {
        fetch('/data/costesxespecialista.json')
            .then((response) => response.json())
            .then((data: { data: Especialista[] }) => {
                // Sumar el coste total de todos los especialistas
                const totalCostes = data.data.reduce(
                    (sum, item) => sum + item.y,
                    0,
                )

                // Calcular el porcentaje basado en el total
                const especialistasConPorcentaje = data.data.map(
                    (especialista) => ({
                        ...especialista,
                        porcentaje:
                            totalCostes > 0
                                ? (especialista.y / totalCostes) * 100
                                : 0,
                    }),
                )

                // Guardar los datos en el estado
                setEspecialistas(especialistasConPorcentaje)
            })
            .catch((error) =>
                console.error('Error cargando especialistas:', error),
            )
    }, [])

    return (
        <div className="w-full mt-8 p-6 bg-white shadow rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-bold">Costes especialistas</h1>
                <hr />
            </div>
            <div className="space-y-4">
                {especialistas.map((especialista, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <span className="w-40 truncate">{especialista.x}</span>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500"
                                style={{
                                    width: `${especialista.porcentaje}%`,
                                }}
                            ></div>
                        </div>
                        <span className="ml-2 text-sm whitespace-nowrap">
                            {especialista.y.toLocaleString()}€ (
                            {especialista.porcentaje?.toFixed(2)}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Especialistas
