from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from geopy.distance import geodesic
import json
import sys

def create_data_model(locations):
    """Crea la estructura de datos del problema."""
    data = {}
    data["locations"] = locations
    data["num_vehicles"] = 1
    data["depot"] = 0  # El punto de inicio
    return data

def compute_euclidean_distance_matrix(locations):
    """Calcula la matriz de distancia geodésica entre los puntos."""
    size = len(locations)
    distance_matrix = {}

    for from_index in range(size):
        distance_matrix[from_index] = {}
        for to_index in range(size):
            if from_index == to_index:
                distance_matrix[from_index][to_index] = 0
            else:
                distance_matrix[from_index][to_index] = int(geodesic(locations[from_index], locations[to_index]).meters)

    return distance_matrix

def solve_vrp(locations):
    """Resuelve el problema de ruta óptima (VRP) con OR-Tools."""
    data = create_data_model(locations)
    distance_matrix = compute_euclidean_distance_matrix(data["locations"])

    # Crear el gestor de índices
    manager = pywrapcp.RoutingIndexManager(len(distance_matrix), data["num_vehicles"], data["depot"])

    # Crear el modelo de ruteo
    routing = pywrapcp.RoutingModel(manager)

    def distance_callback(from_index, to_index):
        """Callback para devolver la distancia entre nodos."""
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return distance_matrix[from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)

    # Definir el costo (distancia) del viaje
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    # Configurar los parámetros de búsqueda
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC

    # Resolver el problema
    solution = routing.Solve()

    if solution:
        return get_solution(manager, routing, solution, data["locations"])
    else:
        return {"error": "No se encontró una solución óptima"}

def get_solution(manager, routing, solution, locations):
    """Obtiene la solución de OR-Tools y calcula distancia y tiempo."""
    index = routing.Start(0)
    route = []
    total_distance = 0

    while not routing.IsEnd(index):
        node_index = manager.IndexToNode(index)
        route.append(node_index)
        previous_index = index
        index = solution.Value(routing.NextVar(index))

        # Calcular distancia total
        if not routing.IsEnd(index):
            from_node = manager.IndexToNode(previous_index)
            to_node = manager.IndexToNode(index)
            total_distance += geodesic(locations[from_node], locations[to_node]).meters

    # Regresar al punto inicial
    route.append(route[0])
    total_distance += geodesic(locations[route[-2]], locations[route[-1]]).meters

    # Calcular tiempo estimado (suponiendo 40 km/h)
    velocidad_kmh = 40
    tiempo_estimado_minutos = (total_distance / 1000) / velocidad_kmh * 60

    return {
        "optimized_route": route,
        "total_distance_meters": round(total_distance, 2),
        "estimated_time_minutes": round(tiempo_estimado_minutos, 2)
    }

if __name__ == "__main__":
    try:
        input_json = json.loads(sys.argv[1])
        locations = input_json["locations"]
        result = solve_vrp(locations)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
