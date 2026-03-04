const buscarlibro = {
    data() {
        return {
            buscar: '',
            buscarTipo: 'titulo',
            libros: [],
            autores: []
        }
    },
    methods: {
        modificarLibro(libro) {
            this.$emit('modificar', libro);
        },
        eliminarLibro(libro) {
            alertify.confirm('Eliminar Libro', `¿Esta seguro de eliminar el libro ${libro.nombre}?`, () => {
                db.libros.delete(libro.idLibro);
                this.listarLibros();
                alertify.success(`Libro ${libro.nombre} eliminado`);
            }, () => { });
        },
        async listarLibros() {
            this.libros = await db.libros.filter(libro => libro[this.buscarTipo].toLowerCase().includes(this.buscar.toLowerCase())).toArray();
        },
        async cargarAutores() {
            this.autores = await db.autores.toArray();
        },
        nuevoLibro() {
            this.accion = 'nuevo';
            this.idLibro = '';
            this.idAutor = '';
            this.isbn = '';
            this.titulo = '';
            this.editorial = '';
            this.edicion = '';
        }
    },
    created() {
        this.listarLibros();
        this.cargarAutores();
    },
    template: `
    <div class="row">
        <div class="col-12 col-xl-10 mx-auto"> <div class="table-responsive shadow-sm rounded">
                <table class="table table-sm table-hover align-middle">
                    <thead class="bg-primary text-white">
                        <tr>
                            <th class="py-2 text-center align-middle">BUSCAR POR:</th>
                            <th class="py-2">
                                <select v-model="buscarTipo" class="form-select form-select-sm border-0 shadow-sm">
                                    <option value="isbn">ISBN</option> 
                                    <option value="titulo">TITULO</option>
                                    <option value="editorial">EDITORIAL</option>
                                    <option value="edicion">EDICION</option>
                                </select>
                            </th>
                            <th colspan="4" class="py-2">
                                <input type="text" @keyup="listarLibros()" v-model="buscar" 
                                       class="form-control form-control-sm border-0 shadow-sm" 
                                       placeholder="Escribe para buscar...">
                            </th>
                        </tr>
                        <tr class="table-dark">
                            <th>ISBN</th>
                            <th>TÍTULO</th>
                            <th>AUTOR</th>
                            <th>EDITORIAL</th>
                            <th>EDICIÓN</th>
                            <th class="text-center">ACCIÓN</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr v-for="libro in libros" @click="modificarLibro(libro)" :key="libro.idLibro" style="cursor: pointer;">
                            <td class="fw-bold text-primary">{{ libro.isbn }}</td>
                            <td>{{ libro.titulo }}</td>
                            <td>{{ this.autores[libro.idAutor].nombre }}</td>
                            <td><span class="badge bg-light text-dark border">{{ libro.editorial }}</span></td>
                            <td>{{ libro.edicion }}</td>
                            <td class="text-center">
                                <button class="btn btn-outline-danger btn-sm" 
                                    @click.stop="eliminarLibro(libro)">
                                    <i class="bi bi-trash"></i> Borrar
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
`
};