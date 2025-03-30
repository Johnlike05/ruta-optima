import { injectable } from "inversify";
import { DEPENDENCY_CONTAINER } from "../../../configuration/DependecyContainer";
import { IEquipoIn } from "../data/in/IEquipoIn";
import { TYPESDEPENDENCIES } from "@/configuration/TypesDependencies";
import { PgEnvioRepository } from "@/core/infrastructure/bd/repositories/PgEnvioRepository";
import { PgRutaRepository } from "@/core/infrastructure/bd/repositories/PgRutaRepository";
import { GeolocalizarService } from "./GeolocalizarService";
import { PuntoRuta, RespuestaPythonOrden, Ruta } from "@/core/domain/entities/Ruta";
import { PgRepartidorRepository } from "@/core/infrastructure/bd/repositories/PgRepartidorRepository";
import { exec } from "child_process";
import { OSRMAdapter } from "@/core/infrastructure/externalServices/OSRMAdapter";
import { PgEventoRepository } from "@/core/infrastructure/bd/repositories/PgEventoRepository";
@injectable()
export class CalcularRutasAppService {
  private rutaRepository = DEPENDENCY_CONTAINER.get<PgRutaRepository>(
    TYPESDEPENDENCIES.IRutaRepository
  );
  private repartidorRepository = DEPENDENCY_CONTAINER.get<PgRepartidorRepository>(
    TYPESDEPENDENCIES.IRepartidorRepository
  );
  private envioRepository = DEPENDENCY_CONTAINER.get<PgEnvioRepository>(
    TYPESDEPENDENCIES.IEnvioRepository
  );
  private entregarMasiva = DEPENDENCY_CONTAINER.get(GeolocalizarService);

  private eventoRepository = DEPENDENCY_CONTAINER.get<PgEventoRepository>(
    TYPESDEPENDENCIES.IEventoRepository
  );
  async rutaOptima(data: IEquipoIn): Promise<Ruta | null> {
    try {
        const repartidorRuta = await this.rutaRepository.consultarRutaDiaria(data.id_repartidor);
        if (repartidorRuta) {
            return await this.rutaRepository.obtenerRutaPorId(repartidorRuta);
        }
        const infoRepartidor = await this.repartidorRepository.buscarPorId(data.id_repartidor)

        const envios = await this.envioRepository.listarPorRepartidor(data.id_repartidor);
        if (envios.length === 0 || infoRepartidor ===null) return null;
        const puntoInicial:PuntoRuta = {    
            latitud: infoRepartidor.latitud_actual ?? 4.755364,
            longitud: infoRepartidor.longitud_actual ?? -74.132615,
            tiempoEstimado: 0,
            direccion: infoRepartidor.direccion_base ?? 'km 1.5 vía Parcelas, Cota, Cundinamarca'
        }
        const direcciones = envios.map(envio => `${envio.direccion_destino} ${envio.ciudad_destino}`);
        const coordenadasArray = await this.entregarMasiva.getCoordinatesArray(direcciones)
        const puntosRuta: PuntoRuta[] = coordenadasArray.map((coordenadas, i) => coordenadas && coordenadas.latitud !== 0
                ? { latitud: coordenadas.latitud, longitud: coordenadas.longitud, tiempoEstimado: 1, direccion: direcciones[i] }
                : null
            )
            .filter(punto => punto !== null) as PuntoRuta[];

        if (puntosRuta.length === 0) return null;
        puntosRuta.unshift(puntoInicial)
        const puntos = puntosRuta.map(p => ({ latitud: p.latitud, longitud: p.longitud }));
        const ordenPuntos = await this.calcularRutaOptimizada(puntos);
        const arrayOrdenado = this.reorderPoints(puntosRuta, ordenPuntos.optimized_route);
        //se puede consultar mas a detalle el tiempo y los km pero consume mucho tiempo
        return await this.rutaRepository.crearRuta(data.id_repartidor, arrayOrdenado, ordenPuntos.total_distance_meters, ordenPuntos.estimated_time_minutes);
    } catch (error) {
        console.error("Error No se pudo consultar la ruta", error);
        return null;
    }
}

  async calcularRutaOptimizada(puntos: { latitud: number; longitud: number }[]):Promise<RespuestaPythonOrden> {
    return new Promise((resolve, reject) => {
        const locations = puntos.map(p => [p.latitud, p.longitud]);
        const inputData = JSON.stringify({ locations });

        console.log('📤 Enviando a Python:', inputData);
        
        const command = `python3 solver.py '${inputData}'`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error("❌ Error ejecutando OR-Tools:", error);
                reject(error);
                return;
            }
            if (stderr) {
                console.error("⚠️ Error en el script de Python:", stderr);
                reject(stderr);
                return;
            }

            console.log("📥 Respuesta cruda de Python:", stdout.trim()); // Log para ver salida exacta

            try {
                const jsonStartIndex = stdout.indexOf("{"); // Buscar el inicio del JSON
                if (jsonStartIndex !== -1) {
                    const jsonString = stdout.slice(jsonStartIndex).trim(); // Extraer solo el JSON
                    const result = JSON.parse(jsonString);
                    resolve(result);
                } else {
                    throw new SyntaxError("No se encontró JSON en la respuesta de Python");
                }
            } catch (parseError) {
                console.error("❌ Error parseando respuesta de Python:", parseError);
                reject(parseError);
            }
        });
    });
}
 async detalleRuta(coordenadas: { latitud: number; longitud: number }[]) {
    const routeData = await OSRMAdapter.getRutaOSRM(coordenadas);
    if (!routeData || !routeData.routes || routeData.routes.length === 0) return null;

    const route = routeData.routes[0];
    return {
        total_distance_km: (route.distance / 1000).toFixed(2),
        estimated_time_minutes: (route.duration / 60).toFixed(2),
    };
}
reorderPoints(puntos: PuntoRuta[], optimizedRoute: number[]) {
    return optimizedRoute.map(index => puntos[index]);
  }

async recalcularRuta(data: IEquipoIn): Promise<string | null> {
    try {
        const repartidorRuta = await this.rutaRepository.consultarRutaDiaria(data.id_repartidor);
        if (repartidorRuta) {
            const eventos = await this.eventoRepository.consultarEventoByRuta(repartidorRuta)
            if (eventos.length>0) {
                const tiempoTotal = eventos.reduce((total, evento) => total + evento.tiempo_estimado, 0);
                const idsEventos = eventos.map(evento => evento.id_evento);
                await this.rutaRepository.agregarTiempoRuta(tiempoTotal, repartidorRuta)
                await this.eventoRepository.marcarEventosCompletados(idsEventos)
                return 'Eventos agregados a la ruta'
            }
            return 'No hay eventos pendientes por recalcular'
        }else {
            return 'No se encontro ruta actual para el repartidor enviado'
        }
    } catch (error) {
        console.error("Error No se pudo consultar la ruta", error);
        return null;
    }
}

  
}
