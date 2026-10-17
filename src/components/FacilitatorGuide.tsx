import { Modal } from './Modal';

export function FacilitatorGuide({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Guía para quien facilita" onClose={onClose} wide>
      <div className="prose">
        <p>
          <strong>Última conexión</strong> es una investigación narrativa para grupos de jóvenes (a partir de 14–15 años) en un centro juvenil o
          una parroquia. Dura unos <strong>35–50 minutos de investigación</strong> y <strong>20–30 minutos de diálogo</strong>.
        </p>

        <h3>Preparación</h3>
        <ul>
          <li>Probad el juego antes. Leed la solución (abajo) y la biblia narrativa (docs/BIBLIA_NARRATIVA.md).</li>
          <li>Formato recomendado: proyectado para todo el grupo, con una persona a los mandos, o en equipos de 3–5 con un dispositivo cada uno.</li>
          <li>El progreso se guarda automáticamente en el navegador. Para otro grupo, usad «Reiniciar partida» en Ajustes.</li>
          <li>Repartid funciones si queréis: quien maneja el teléfono, quien lleva la cronología, quien anota hipótesis.</li>
        </ul>

        <h3>Durante la investigación</h3>
        <ul>
          <li>No deis respuestas. Devolved preguntas: «¿qué prueba sostiene eso?», «¿es un hecho o una suposición?».</li>
          <li>Las ayudas del expediente tienen tres niveles. Animad a usarlas antes de atascarse más de 5 minutos.</li>
          <li>
            Si vais justos de tiempo, Ajustes → «Herramientas de facilitación» permite dar por resuelto el capítulo actual (pide confirmación).
          </li>
          <li>Las preguntas abiertas no se corrigen: son para conversar.</li>
        </ul>

        <h3>Seguridad emocional</h3>
        <ul>
          <li>Leed el aviso de contenido con el grupo. Nadie está obligado a compartir nada personal.</li>
          <li>Cualquiera puede salir de la actividad. Prevé un espacio y un adulto disponible.</li>
          <li>
            <strong>Si alguien comunica una situación real de riesgo</strong>, se para el juego para esa persona: se le escucha en privado, no se
            le promete secreto absoluto y se activan los protocolos de protección del centro y, si procede, los servicios de emergencia o los
            teléfonos de ayuda (en España: ANAR 900 20 20 10, 024, 112).
          </li>
          <li>La dinámica final («Una conexión real») es voluntaria y privada. No pidáis nombres de personas en riesgo.</li>
        </ul>

        <h3>Diálogo posterior</h3>
        <p>
          Al terminar, la interfaz pasa a una pantalla de reflexión con diez preguntas, una a una. No hace falta usarlas todas. Buscad que el grupo
          pase de «¿por qué desapareció?» a «¿cuánto conocemos a quienes tenemos al lado?». Evitad buscar culpables: cada personaje tuvo motivos y
          límites. Inspiración: la presencia, la razón, la amabilidad y la confianza del Sistema Preventivo de Don Bosco.
        </p>

        <details className="spoiler">
          <summary>Ver soluciones (contiene spoilers)</summary>
          <ul>
            <li>PIN del teléfono: <strong>1406</strong> (cumpleaños de Lucía, 14 de junio; fondo de pantalla).</li>
            <li>Contraseña del diario («Cosas mías»): <strong>nadie</strong> (cómic de Marcos; foto del cuaderno y chat con Sara).</li>
            <li>Cap. 1: Marcos Ferrer · 31 de enero · wifi del centro a las 21:47.</li>
            <li>Cap. 2: cuidaba de Lucía · su padre se fue en noviembre · solo lo sabía Sara.</li>
            <li>Cap. 3: habló con Sara y fue a la orientadora · el 31 pensaba contárselo todo a Sara.</li>
            <li>Cap. 4: está en Santa Olaria con su tía · dejó el móvil en el centro y no tenía los números · el móvil estuvo en el almacén.</li>
            <li>
              Cap. 5: padre se va → escape room → Sara → orientadora → buenas noches → fiesta → Santa Olaria → Sara avisa a Nacho → mensaje a su
              número → hallazgo. Explicación: la que reúne varios factores sin culpable único.
            </li>
            <li>
              Archivos eliminados: cada uno se recupera tras descubrir una pista relacionada (chat de Sara del 13 de enero, audio a Iván, renuncia a
              las buenas noches, mensaje de su madre del 31, mensaje del 15 de noviembre). IMG_0231 no se puede recuperar a propósito.
            </li>
          </ul>
        </details>
      </div>
    </Modal>
  );
}
