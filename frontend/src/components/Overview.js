import React from "react";
import { Typography, Box } from "@mui/material";

const Overview = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Speech Record es una aplicación para grabar audios asociados a frases personalizadas. Estos audios pueden usarse para entrenar una inteligencia artificial (como Whisper) en reconocimiento del habla. Cada usuario puede gestionar frases según sus necesidades.
      </Typography>
      <Typography variant="h5" gutterBottom>
        Funcionalidades
      </Typography>
      <Box sx={{ mt: 2 }}>
        <ul>
          <li>
            <Typography variant="body1">
              <strong>List:</strong> Permite ver el estado de cada frase, añadir o borrar frases y audios asociados, y validarlas. También puedes gestionar las frases existentes de manera sencilla.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Record:</strong> Graba audios asociados a cada frase. Usa el ratón o los atajos de teclado:
              <ul>
                <li><strong>E:</strong> Escuchar la frase.</li>
                <li><strong>Espacio:</strong> Iniciar y parar la grabación.</li>
                <li><strong>P:</strong> Reproducir la grabación.</li>
                <li><strong>U:</strong> Subir la grabación al servidor y pasar a la siguiente frase.</li>
              </ul>
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Add Multiple Phrases:</strong> Permite añadir múltiples frases a la vez usando un archivo JSON. En esta sección encontrarás un ejemplo para guiarte.
            </Typography>
          </li>
        </ul>
      </Box>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Este dashboard está desarrollado con React y diseñado para que gestiones tus tareas de forma eficiente y hagas un seguimiento del progreso. Explora las opciones en el menú para empezar.
      </Typography>
    </Box>
  );
};

export default Overview;
