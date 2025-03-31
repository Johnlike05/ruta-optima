import { exec } from "child_process";

const locations = [
  [4.670794, -74.064495], // Punto de inicio
  [4.612167, -74.115853],
  [4.635067, -74.079312],
  [4.681597, -74.039197],
  [4.669723, -74.044414],
];

// Convertimos los datos a JSON para pasarlos a Python
const inputData = JSON.stringify({ locations });

const command = `python3 solver.py '${inputData}'`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error("❌ Error ejecutando OR-Tools:", error);
    return;
  }
  if (stderr) {
    console.error("⚠️ Error en el script de Python:", stderr);
    return;
  }
  try {
    const result = JSON.parse(stdout);
    console.log("✅ Ruta optimizada:", result);
  } catch (parseError) {
    console.error("❌ Error parseando respuesta de Python:", parseError);
  }
});
