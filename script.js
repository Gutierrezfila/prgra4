let db;
let editandoID = null;

// 1. INICIALIZACIÓN
async function initDB() {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
    });

    const savedData = localStorage.getItem('academico_wasm_db');
    if (savedData) {
        db = new SQL.Database(new Uint8Array(JSON.parse(savedData)));
    } else {
        db = new SQL.Database();
        db.run(`
            CREATE TABLE alumnos (carnet TEXT PRIMARY KEY, nombre TEXT);
            CREATE TABLE materias (codigo TEXT PRIMARY KEY, nombre_materia TEXT, uv INTEGER);
            CREATE TABLE docentes (id_docente TEXT PRIMARY KEY, especialidad TEXT);
            CREATE TABLE matriculas (id INTEGER PRIMARY KEY AUTOINCREMENT, anio INTEGER, ciclo TEXT);
            CREATE TABLE inscripciones (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                carnet_alumno TEXT, 
                codigo_materia TEXT, 
                fecha TEXT,
                FOREIGN KEY(carnet_alumno) REFERENCES alumnos(carnet),
                FOREIGN KEY(codigo_materia) REFERENCES materias(codigo)
            );
        `);
        persistir();
    }
}

function persistir() {
    const data = db.export();
    localStorage.setItem('academico_wasm_db', JSON.stringify(Array.from(data)));
}

// 2. GUARDAR Y EDITAR
function configurarForm(idForm, tabla, columnas) {
    const form = document.getElementById(idForm);
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const valores = columnas.map(id => document.getElementById(id).value);
        const placeholders = columnas.map(() => '?').join(',');

        try {
            db.run(`INSERT OR REPLACE INTO ${tabla} (${columnas.join(',')}) VALUES (${placeholders})`, valores);
            persistir();
            
            alert(editandoID ? "Registro actualizado correctamente" : "Registro guardado en SQLite");
            
            // Reset UI de edición
            editandoID = null;
            const btn = form.querySelector('button[type="submit"]');
            btn.innerText = "GUARDAR";
            btn.className = "btn btn-save px-4";
            
            form.reset();
            if (document.getElementById('seccionConsulta').style.display === 'block') mostrarConsulta();
        } catch (err) {
            alert("Error SQL: " + err.message);
        }
    });
}

// 3. BUSCADOR Y CONSULTA
function mostrarConsulta(filtro = "") {
    const activeTab = document.querySelector('.nav-link.active').innerText.toLowerCase();
    let tabla = activeTab.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (tabla === "inscripcion") tabla = "inscripciones";
    if (tabla === "matricula") tabla = "matriculas";

    let query = `SELECT * FROM ${tabla}`;
    if (filtro) {
        const info = db.exec(`PRAGMA table_info(${tabla})`)[0].values;
        const condiciones = info.map(col => `${col[1]} LIKE '%${filtro}%'`).join(' OR ');
        query += ` WHERE ${condiciones}`;
    }

    const res = db.exec(query);
    const seccion = document.getElementById('seccionConsulta');
    const cabecera = document.getElementById('cabeceraTabla');
    const cuerpo = document.getElementById('cuerpoTabla');

    seccion.style.display = 'block';
    cabecera.innerHTML = "";
    cuerpo.innerHTML = "";

    if (res.length === 0) {
        cuerpo.innerHTML = `<tr><td colspan="10" class="text-center text-muted">No hay registros que coincidan</td></tr>`;
        return;
    }

    const cols = res[0].columns;
    const rows = res[0].values;

    cabecera.innerHTML = `<tr>${cols.map(c => `<th>${c.toUpperCase()}</th>`).join('')}<th class="text-center">ACCIONES</th></tr>`;
    cuerpo.innerHTML = rows.map(row => `
        <tr>
            ${row.map(cell => `<td>${cell}</td>`).join('')}
            <td class="text-center">
                <button class="btn btn-info btn-sm text-white me-2" onclick="prepararEdicion('${tabla}', '${cols[0]}', '${row[0]}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminar('${tabla}', '${cols[0]}', '${row[0]}')">Eliminar</button>
            </td>
        </tr>
    `).join('');
    
    document.getElementById('tituloConsulta').innerText = "TABLA: " + tabla.toUpperCase();
}

function filtrarBusqueda() {
    const texto = document.getElementById('inputBuscar').value;
    mostrarConsulta(texto);
}

// 4. LÓGICA DE EDICIÓN
function prepararEdicion(tabla, colId, valor) {
    const res = db.exec(`SELECT * FROM ${tabla} WHERE ${colId} = ?`, [valor]);
    if (res.length === 0) return;

    const datos = res[0].values[0];
    const columnas = res[0].columns;
    const activePane = document.querySelector('.tab-pane.active');
    const form = activePane.querySelector('form');

    columnas.forEach((col, i) => {
        const input = document.getElementById(col);
        if (input) input.value = datos[i];
    });

    editandoID = valor;
    const btn = form.querySelector('button[type="submit"]');
    btn.innerText = "ACTUALIZAR DATOS";
    btn.className = "btn btn-warning px-4";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function eliminar(tabla, colId, valor) {
    if(confirm(`¿Desea eliminar el registro ${valor}?`)) {
        db.run(`DELETE FROM ${tabla} WHERE ${colId} = ?`, [valor]);
        persistir();
        mostrarConsulta();
    }
}

// 5. SELECTS PARA INSCRIPCIÓN
function cargarSelects() {
    const sAlu = document.getElementById('carnet_alumno');
    const sMat = document.getElementById('codigo_materia');
    
    const aluData = db.exec("SELECT carnet, nombre FROM alumnos");
    const matData = db.exec("SELECT codigo, nombre_materia FROM materias");

    sAlu.innerHTML = aluData.length ? aluData[0].values.map(v => `<option value="${v[0]}">${v[1]} (${v[0]})</option>`).join('') : '<option>No hay alumnos</option>';
    sMat.innerHTML = matData.length ? matData[0].values.map(v => `<option value="${v[0]}">${v[1]}</option>`).join('') : '<option>No hay materias</option>';
}

// INICIO
initDB().then(() => {
    configurarForm('formAlumnos', 'alumnos', ['carnet', 'nombre']);
    configurarForm('formMaterias', 'materias', ['codigo', 'nombre_materia', 'uv']);
    configurarForm('formDocentes', 'docentes', ['id_docente', 'especialidad']);
    configurarForm('formMatricula', 'matriculas', ['anio', 'ciclo']);
    configurarForm('formInscripcion', 'inscripciones', ['carnet_alumno', 'codigo_materia', 'fecha']);

    document.querySelectorAll('a[data-bs-toggle="pill"]').forEach(tab => {
        tab.addEventListener('shown.bs.tab', (e) => {
            document.getElementById('seccionConsulta').style.display = 'none';
            document.getElementById('inputBuscar').value = "";
            if (e.target.getAttribute('href') === '#tab-inscripcion') cargarSelects();
        });
    });
});