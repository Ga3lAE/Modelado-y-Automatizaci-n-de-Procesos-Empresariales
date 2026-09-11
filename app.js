// Clave de almacenamiento local
const STORAGE_KEY = "MAPE_LAB01_TRACKER_DATA";

// Estado inicial por defecto
let appState = {
  steps: {
    1: false, 2: false, 3: false, 4: false, 5: false,
    6: false, 7: false, 8: false, 9: false, 10: false
  },
  formData: {
    entrevistadoNombre: "",
    entrevistadoCargo: "",
    entrevistadoArea: "",
    procesoNombre: "",
    procesoObjetivo: "",
    procesoInicio: "",
    procesoFin: "",
    participantes: "",
    entradas: "",
    salidas: "",
    formatos: "",
    sistemas: "",
    selfieDataUrl: "",
    selfieFilename: "",
    camundaStatus: "",
    mejoras: "",
    pptStatus: "",
    // Live interview
    liveIntegrantes: "",
    activities: [
      { id: 1, rol: "Usuario / Alumno", accion: "Presenta solicitud / carné", condicion: "Si cumple requisitos" },
      { id: 2, rol: "Encargado de área", accion: "Verifica en sistema y registra", condicion: "Sistema disponible" }
    ]
  }
};

// Cargar datos persistidos
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      appState = {
        ...appState,
        ...parsed,
        steps: { ...appState.steps, ...parsed.steps },
        formData: { ...appState.formData, ...parsed.formData }
      };
    }
  } catch (e) {
    console.error("Error al cargar localStorage:", e);
  }
}

// Guardar datos
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.warn("No se pudo guardar en localStorage (posible límite de tamaño):", e);
  }
}

// Inicialización de DOM y Eventos
document.addEventListener("DOMContentLoaded", () => {
  loadState();
  initTabs();
  bindStepCheckboxes();
  bindFormInputs();
  bindSelfieUpload();
  bindActivities();
  bindExportButtons();
  populateUIFromState();
  updateProgress();
  generateSummaryText();
});

// Pestañas
function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add("active");
      }

      if (targetId === "tab-resumen") {
        generateSummaryText();
      }
    });
  });
}

// Checkboxes de pasos
function bindStepCheckboxes() {
  for (let i = 1; i <= 10; i++) {
    const chk = document.getElementById(`step${i}-check`);
    const card = document.getElementById(`step${i}-card`);
    if (!chk) continue;

    chk.addEventListener("change", () => {
      appState.steps[i] = chk.checked;
      if (card) {
        if (chk.checked) card.classList.add("completed");
        else card.classList.remove("completed");
      }
      saveState();
      updateProgress();
    });
  }
}

// Mapeo bidireccional entre inputs y appState
const inputMap = [
  { id: "inputEntrevistadoNombre", prop: "entrevistadoNombre" },
  { id: "inputEntrevistadoCargo", prop: "entrevistadoCargo" },
  { id: "inputEntrevistadoArea", prop: "entrevistadoArea" },
  { id: "inputProcesoNombre", prop: "procesoNombre" },
  { id: "inputProcesoObjetivo", prop: "procesoObjetivo" },
  { id: "inputProcesoInicio", prop: "procesoInicio" },
  { id: "inputProcesoFin", prop: "procesoFin" },
  { id: "inputParticipantes", prop: "participantes" },
  { id: "inputEntradas", prop: "entradas" },
  { id: "inputSalidas", prop: "salidas" },
  { id: "inputFormatos", prop: "formatos" },
  { id: "inputSistemas", prop: "sistemas" },
  { id: "inputCamundaStatus", prop: "camundaStatus" },
  { id: "inputMejoras", prop: "mejoras" },
  { id: "inputPptStatus", prop: "pptStatus" },

  // Live Tab mirror
  { id: "liveNombre", prop: "entrevistadoNombre" },
  { id: "liveCargo", prop: "entrevistadoCargo" },
  { id: "liveArea", prop: "entrevistadoArea" },
  { id: "liveProceso", prop: "procesoNombre" },
  { id: "liveObjetivo", prop: "procesoObjetivo" },
  { id: "liveInicio", prop: "procesoInicio" },
  { id: "liveFin", prop: "procesoFin" },
  { id: "liveIntegrantes", prop: "liveIntegrantes" }
];

