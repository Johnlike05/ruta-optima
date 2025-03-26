export const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'local';

export const GCP_PROJECT = process.env.GCP_PROJECT;
export const GCP_PROJECT_ENTREGAS = process.env.GCP_PROJECT_ENTREGAS;
export const GCP_PROJECT_LEGALIZACION = process.env.GCP_PROJECT_LEGALIZACION;
console.log(GCP_PROJECT_ENTREGAS);

export const PREFIX = `/${process.env.DOMAIN}/${process.env.SERVICE_NAME}`;
console.log(PREFIX);

export const HOST = process.env.HOST || 'localhost';

export const URL_LIQUIDACION_GUIA =
    process.env.URL_LIQUIDACION_GUIA || 'https://api.coordinadora.com/cm-informacion-factura-guia-test/api/v1/';

export const URL_ELIMINAR_GUIA =
    process.env.URL_ELIMINAR_GUIA || 'https://apiv2-test.coordinadora.com/reparto/cm-eliminar-guias-asignadas-ms/guias';

export const URL_REGISTRAR_NOVEDAD =
    process.env.URL_REGISTRAR_NOVEDAD || 'https://apiv2-test.coordinadora.com/nys/cm-nys-entregas-ms/novedades';

console.log(PREFIX);
