const libro = {
    props: ['forms'],
    data() {
        return {
            accion: 'nuevo',
            libros: [],
            autores: [],
            idLibro: '',
            idAutor: '',
            isbn: '',
            titulo: '',
            editorial: '',
            edicion: ''
        }
    },
    methods: {
        buscarLibro() {
            this.forms.buscarLibro.mostrar = !this.forms.buscarLibro.mostrar;
            this.$emit('buscar');
        },
        modificarLibro(libro) {
            this.accion = 'modificar';
            this.idLibro = libro.idLibro;
            this.idAutor = libro.idAutor;
            this.isbn = libro.isbn;
            this.titulo = libro.titulo;
            this.editorial = libro.editorial;
            this.edicion = libro.edicion;
        },
        guardarLibro() {
            let libro = {
                idAutor: this.idAutor,
                isbn: this.isbn,
                titulo: this.titulo,
                editorial: this.editorial,
                edicion: this.edicion
            };
            if (this.accion == 'modificar') {
                libro.idLibro = this.idLibro;
            }
            db.libros.put(libro);
            this.nuevoLibro();
            this.listarLibros();
        },
        nuevoLibro() {
            this.accion = 'nuevo';
            this.idLibro = '';
            this.idAutor = '';
            this.isbn = '';
            this.titulo = '';
            this.editorial = '';
            this.edicion = '';
        },
        cargarAutores() {
            db.autores.toArray().then(autores => this.autores = autores);
        }
    },
    created() {
        this.cargarAutores();
    },
    template: `
    <div class="row">
        <div class="col-12 col-md-8 col-lg-6 mx-auto"> <form id="frmLibro" name="frmLibro" @submit.prevent="guardarLibro">
                <div class="card border-primary mb-3 shadow-sm">
                    <div class="card-header bg-primary text-white fw-bold">
                        <i class="bi bi-book me-2"></i>Registro de Libros
                    </div>
                    
                    <div class="card-body bg-light">
                        <div class="row p-1 align-items-center">
                            <div class="col-3 col-md-4 fw-semibold text-secondary">ISBN:</div>
                            <div class="col-9 col-md-8">
                                <input required v-model="isbn" type="text" name="txtisbnLibro" id="txtIsbnLibro" class="form-control border-primary-subtle">
                            </div>
                        </div>

                        <div class="row p-1 align-items-center">
                            <div class="col-3 col-md-4 fw-semibold text-secondary">TÍTULO:</div>
                            <div class="col-9 col-md-8">
                                <input required v-model="titulo" type="text" name="txtTituloLibro" id="txtTituloLibro" class="form-control border-primary-subtle">
                            </div>
                        </div>

                        <div class="row p-1 align-items-center">
                            <div class="col-3 col-md-4 fw-semibold text-secondary">EDITORIAL:</div>
                            <div class="col-9 col-md-8">
                                <input required v-model="editorial" type="text" name="txtEditorialLibro" id="txtEditorialLibro" class="form-control border-primary-subtle">
                            </div>
                        </div>

                        <div class="row p-1 align-items-center">
                            <div class="col-3 col-md-4 fw-semibold text-secondary">EDICIÓN:</div>
                            <div class="col-9 col-md-8">
                                <input required v-model="edicion" type="text" name="txtEdicionLibro" id="txtEdicionLibro" class="form-control border-primary-subtle">
                            </div>
                        </div>

                        <div class="row p-1 align-items-center">
                            <div class="col-3 col-md-4 fw-semibold text-secondary">AUTOR:</div>
                            <div class="col-9 col-md-8">
                                <select v-model="idAutor" class="form-select border-primary-subtle" @change="cargarAutores">
                                    <option v-for="autor in autores" :value="autor.idAutor">{{ autor.nombre }}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="card-footer bg-white border-top-0 text-center py-3">
                        <button type="submit" class="btn btn-success px-4 me-2">
                            <i class="bi bi-check-circle"></i> Guardar
                        </button>
                        <button type="reset" class="btn btn-outline-secondary me-2">
                            <i class="bi bi-plus-lg"></i> Nuevo
                        </button>
                        <button type="button" @click="buscarLibro" class="btn btn-outline-info">
                            <i class="bi bi-search"></i> Buscar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
`
};