function bindFormInputs() {
  inputMap.forEach(item => {
    const el = document.getElementById(item.id);
    if (!el) return;

    el.addEventListener("input", () => {
      appState.formData[item.prop] = el.value;
      
      // Auto marcar paso 1 o 2 si el usuario llena datos clave
      checkAutoAdvance(item.prop);

      // Sincronizar inputs espejos
      inputMap.filter(m => m.prop === item.prop && m.id !== item.id).forEach(mirror => {
        const mirrorEl = document.getElementById(mirror.id);
        if (mirrorEl) mirrorEl.value = el.value;
      });

      saveState();
    });
  });

  const btnSync = document.getElementById("btnSyncToSteps");
  if (btnSync) {
    btnSync.addEventListener("click", () => {
      populateUIFromState();
      alert("✅ Datos sincronizados correctamente.");
    });
  }
}

function checkAutoAdvance(prop) {
  // Si llenó datos del entrevistado, sugerir o autocheckear
  if (["entrevistadoNombre", "entrevistadoCargo", "entrevistadoArea"].includes(prop)) {
    if (appState.formData.entrevistadoNombre && appState.formData.entrevistadoCargo) {
      // marcar visualmente
    }
  }
}

// Carga de imagen para el selfie obligatorio
function bindSelfieUpload() {
  const fileInput = document.getElementById("inputSelfieFile");
  const previewImg = document.getElementById("selfiePreviewImg");
  const previewContainer = document.getElementById("selfiePreviewContainer");
  const filenameLabel = document.getElementById("selfieFilename");

  if (!fileInput) return;

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      previewImg.src = dataUrl;
      previewContainer.classList.remove("hidden");
      filenameLabel.textContent = `✓ Foto cargada: ${file.name}`;

      appState.formData.selfieDataUrl = dataUrl;
      appState.formData.selfieFilename = file.name;

      // Auto check paso 7
      const chk7 = document.getElementById("step7-check");
      if (chk7 && !chk7.checked) {
        chk7.checked = true;
        appState.steps[7] = true;
        document.getElementById("step7-card")?.classList.add("completed");
        updateProgress();
      }

      saveState();
    };
    reader.readAsDataURL(file);
  });
}

// Gestión de actividades dinámicas (Paso a paso)
function bindActivities() {
  const btnAdd = document.getElementById("btnAddActivity");
  if (!btnAdd) return;

  btnAdd.addEventListener("click", () => {
    const newId = appState.formData.activities.length + 1;
    appState.formData.activities.push({
      id: newId,
      rol: "",
      accion: "",
      condicion: ""
    });
    renderActivities();
    saveState();
  });
}

function renderActivities() {
  const container = document.getElementById("activitiesListContainer");
  if (!container) return;

  container.innerHTML = "";
  if (!appState.formData.activities || appState.formData.activities.length === 0) {
    container.innerHTML = "<p style='color:#64748b; font-size:0.85rem;'>No hay actividades añadidas aún. Haz clic en 'Agregar Actividad'.</p>";
    return;
  }

  appState.formData.activities.forEach((act, idx) => {
    const row = document.createElement("div");
    row.className = "activity-row";
    row.innerHTML = `
      <div class="activity-index">#${idx + 1}</div>
      <input type="text" class="input-field act-rol" placeholder="Rol / Responsable" value="${escapeHtml(act.rol || '')}">
      <input type="text" class="input-field act-accion" placeholder="Acción realizada" value="${escapeHtml(act.accion || '')}">
      <input type="text" class="input-field act-condicion" placeholder="Decisión / Condición" value="${escapeHtml(act.condicion || '')}">
      <button class="btn btn-danger-sm btn-del-act" title="Eliminar paso">✕</button>
    `;

    const inputRol = row.querySelector(".act-rol");
    const inputAccion = row.querySelector(".act-accion");
    const inputCondicion = row.querySelector(".act-condicion");
    const btnDel = row.querySelector(".btn-del-act");

    inputRol.addEventListener("input", (e) => {
      act.rol = e.target.value;
      saveState();
    });
    inputAccion.addEventListener("input", (e) => {
      act.accion = e.target.value;
      saveState();
    });
    inputCondicion.addEventListener("input", (e) => {
      act.condicion = e.target.value;
      saveState();
    });
    btnDel.addEventListener("click", () => {
      appState.formData.activities.splice(idx, 1);
      renderActivities();
      saveState();
    });

    container.appendChild(row);
  });
}

