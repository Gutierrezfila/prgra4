const buscarautor = {
    data() {
        return {
            buscar: '',
            buscarTipo: 'nombre',
            autores: [],
        }
    },
    methods: {
        modificarAutor(autor) {
            this.$emit('modificar', autor);
        },
        eliminarAutor(autor) {
            alertify.confirm('Eliminar Autor', `¿Está seguro de eliminar el autor ${autor.nombre}?`, () => {
                db.autores.delete(autor.idAutor);
                this.listarAutores();
                alertify.success(`Autor ${autor.nombre} eliminado`);
            }, () => { });
        },
        async listarAutores() {
            // Filtro dinámico usando Dexie
            this.autores = await db.autores
                .filter(autor =>
                    autor[this.buscarTipo].toLowerCase().includes(this.buscar.toLowerCase())
                ).toArray();
        },
    },
    created() {
        this.listarAutores();
    },
    template: `
    <div class="card border-primary shadow-sm mt-3">
        <div class="card-header bg-primary text-white">
            <div class="row align-items-center">
                <div class="col-md-4 fw-bold">LISTADO DE AUTORES</div>
                <div class="col-md-8">
                    <div class="input-group input-group-sm">
                        <select v-model="buscarTipo" class="form-select bg-light">
                            <option value="nombre">Nombre</option>
                            <option value="pais">País</option>
                            <option value="codigo">Código</option>
                        </select>
                        <input type="text" v-model="buscar" @keyup="listarAutores" 
                               class="form-control bg-light" placeholder="Escribe para buscar...">
                        <button class="btn btn-light text-primary" @click="listarAutores">
                            🔍
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>CÓDIGO</th>
                            <th>NOMBRE</th>
                            <th>PAÍS</th>
                            <th>TELÉFONO</th>
                            <th class="text-center">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="autor in autores" :key="autor.idAutor" 
                            @click="modificarAutor(autor)" style="cursor: pointer;">
                            <td class="fw-bold">{{ autor.codigo }}</td>
                            <td>{{ autor.nombre }}</td>
                            <td>{{ autor.pais }}</td>
                            <td>{{ autor.telefono }}</td>
                            <td class="text-center">
                                <button class="btn btn-outline-danger btn-sm border-0" 
                                        @click.stop="eliminarAutor(autor)">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                        <tr v-if="autores.length == 0">
                            <td colspan="5" class="text-center text-muted py-3">
                                No se encontraron autores con esos criterios.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card-footer bg-white text-end">
            <small class="text-muted">Total de registros: {{ autores.length }}</small>
        </div>
    </div>
    `
};