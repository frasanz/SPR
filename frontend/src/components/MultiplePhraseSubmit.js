import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";

const MultiplePhraseSubmit = () => {
    const [jsonInput, setJsonInput] = useState(""); // For JSON input
    const [error, setError] = useState(""); // To handle JSON parsing errors

    const handleSubmit = async () => {
        try {
            // Validate and parse the JSON
            const parsedJson = JSON.parse(jsonInput);

            // Make an Axios POST request
            const response = await axios.post("/add-multiple-phrases/", parsedJson);

            // Handle success
            console.log("Phrases submitted successfully:", response.data);

            // Clear input
            setJsonInput("");
            setError(""); // Clear any previous errors
        } catch (err) {
            // Handle JSON parsing errors or submission errors
            setError("Invalid JSON. Please check your input.");
            console.error("Error submitting phrases:", err);
        }
    };

    return (
        <Box sx={{}}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                You can submit multiple phrases at once using JSON.
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    label="Enter JSON"
                    variant="outlined"
                    multiline
                    rows={10}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    error={!!error}
                    helperText={error}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={!jsonInput.trim()}
                >
                    Submit JSON
                </Button>
                <Box sx={{ mt: 2, p: 2, border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#f9f9f9" }}>
                    <Typography variant="body1">
                        Example JSON:
                    </Typography>
                    <Typography variant="body2" component="pre" sx={{ whiteSpace: "pre-wrap" }}>
                        {`[
    {"text": "¡Mira este dibujo!"},
    {"text": "Tengo hambre."},
    {"text": "¿Jugamos un rato?"},
    {"text": "Es mi turno ahora."},
    {"text": "¡Qué divertido es esto!"},
    {"text": "Quiero un helado."},
    {"text": "Hoy es mi día favorito."},
    {"text": "¿Dónde está mi mochila?"},
    {"text": "Me gusta mucho este juego."},
    {"text": "¿Puedo salir a jugar?"},
    {"text": "Ya terminé mis deberes."},
    {"text": "Este libro es muy interesante."},
    {"text": "No entiendo este problema."},
    {"text": "¿Me ayudas con esto?"},
    {"text": "Hoy aprendí algo nuevo."},
    {"text": "¡Es mi juguete favorito!"},
    {"text": "¿Puedes leerme un cuento?"},
    {"text": "Me gusta mucho la pizza."},
    {"text": "¿Qué vamos a cenar?"},
    {"text": "Mi color favorito es el azul."},
    {"text": "Quiero ir al parque."},
    {"text": "Hoy hice un nuevo amigo."},
    {"text": "¡Mira cómo salto!"},
    {"text": "Voy a dibujar un animal."},
    {"text": "No quiero ir a la cama."},
    {"text": "¿Dónde está mi cepillo de dientes?"},
    {"text": "Quiero ver una película."},
    {"text": "¿Puedo tener más agua, por favor?"},
    {"text": "Esto es muy fácil."},
    {"text": "Estoy muy emocionado."},
    {"text": "¡Mira qué rápido corro!"},
    {"text": "Hoy aprendí a sumar."},
    {"text": "Me encanta este juguete."},
    {"text": "Quiero una mascota."},
    {"text": "¿Qué vamos a hacer mañana?"},
    {"text": "¿Cuánto falta para la merienda?"},
    {"text": "Hoy tengo educación física."},
    {"text": "Quiero dibujar un castillo."},
    {"text": "¿Dónde está mi pelota?"},
    {"text": "Voy a construir algo con bloques."},
    {"text": "Quiero ir a la piscina."},
    {"text": "Este es mi coche de juguete."},
    {"text": "Me gusta mucho jugar al fútbol."},
    {"text": "¿Puedo tener otro lápiz?"},
    {"text": "Voy a aprender algo nuevo hoy."},
    {"text": "Este es mi superhéroe favorito."},
    {"text": "Hoy hay muchos pájaros."},
    {"text": "¡Qué bonito está el cielo!"},
    {"text": "Voy a escribir una historia."},
    {"text": "¿Qué hora es?"},
    {"text": "Me gusta escuchar música."},
    {"text": "Quiero aprender a nadar."},
    {"text": "Voy a colorear este dibujo."},
    {"text": "¿Puedo llevar mi pelota?"},
    {"text": "Hoy aprendí una palabra nueva."},
    {"text": "Este es mi dinosaurio favorito."},
    {"text": "Voy a pintar un arcoíris."},
    {"text": "¿Podemos ir al zoo?"},
    {"text": "Me encanta ir al parque."},
    {"text": "Este helado está delicioso."},
    {"text": "Voy a saltar muy alto."},
    {"text": "Hoy hace mucho calor."},
    {"text": "Quiero hacer un rompecabezas."},
    {"text": "¿Puedo invitar a mi amigo a jugar?"},
    {"text": "Hoy vi una mariposa."},
    {"text": "Voy a hacer una torre muy alta."},
    {"text": "Quiero aprender a andar en bici."},
    {"text": "Este es mi mejor amigo."},
    {"text": "Voy a correr más rápido."},
    {"text": "Me encanta este chocolate."},
    {"text": "¿Qué hay para almorzar?"},
    {"text": "Voy a ganar este juego."},
    {"text": "Hoy quiero aprender algo nuevo."},
    {"text": "Voy a contar hasta diez."},
    {"text": "¿Dónde está mi gorra?"},
    {"text": "Quiero jugar con mi hermana."},
    {"text": "Voy a hacer una casa con bloques."},
    {"text": "Me gusta mucho esta canción."},
    {"text": "Hoy vi un gato muy lindo."},
    {"text": "Voy a hacer una tarjeta para ti."},
    {"text": "Quiero ir a la montaña."},
    {"text": "Este juego es muy divertido."},
    {"text": "Voy a hacer un dibujo para mamá."},
    {"text": "Hoy quiero ayudar en la cocina."},
    {"text": "Quiero leer este libro."},
    {"text": "Voy a buscar un tesoro."},
    {"text": "Me gusta mucho el helado de fresa."},
    {"text": "Voy a aprender algo divertido."},
    {"text": "¿Dónde está mi camión de bomberos?"},
    {"text": "Hoy hice un dibujo muy bonito."},
    {"text": "Voy a cantar una canción."},
    {"text": "Quiero hacer un castillo de arena."},
    {"text": "Este día es el mejor."},
    {"text": "Voy a tocar mi guitarra de juguete."},
    {"text": "Me gusta mucho el verano."},
    {"text": "Voy a hacer una cometa."},
    {"text": "Hoy quiero ser un astronauta."},
    {"text": "Quiero aprender a tocar el piano."},
    {"text": "Voy a escribir mi nombre."},
    {"text": "Me encanta ver dibujos animados."},
    {"text": "Hoy quiero hacer algo creativo."},
    {"text": "Quiero tener un robot."},
    {"text": "Voy a dibujar un cohete."},
    {"text": "Me gusta jugar con mis amigos."},
    {"text": "Hoy aprendí a decir una nueva palabra."},
    {"text": "Voy a contar una historia divertida."},
    {"text": "Me encanta jugar con plastilina."},
    {"text": "Voy a buscar mi libro favorito."},
    {"text": "Quiero aprender algo increíble."},
    {"text": "Este día es especial."},
    {"text": "Hoy vi un arcoíris."},
    {"text": "Voy a hacer una manualidad."},
    {"text": "Quiero ver las estrellas."},
    {"text": "Voy a saltar en el trampolín."},
    {"text": "Me gusta mucho jugar con globos."},
    {"text": "Hoy aprendí a escribir mi nombre."},
    {"text": "Voy a hacer una torre con cartas."},
    {"text": "Quiero aprender a patinar."},
    {"text": "Voy a dibujar una granja."},
    {"text": "Me encanta ir al cine."},
    {"text": "Hoy quiero ser un pirata."},
    {"text": "Voy a escribir una carta para papá."},
    {"text": "Quiero volar un avión de papel."},
    {"text": "Hoy quiero aprender sobre animales."},
    {"text": "Voy a construir un puente con bloques."},
    {"text": "Quiero explorar mi jardín."},
    {"text": "Voy a hacer un regalo para mi amigo."},
    {"text": "Me gusta mucho este color."},
    {"text": "Hoy aprendí a contar hasta veinte."},
    {"text": "Voy a hacer un dibujo de un dragón."},
    {"text": "Quiero aprender algo sobre los planetas."},
    {"text": "Hoy vi un pájaro azul."},
    {"text": "Voy a cantar mi canción favorita."},
    {"text": "Quiero jugar con mi tren de juguete."},
    {"text": "Hoy aprendí algo muy divertido."},
    {"text": "Voy a pintar una casa muy colorida."},
    {"text": "Quiero hacer un picnic en el parque."},
    {"text": "Hoy quiero ser un superhéroe."},
    {"text": "Voy a aprender a contar en inglés."},
    {"text": "Me gusta mucho mi bicicleta nueva."},
    {"text": "Hoy quiero ser un científico."},
    {"text": "Voy a aprender a cocinar algo fácil."},
    {"text": "Quiero aprender algo sobre dinosaurios."},
    {"text": "Hoy hice una torre muy alta."},
    {"text": "Voy a dibujar un payaso."},
    {"text": "Quiero aprender algo divertido hoy."},
    {"text": "Hoy quiero jugar con mi perro."},
    {"text": "Voy a hacer un dibujo para mi abuela."},
    {"text": "Me encanta este juguete nuevo."},
    {"text": "Hoy quiero aprender a bailar."},
    {"text": "Voy a dibujar un unicornio."},
    {"text": "Quiero explorar el parque con mis amigos."},
    {"text": "Hoy aprendí a hacer un avión de papel."}
]`}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default MultiplePhraseSubmit;