// Poblar la UI con datos cargados
function populateUIFromState() {
  // Checkboxes
  for (let i = 1; i <= 10; i++) {
    const chk = document.getElementById(`step${i}-check`);
    const card = document.getElementById(`step${i}-card`);
    const isChecked = !!appState.steps[i];
    if (chk) chk.checked = isChecked;
    if (card) {
      if (isChecked) card.classList.add("completed");
      else card.classList.remove("completed");
    }
  }

  // Inputs
  inputMap.forEach(item => {
    const el = document.getElementById(item.id);
    if (el && appState.formData[item.prop] !== undefined) {
      el.value = appState.formData[item.prop];
    }
  });

  // Selfie
  if (appState.formData.selfieDataUrl) {
    const previewImg = document.getElementById("selfiePreviewImg");
    const previewContainer = document.getElementById("selfiePreviewContainer");
    const filenameLabel = document.getElementById("selfieFilename");
    if (previewImg && previewContainer) {
      previewImg.src = appState.formData.selfieDataUrl;
      previewContainer.classList.remove("hidden");
      filenameLabel.textContent = `✓ Foto cargada: ${appState.formData.selfieFilename || 'Selfie.jpg'}`;
    }
  }

  // Actividades
  renderActivities();
}

// Calcular y actualizar progreso
function updateProgress() {
  let completedCount = 0;
  for (let i = 1; i <= 10; i++) {
    if (appState.steps[i]) completedCount++;
  }

  const percent = Math.round((completedCount / 10) * 100);

  const bar = document.getElementById("overallProgressBar");
  const countEl = document.getElementById("completedStepsCount");
  const percentEl = document.getElementById("overallPercentage");

  if (bar) bar.style.width = `${percent}%`;
  if (countEl) countEl.textContent = completedCount;
  if (percentEl) percentEl.textContent = `(${percent}%)`;

  // Status de Parte 1 (Pasos 1 al 7)
  let part1Complete = true;
  for (let i = 1; i <= 7; i++) {
    if (!appState.steps[i]) {
      part1Complete = false;
      break;
    }
  }

  const badgeP1 = document.getElementById("badgeStatusPart1");
  if (badgeP1) {
    if (part1Complete) {
      badgeP1.textContent = "Listo ✓";
      badgeP1.className = "status-pill complete";
    } else {
      badgeP1.textContent = "Pendiente";
      badgeP1.className = "status-pill pending";
    }
  }

  // Status de Parte 2 (Pasos 8 al 10)
  let part2Complete = true;
  for (let i = 8; i <= 10; i++) {
    if (!appState.steps[i]) {
      part2Complete = false;
      break;
    }
  }

  const badgeP2 = document.getElementById("badgeStatusPart2");
  if (badgeP2) {
    if (part2Complete) {
      badgeP2.textContent = "Listo ✓";
      badgeP2.className = "status-pill complete";
    } else {
      badgeP2.textContent = "Pendiente";
      badgeP2.className = "status-pill pending";
    }
  }
}

