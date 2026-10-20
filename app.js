const SUPABASE_URL = 'https://pcwapuyxrqisisnmlyev.supabase.co';
const SUPABASE_KEY = 'sb_publishable_xSqe4igI-6hR7wjuNprcYg_tS2_Xijs';

let supabaseClient = null;

const inicialTurnosPDF = [
  { fecha: '2026-10-17', hora: '12:20', especialidad: 'OFTALMOLOGIA GENERAL', profesional: 'ALCIVAR, CINTHYA', centro_atencion: 'IQDC-AV. CALLAO 499', prestacion: 'CONSULTA MEDICA' },
  { fecha: '2026-10-23', hora: '17:00', especialidad: 'HEMATOLOGIA ADULTOS', profesional: 'ESCALADA, NOELIA', centro_atencion: 'CEMAC RECOLETA', prestacion: 'CONSULTA MEDICA HEMATOLOGIA ADULTOS' },
  { fecha: '2026-10-29', hora: '18:00', especialidad: 'TRAUMATOLOGIA ADULTOS', profesional: 'SIDERAKIS, NICOLAS', centro_atencion: 'CEMAC CABALLITO', prestacion: 'CONSULTA MEDICA TRAUMATOLOGIA COLUMNA' },
  { fecha: '2026-11-04', hora: '13:00', especialidad: 'GASTROENTEROLOGIA ADULTOS', profesional: 'ORIETA, ELIZABETH FERNANDA', centro_atencion: 'CEMAC CABALLITO', prestacion: 'CONSULTA MEDICA GASTROENTEROLOGIA ADULTOS' },
  { fecha: '2026-11-04', hora: '16:30', especialidad: 'CARDIOLOGIA ADULTOS', profesional: 'ZALESKI, MARCELO JAVIER', centro_atencion: 'CEMAC RECOLETA', prestacion: 'CONSULTA MEDICA CARDIOLOGIA ADULTOS' },
  { fecha: '2026-11-04', hora: '18:50', especialidad: 'OFTALMOLOGIA ADULTOS', profesional: 'POMA RODAS, JUAN FRANCISCO', centro_atencion: 'IQDC', prestacion: 'CONSULTA MEDICA OFTALMOLOGIA GENERAL' },
  { fecha: '2026-11-19', hora: '09:40', especialidad: 'TRAUMATOLOGIA ADULTOS', profesional: 'KEES, SAMUEL', centro_atencion: 'CEMAC RECOLETA', prestacion: 'CONSULTA MEDICA TRAUMATOLOGIA COLUMNA' },
  { fecha: '2026-11-20', hora: '14:30', especialidad: 'REUMATOLOGIA ADULTOS', profesional: 'ARTUNDUAGA, ANDRES', centro_atencion: 'SANATORIO ITOIZ CONSULTORIOS', prestacion: 'CONSULTA MEDICA REUMATOLOGICA ADULTOS' },
  { fecha: '2026-11-21', hora: '12:45', especialidad: 'TRAUMATOLOGIA ADULTOS', profesional: 'HURTADO GUTIERREZ, ALVARO', centro_atencion: 'CEMAC CABALLITO', prestacion: 'CONSULTA MEDICA TRAUMATOLOGIA COLUMNA' },
  { fecha: '2026-11-28', hora: '15:20', especialidad: 'TRAUMATOLOGIA ADULTOS', profesional: 'PACHECO MURILLO, ALEX ANTONIO', centro_atencion: 'CEMAC RECOLETA', prestacion: 'CONSULTA MEDICA TRAUMATOLOGIA CADERA' },
  { fecha: '2026-12-04', hora: '14:00', especialidad: 'REUMATOLOGIA ADULTOS', profesional: 'GRAIZMAN, RAUL ERNESTO', centro_atencion: 'SANATORIO ITOIZ CONSULTORIOS', prestacion: 'CONSULTA MEDICA' },
  { fecha: '2026-12-14', hora: '09:40', especialidad: 'TRAUMATOLOGIA ADULTOS', profesional: 'KEES, SAMUEL', centro_atencion: 'CEMAC RECOLETA', prestacion: 'CONSULTA MEDICA TRAUMATOLOGIA COLUMNA' },
  { fecha: '2026-12-14', hora: '17:00', especialidad: 'HEMATOLOGIA ADULTOS', profesional: 'COBO PALMA, VERONICA ISABEL', centro_atencion: 'CEMAC RECOLETA', prestacion: 'CONSULTA MEDICA HEMATOLOGIA ADULTOS' }
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

  const btnConsultar = document.getElementById('btn-consultar');
  const contenedorGrid = document.getElementById('turnos-grid');
  const contenedorResultados = document.getElementById('resultados');
  const turnosCount = document.getElementById('turnos-count');

  if (!supabaseClient) {
    if (contenedorGrid) contenedorGrid.innerHTML = '<p class="error">Error: No se pudo conectar con Supabase.</p>';
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

      contenedorResultados.innerHTML = '<p class="cargando">Guardando turno en la base de datos...</p>';

      try {
        const { error } = await supabaseClient.from('turnos').insert([nuevoTurno]);

        if (error) {
          contenedorResultados.innerHTML = `<p class="error">Error al guardar: ${error.message}</p>`;
        } else {
          formTurno.reset();
          inputPaciente.value = 'NOLORBE PACAYA, LILI';
          inputPrestacion.value = 'CONSULTA MEDICA';
          contenedorResultados.innerHTML = `<p class="exito">¡Turno registrado exitosamente!</p>`;
          await cargarTurnos();
        }
      } catch (err) {
        contenedorResultados.innerHTML = `<p class="error">Error inesperado: ${err.message}</p>`;
      }
    });
  }

  async function cargarTurnos() {
    if (!contenedorGrid) return;
    contenedorGrid.innerHTML = '<p class="cargando">Cargando lista de turnos...</p>';

    try {
      const { data, error } = await supabaseClient.from('turnos').select('*').order('fecha', { ascending: true });

      if (error) {
        contenedorGrid.innerHTML = `<p class="error">Error al consultar turnos: ${error.message}</p>`;
      } else {
        if (!data || data.length === 0) {
          await precargarTurnosPDF();
          return;
        }

        if (turnosCount) turnosCount.textContent = data.length;

        let html = '';
        data.forEach(item => {
          const fechaPartes = item.fecha.split('-');
          const fechaFormateada = `${fechaPartes[2]}/${fechaPartes[1]}/${fechaPartes[0]}`;

          html += `
            <div class="product-card">
              <div class="product-icon">📅</div>
              <span class="badge-rubro">${item.especialidad}</span>
              <h3 class="product-title">${item.profesional}</h3>
              <p class="product-details">
                📍 <strong>Lugar:</strong> ${item.centro_atencion}<br>
                🩺 <strong>Prestación:</strong> ${item.prestacion}<br>
                👤 <strong>Paciente:</strong> ${item.paciente || 'NOLORBE PACAYA, LILI'}
              </p>
              <div class="product-price">📆 ${fechaFormateada} - ⏰ ${item.hora} hs</div>
            </div>
          `;
        });

        contenedorGrid.innerHTML = html;
      }
    } catch (err) {
      contenedorGrid.innerHTML = `<p class="error">Error inesperado al cargar turnos.</p>`;
    }
  }

  async function precargarTurnosPDF() {
    try {
      const { error } = await supabaseClient.from('turnos').insert(inicialTurnosPDF);
      if (!error) {
        await cargarTurnos();
      } else {
        contenedorGrid.innerHTML = `<p class="error">Crea la tabla 'turnos' en Supabase para sincronizar. (${error.message})</p>`;
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (btnConsultar) {
    btnConsultar.addEventListener('click', (e) => {
      e.preventDefault();
      cargarTurnos();
    });
  }
});