import "reflect-metadata";
import { IDatabase, IMain } from "pg-promise";
import {
  createDependencyContainer,
  DEPENDENCY_CONTAINER,
} from "../src/configuration/DependecyContainer";
import { TYPESDEPENDENCIES } from "../src/configuration/TypesDependencies";
import { application } from "../src/app";
import { crearDB } from "./crear-pg-mem";

describe("pruebas unitarias a endpoints", () => {
  const db = crearDB();
  let token: string;
  beforeAll(async () => {
    createDependencyContainer();
    DEPENDENCY_CONTAINER.unbind(TYPESDEPENDENCIES.bdRutas);
    DEPENDENCY_CONTAINER.bind<IDatabase<IMain>>(
      TYPESDEPENDENCIES.bdRutas
    ).toConstantValue(db);
    const loginResponse = await application.inject({
      method: "GET",
      url: `${process.env.PREFIX_URL}/generar_token`,
    });
    const loginResult = await loginResponse.json();
    token = loginResult.token;
  });
  it("Deberia devolver una ruta para el repartidor 555 en la bd", async () => {
    const response = await application.inject({
      method: "GET",
      url: `${process.env.PREFIX_URL}/calcular_ruta_optima/555`,
      headers: {
        Authorization: `Bearer ${token}`
    }
    });
    // const result = await response.json();
    const result = await response.json();
    expect(result.puntos.length).toBeGreaterThan(0);
    expect(response.statusCode).toEqual(200);
  });

  it("Deberia devolver una ruta para el repartidor 321 lo crea nuevo", async () => {
    const response = await application.inject({
      method: "GET",
      url: `${process.env.PREFIX_URL}/calcular_ruta_optima/321`,
      headers: {
        Authorization: `Bearer ${token}`
    }
    });
    // const result = await response.json();
    const result = await response.json();
    expect(result.puntos.length).toBeGreaterThan(0);
    expect(response.statusCode).toEqual(200);
  });
});
