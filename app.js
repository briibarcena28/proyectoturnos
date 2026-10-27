const SUPABASE_URL = 'https://pcwapuyxrqisisnmlyev.supabase.co';
const SUPABASE_KEY = 'sb_publishable_xSqe4igI-6hR7wjuNprcYg_tS2_Xijs';

let supabaseClient = null;

if (window.supabase) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
  console.error('No se pudo cargar la librería de Supabase.');
}

document.addEventListener('DOMContentLoaded', () => {
  const formTurno = document.getElementById('form-turno');
  const inputPaciente = document.getElementById('input-paciente');
  const inputFecha = document.getElementById('input-fecha');
  const inputHora = document.getElementById('input-hora');
  const inputEspecialidad = document.getElementById('input-especialidad');
  const inputProfesional = document.getElementById('input-profesional');
  const inputCentro = document.getElementById('input-centro');
  const inputPrestacion = document.getElementById('input-prestacion');
  const tablaBody = document.getElementById('turnos-tabla-body');
  const contenedorResultados = document.getElementById('resultados');

  if (!supabaseClient) {
    if (tablaBody) tablaBody.innerHTML = `<tr><td colspan="5" class="error" style="text-align:center;">Error de conexión con Supabase.</td></tr>`;
    return;
  }

  cargarTurnos();

  if (formTurno) {
    formTurno.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nuevoTurno = {
        paciente: inputPaciente.value.trim(),
        fecha: inputFecha.value,
        hora: inputHora.value,
        especialidad: inputEspecialidad.value.trim(),
        profesional: inputProfesional.value.trim(),
        centro_atencion: inputCentro.value.trim(),
        prestacion: inputPrestacion.value.trim()
      };

      contenedorResultados.innerHTML = '<p class="cargando">Guardando nuevo turno en el sistema...</p>';

      try {
        const { error } = await supabaseClient.from('turnos').insert([nuevoTurno]);

        if (error) {
          contenedorResultados.innerHTML = `<p class="error">Error al registrar: ${error.message}</p>`;
        } else {
          formTurno.reset();
          inputPaciente.value = 'NOLORBE PACAYA, LILI';
          inputPrestacion.value = 'CONSULTA MEDICA';
          contenedorResultados.innerHTML = `<p class="exito">¡Turno registrado correctamente en la base de datos!</p>`;
          await cargarTurnos();
        }
      } catch (err) {
        contenedorResultados.innerHTML = `<p class="error">Error inesperado: ${err.message}</p>`;
      }
    });
  }

  async function cargarTurnos() {
    if (!tablaBody) return;
    tablaBody.innerHTML = `<tr><td colspan="5" class="cargando" style="text-align: center; padding: 2rem;">Cargando turnos...</td></tr>`;

    try {
      const { data, error } = await supabaseClient.from('turnos').select('*').order('fecha', { ascending: true });

      if (error) {
        tablaBody.innerHTML = `<tr><td colspan="5" class="error" style="text-align: center;">Error al cargar datos: ${error.message}</td></tr>`;
      } else {
        if (!data || data.length === 0) {
          tablaBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #666;">No hay turnos registrados en la base de datos.</td></tr>`;
          return;
        }

        let html = '';
        data.forEach(item => {
          const fechaPartes = item.fecha.split('-');
          const fechaFormateada = `${fechaPartes[2]}/${fechaPartes[1]}/${fechaPartes[0]}`;

          // Texto para el recordatorio por WhatsApp / Email
          const textoMensaje = `Recordatorio de Turno Médico:\n- Paciente: ${item.paciente || 'NOLORBE PACAYA, LILI'}\n- Fecha: ${fechaFormateada} a las ${item.hora} hs\n- Especialidad: ${item.especialidad}\n- Profesional: ${item.profesional}\n- Lugar: ${item.centro_atencion}\n- Prestación: ${item.prestacion}`;

          const urlWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(textoMensaje)}`;
          const urlEmail = `mailto:lili.nolorbe29@gmail.com?subject=${encodeURIComponent(`Recordatorio Turno: ${item.especialidad}`)}&body=${encodeURIComponent(textoMensaje)}`;

          html += `
            <tr>
              <td><strong>${fechaFormateada}</strong><br><span style="color: #666; font-size: 0.95rem;">${item.hora} hs</span></td>
              <td><span class="badge-centro">${item.centro_atencion}</span></td>
              <td><strong>${item.especialidad}</strong><br><span style="color: #555;">${item.profesional}</span></td>
              <td>${item.prestacion}</td>
              <td>
                <div class="action-buttons">
                  <a href="${urlWhatsApp}" target="_blank" class="btn-action btn-ws" title="Enviar a WhatsApp">📲 WhatsApp</a>
                  <a href="${urlEmail}" class="btn-action btn-mail" title="Enviar Email">✉️ Mail</a>
                </div>
              </td>
            </tr>
          `;
        });

        tablaBody.innerHTML = html;
      }
    } catch (err) {
      tablaBody.innerHTML = `<tr><td colspan="5" class="error" style="text-align: center;">Error inesperado al cargar la tabla.</td></tr>`;
    }
  }
});
