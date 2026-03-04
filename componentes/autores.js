const autor = {
    props: ['forms'],
    data() {
        return {
            accion: 'nuevo',
            idAutor: '',
            codigo: '',
            nombre: '',
            pais: '',
            telefono: '',
        }
    },
    methods: {
        buscarAutor() {
            this.forms.buscarAutor.mostrar = !this.forms.buscarAutor.mostrar;
            this.$emit('buscar');
        },
        modificarAutor(autor) {
            this.accion = 'modificar';
            this.idAutor = autor.idAutor;
            this.codigo = autor.codigo;
            this.nombre = autor.nombre;
            this.pais = autor.pais;
            this.telefono = autor.telefono;
        },
        guardarAutor() {
            let autor = {
                codigo: this.codigo,
                nombre: this.nombre,
                pais: this.pais,
                telefono: this.telefono
            };
            if (this.accion == 'modificar') {
                autor.idAutor = this.idAutor;
            }
            db.autores.put(autor);
            this.nuevoAutor();
        },
        nuevoAutor() {
            this.accion = 'nuevo';
            this.idAutor = '';
            this.codigo = '';
            this.nombre = '';
            this.pais = '';
            this.telefono = '';
        }
    },
    template: `
    <div class="card border-primary shadow-sm">
        <div class="card-header bg-primary text-white fw-bold">
            Registro de Autores
        </div>
        
        <div class="card-body bg-light">
            <form @submit.prevent="guardarAutor">
                <div class="row mb-3">
                    <label for="txtCodigoAutor" class="col-md-3 col-form-label text-primary fw-semibold">Código:</label>
                    <div class="col-md-9">
                        <input id="txtCodigoAutor" name="txtCodigoAutor" v-model="codigo" type="text" class="form-control border-primary" required>
                    </div>
                </div>

                <div class="row mb-3">
                    <label for="txtNombreAutor" class="col-md-3 col-form-label text-primary fw-semibold">Nombre:</label>
                    <div class="col-md-9">
                        <input id="txtNombreAutor" name="txtNombreAutor" v-model="nombre" type="text" class="form-control border-primary" required pattern="[A-Za-zñÑáéíóú ]{3,150}">
                    </div>
                </div>

                <div class="row mb-3">
                    <label for="txtPaisAutor" class="col-md-3 col-form-label text-primary fw-semibold">País:</label>
                    <div class="col-md-9">
                        <input id="txtPaisAutor" name="txtPaisAutor" v-model="pais" type="text" class="form-control border-primary" required>
                    </div>
                </div>

                <div class="row mb-3">
                    <label for="txtTelefonoAutor" class="col-md-3 col-form-label text-primary fw-semibold">Teléfono:</label>
                    <div class="col-md-9">
                        <input id="txtTelefonoAutor" name="txtTelefonoAutor" v-model="telefono" type="text" class="form-control border-primary">
                    </div>
                </div>
            </form>
        </div>

        <div class="card-footer text-center bg-white border-top-0">
            <button @click="guardarAutor" class="btn btn-success px-4 me-2">
                <span v-if="accion==='nuevo'">Guardar</span>
                <span v-else>Actualizar</span>
            </button>
            <button @click="nuevoAutor" class="btn btn-outline-secondary me-2">Nuevo</button>
            <button @click="buscarAutor" class="btn btn-outline-primary">Buscar</button>
        </div>
    </div>
`
};