// Resumen listo para PPT
function generateSummaryText() {
  const f = appState.formData;
  
  let activitiesText = "";
  if (f.activities && f.activities.length > 0) {
    activitiesText = f.activities.map((a, i) => 
      `   ${i + 1}. [${a.rol || 'Rol'}] -> ${a.accion || 'Acción'} ${a.condicion ? `(Decisión: ${a.condicion})` : ''}`
    ).join("\n");
  } else {
    activitiesText = "   (Sin actividades registradas aún)";
  }

  const summary = `===============================================================
MAPE 2026-2 - PONTIFICIA UNIVERSIDAD CATÓLICA DEL PERÚ
RELEVAMIENTO Y DOCUMENTACIÓN DE PROCESOS EMPRESARIALES (LAB 01)
Docente: Marco Caldas
===============================================================

[PARTE 1: FICHA TÉCNICA DEL PROCESO RELEVADO]
---------------------------------------------------------------
1. DATOS DEL INVOLUCRADO:
   • Nombre: ${f.entrevistadoNombre || '[Por registrar]'}
   • Cargo Oficial: ${f.entrevistadoCargo || '[Por registrar]'}
   • Área / Unidad en Campus: ${f.entrevistadoArea || '[Por registrar]'}

2. IDENTIFICACIÓN DEL PROCESO:
   • Nombre del Proceso: ${f.procesoNombre || '[Por registrar]'}
   • Objetivo: ${f.procesoObjetivo || '[Por registrar]'}
   • Alcance (Inicio): ${f.procesoInicio || '[Por registrar]'}
   • Alcance (Fin): ${f.procesoFin || '[Por registrar]'}

3. PARTICIPANTES Y ROLES (LANES EN CAMUNDA):
${f.participantes ? f.participantes.split('\n').map(p => `   • ${p}`).join('\n') : '   • [Por registrar]'}

4. ENTRADAS Y SALIDAS:
   • Entradas (Inputs / Triggers): 
     ${f.entradas || '[Por registrar]'}
   • Salidas (Outputs / Productos generados): 
     ${f.salidas || '[Por registrar]'}

5. INVENTARIO DE FORMATOS Y DOCUMENTOS:
${f.formatos ? f.formatos.split('\n').map(item => `   • ${item}`).join('\n') : '   • [Por registrar]'}

6. INVENTARIO DE SISTEMAS DE INFORMACIÓN:
${f.sistemas ? f.sistemas.split('\n').map(item => `   • ${item}`).join('\n') : '   • [Por registrar]'}

7. REGISTRO FOTOGRÁFICO:
   • Selfie Obligatorio con el Involucrado: ${f.selfieDataUrl ? 'Cargado exitosamente ✓' : 'Pendiente de captura ⚠️'}

---------------------------------------------------------------
[SECUENCIA DE ACTIVIDADES RELEVADA (AS-IS)]:
${activitiesText}

---------------------------------------------------------------
[PARTE 2: MODELADO, MEJORA Y ENTREGA]:
8. MODELO BPMN 2.0 EN CAMUNDA:
   • Estado / Archivo: ${f.camundaStatus || (appState.steps[8] ? 'Completado en Camunda Modeler ✓' : 'Pendiente')}

9. INVENTARIO DE OPORTUNIDADES DE MEJORA:
${f.mejoras || '   • [Por registrar]'}

10. PRESENTACIÓN EN POWERPOINT:
   • Estado: ${f.pptStatus || (appState.steps[10] ? 'Diapositivas armadas y revisadas ✓' : 'En proceso')}
===============================================================`;

  const outputEl = document.getElementById("summaryTextOutput");
  if (outputEl) outputEl.textContent = summary;

  return summary;
}

// Botones de exportación
function bindExportButtons() {
  const btnExportJson = document.getElementById("btnExportJson");
  const btnExportSummary = document.getElementById("btnExportSummary");
  const btnCopySummary = document.getElementById("btnCopySummary");

  if (btnExportJson) {
    btnExportJson.addEventListener("click", () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `MAPE_Lab01_Relevamiento_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  if (btnExportSummary) {
    btnExportSummary.addEventListener("click", () => {
      const tabResumenBtn = document.querySelector('[data-tab="tab-resumen"]');
      if (tabResumenBtn) tabResumenBtn.click();
    });
  }

  if (btnCopySummary) {
    btnCopySummary.addEventListener("click", () => {
      const text = generateSummaryText();
      navigator.clipboard.writeText(text).then(() => {
        const originalText = btnCopySummary.textContent;
        btnCopySummary.textContent = "✅ ¡Copiado!";
        setTimeout(() => {
          btnCopySummary.textContent = originalText;
        }, 2000);
      }).catch(err => {
        console.error("Error al copiar:", err);
      });
    });
  }
}

// Utilidad anti-XSS
function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
