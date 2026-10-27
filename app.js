const SUPABASE_URL = 'https://pcwapuyxrqisisnmlyev.supabase.co';
const SUPABASE_KEY = 'sb_publishable_xSqe4igI-6hR7wjuNprcYg_tS2_Xijs';

let supabaseClient = null;

// Lista completa con todos tus turnos actualizados de las capturas
const inicialTurnosPDF = [
  { fecha: '2026-10-29', hora: '18:00', especialidad: 'TRAUMATOLOGIA ADULTOS', profesional: 'SIDERAKIS, NICOLAS', centro_atencion: 'CEMAC CABALLITO', prestacion: 'CONSULTA MEDICA TRAUMATOLOGIA COLUMNA' },
  { fecha: '2026-11-04', hora: '13:00', especialidad: 'GASTROENTEROLOGIA ADULTOS', profesional: 'ORIETA, ELIZABETH FERNANDA', centro_atencion: 'CEMAC CABALLITO', prestacion: 'CONSULTA MEDICA GASTROENTEROLOGIA ADULTOS' },
  { fecha: '2026-11-04', hora: '16:30', especialidad: 'CARDIOLOGIA ADULTOS', profesional: 'ZALESKI, MARCELO JAVIER', centro_atencion: 'CEMAC RECOLETA', prestacion: 'CONSULTA MEDICA CARDIOLOGIA ADULTOS' },
  { fecha: '2026-11-04', hora: '18:50', especialidad: 'OFTALMOLOGIA ADULTOS', profesional: 'POMA RODAS, JUAN FRANCISCO', centro_atencion: 'IQDC', prestacion: 'CONSULTA MEDICA OFTALMOLOGIA GENERAL' },
  { fecha: '2026-11-19', hora: '09:40', especialidad: 'TRAUMATOLOGIA ADULTOS', profesional: 'KEES, SAMUEL', centro_atencion: 'CEMAC RECOLETA', prestacion: 'CONSULTA MEDICA TRAUMATOLOGIA COLUMNA' },
  { fecha: '2026-11-20', hora: '14:30', especialidad: 'REUMATOLOGIA ADULTOS', profesional: 'ARTUNDUAGA, ANDRES', centro_atencion: 'SANATORIO ITOIZ CONSULTORIOS', prestacion: 'CONSULTA MEDICA REUMATOLOGICA ADULTOS' },
  { fecha: '2026-11-21', hora: '12:45', especialidad: 'TRAUMATOLOGIA ADULTOS', profesional: 'HURTADO GUTIERREZ, ALVARO', centro_atencion: 'CEMAC CABALLITO', prestacion: 'CONSULTA MEDICA TRAUMATOLOGIA COLUMNA' },
  { fecha: '2026-11-28', hora: '15:20', especialidad: 'TRAUMATOLOGIA ADULTOS', profesional: 'PACHECO MURILLO, ALEX ANTONIO', centro_atencion: 'CEMAC RECOLETA', prestacion: 'CONSULTA MEDICA TRAUMATOLOGIA CADERA' },
  { fecha: '2026-12-01', hora: '13:00', especialidad: 'ESTUDIOS OFTALMOLOGICOS', profesional: 'FIEL, ROCIO', centro_atencion: 'IQDC', prestacion: 'OCT - TOMOGRAFIA DE COHERENCIA OPTICA' },
  { fecha: '2026-12-04', hora: '14:00', especialidad: 'REUMATOLOGIA ADULTOS', profesional: 'GRAIZMAN, RAUL ERNESTO', centro_atencion: 'SANATORIO ITOIZ CONSULTORIOS', prestacion: 'CONSULTA MEDICA' },
  { fecha: '2026-12-04', hora: '15:00', especialidad: 'GASTROENTEROLOGIA ADULTOS', profesional: 'CAPPELLETTI, CARLOS ALBERTO', centro_atencion: 'CEMAC MONTSERRAT', prestacion: 'CONSULTA MEDICA GASTROENTEROLOGIA ADULTOS' },
  { fecha: '2026-12-04', hora: '15:15', especialidad: 'GASTROENTEROLOGIA ADULTOS', profesional: 'DELGADO PEÑA, MARIA PILAR', centro_atencion: 'CEMAC MONTSERRAT', prestacion: 'CONSULTA MEDICA GASTROENTEROLOGIA ADULTOS' },
  { fecha: '2026-12-05', hora: '12:10', especialidad: 'OFTALMOLOGIA ADULTOS', profesional: 'MIRANDA MOLINA, PATRICIA LAURA', centro_atencion: 'IQDC', prestacion: 'CONSULTA MEDICA OFTALMOLOGIA GENERAL' },
  { fecha: '2026-12-05', hora: '13:00', especialidad: 'CARDIOLOGIA ADULTOS', profesional: 'QUATTROPANI, DANIEL', centro_atencion: 'CEMAC CABALLITO', prestacion: 'CONSULTA MEDICA CARDIOLOGIA ADULTOS' },
  { fecha: '2026-12-05', hora: '13:20', especialidad: 'OFTALMOLOGIA ADULTOS', profesional: 'SARMIENTO, MARIA DE LOS ANGELES', centro_atencion: 'IQDC', prestacion: 'CONSULTA MEDICA OFTALMOLOGIA GENERAL' },
  { fecha: '2026-12-05', hora: '15:40', especialidad: 'TRAUMATOLOGIA ADULTOS', profesional: 'PACHECO MURILLO, ALEX ANTONIO', centro_atencion: 'CEMAC RECOLETA', prestacion: 'CONSULTA MEDICA TRAUMATOLOGIA CADERA' },
  { fecha: '2026-12-09', hora: '12:00', especialidad: 'GASTROENTEROLOGIA ADULTOS', profesional: 'ORIETA, ELIZABETH FERNANDA', centro_atencion: 'CEMAC CABALLITO', prestacion: 'CONSULTA MEDICA GASTROENTEROLOGIA ADULTOS' },
  { fecha: '2026-12-09', hora: '16:00', especialidad: 'ENDOCRINOLOGIA ADULTOS', profesional: 'CARDENAS ZARATE, YESICA YOBANA', centro_atencion: 'SANATORIO SAN MARTIN CONS. EXTERNOS', prestacion: 'CONSULTA MEDICA' },
  { fecha: '2026-12-09', hora: '19:40', especialidad: 'HEMATOLOGIA ADULTOS', profesional: 'ESCALADA, NOELIA', centro_atencion: 'CEMAC RECOLETA', prestacion: 'CONSULTA MEDICA HEMATOLOGIA ADULTOS' },
  { fecha: '2026-12-10', hora: '11:00', especialidad: 'CARDIOLOGIA ADULTOS', profesional: 'LOPEZ AIME, MARIA CANDEARIA', centro_atencion: 'CEMAC RECOLETA', prestacion: 'CONSULTA MEDICA CARDIOLOGIA ADULTOS' },
  { fecha: '2026-12-10', hora: '14:00', especialidad: 'OFTALMOLOGIA ADULTOS', profesional: 'JOLODENCO, KEVIN', centro_atencion: 'IQDC', prestacion: 'CONSULTA OFTALMOLOGIA CATARATAS ADULTOS' },
  { fecha: '2026-12-14', hora: '09:40', especialidad: 'TRAUMATOLOGIA ADULTOS', profesional: 'KEES, SAMUEL', centro_atencion: 'CEMAC RECOLETA', prestacion: 'CONSULTA MEDICA TRAUMATOLOGIA COLUMNA' }
];

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
    if (tablaBody) tablaBody.innerHTML = `<tr><td colspan="4" class="error" style="text-align:center;">Error de conexión con Supabase.</td></tr>`;
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
    tablaBody.innerHTML = `<tr><td colspan="4" class="cargando" style="text-align: center; padding: 2rem;">Cargando turnos...</td></tr>`;

    try {
      const { data, error } = await supabaseClient.from('turnos').select('*').order('fecha', { ascending: true });

      if (error) {
        tablaBody.innerHTML = `<tr><td colspan="4" class="error" style="text-align: center;">Error al cargar datos: ${error.message}</td></tr>`;
      } else {
        if (!data || data.length === 0) {
          await precargarTurnosPDF();
          return;
        }

        let html = '';
        data.forEach(item => {
          const fechaPartes = item.fecha.split('-');
          const fechaFormateada = `${fechaPartes[2]}/${fechaPartes[1]}/${fechaPartes[0]}`;

          html += `
            <tr>
              <td><strong>${fechaFormateada}</strong> - ${item.hora} hs</td>
              <td><span class="badge-centro">${item.centro_atencion}</span></td>
              <td><strong>${item.especialidad}</strong><br><span style="color: #555;">${item.profesional}</span></td>
              <td>${item.prestacion}</td>
            </tr>
          `;
        });

        tablaBody.innerHTML = html;
      }
    } catch (err) {
      tablaBody.innerHTML = `<tr><td colspan="4" class="error" style="text-align: center;">Error inesperado al cargar la tabla.</td></tr>`;
    }
  }

  async function precargarTurnosPDF() {
    try {
      const { error } = await supabaseClient.from('turnos').insert(inicialTurnosPDF);
      if (!error) {
        await cargarTurnos();
      } else {
        tablaBody.innerHTML = `<tr><td colspan="4" class="error" style="text-align: center;">Error al sincronizar turnos iniciales. (${error.message})</td></tr>`;
      }
    } catch (err) {
      console.error(err);
    }
  }
});