<template>
  <div class="container mt-4">
    
    <!-- TÍTULO -->
    <div class="text-center mb-4">
      <h1 class="fw-bold text-primary">🎓 Gestión de Estudiantes</h1>
      <p class="text-muted">Sistema de administración de estudiantes</p>
    </div>

    <!-- BÚSQUEDA -->
    <div class="card shadow mb-4">
      <div class="card-body">
        <div class="input-group">
          <span class="input-group-text bg-primary text-white">🔍</span>
          <input 
            v-model="buscar" 
            @input="obtenerEstudiantes"
            type="text" 
            class="form-control" 
            placeholder="Buscar por nombre, carnet o carrera...">
        </div>
      </div>
    </div>

    <!-- NOTIFICACIÓN -->
    <div v-if="notificacion.mensaje" 
         :class="`alert alert-${notificacion.tipo} alert-dismissible fade show`">
      {{ notificacion.mensaje }}
      <button @click="notificacion.mensaje=''" type="button" class="btn-close"></button>
    </div>

    <!-- BOTÓN AGREGAR -->
    <div class="mb-3">
      <button @click="abrirModal()" class="btn btn-primary">
        ➕ Agregar Estudiante
      </button>
    </div>

    <!-- TABLA -->
    <div class="card shadow">
      <div class="card-body">
        <table class="table table-hover table-striped align-middle">
          <thead class="table-primary">
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Carnet</th>
              <th>Carrera</th>
              <th>Correo</th>
              <th>Promedio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="estudiantes.length === 0">
              <td colspan="8" class="text-center text-muted">No hay estudiantes registrados</td>
            </tr>
            <tr v-for="(e, i) in estudiantes" :key="e.id">
              <td>{{ i + 1 }}</td>
              <td>{{ e.nombre }}</td>
              <td>{{ e.apellido }}</td>
              <td><span class="badge bg-secondary">{{ e.carnet }}</span></td>
              <td>{{ e.carrera }}</td>
              <td>{{ e.correo }}</td>
              <td>
                <span :class="`badge ${e.promedio >= 6 ? 'bg-success' : 'bg-danger'}`">
                  {{ e.promedio ?? 'N/A' }}
                </span>
              </td>
              <td>
                <button @click="abrirModal(e)" class="btn btn-warning btn-sm me-1">✏️</button>
                <button @click="eliminar(e.id)" class="btn btn-danger btn-sm">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL -->
    <div v-if="mostrarModal" class="modal d-block" style="background:rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">{{ form.id ? '✏️ Editar' : '➕ Agregar' }} Estudiante</h5>
            <button @click="cerrarModal" class="btn-close btn-close-white"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input v-model="form.nombre" type="text" class="form-control" placeholder="Nombre">
            </div>
            <div class="mb-3">
              <label class="form-label">Apellido</label>
              <input v-model="form.apellido" type="text" class="form-control" placeholder="Apellido">
            </div>
            <div class="mb-3">
              <label class="form-label">Carnet</label>
              <input v-model="form.carnet" type="text" class="form-control" placeholder="Carnet">
            </div>
            <div class="mb-3">
              <label class="form-label">Carrera</label>
              <input v-model="form.carrera" type="text" class="form-control" placeholder="Carrera">
            </div>
            <div class="mb-3">
              <label class="form-label">Correo</label>
              <input v-model="form.correo" type="email" class="form-control" placeholder="Correo">
            </div>
            <div class="mb-3">
              <label class="form-label">Promedio</label>
              <input v-model="form.promedio" type="number" step="0.01" min="0" max="10" class="form-control" placeholder="Promedio">
            </div>
          </div>
          <div class="modal-footer">
            <button @click="cerrarModal" class="btn btn-secondary">Cancelar</button>
            <button @click="guardar" class="btn btn-primary">
              {{ form.id ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      estudiantes: [],
      buscar: '',
      mostrarModal: false,
      notificacion: { mensaje: '', tipo: 'success' },
      form: {
        id: null,
        nombre: '',
        apellido: '',
        carnet: '',
        carrera: '',
        correo: '',
        promedio: ''
      }
    }
  },
  mounted() {
    this.obtenerEstudiantes()
  },
  methods: {
    async obtenerEstudiantes() {
      const res = await axios.get('/api/estudiantes', {
        params: { buscar: this.buscar }
      })
      this.estudiantes = res.data
    },
    abrirModal(estudiante = null) {
      if (estudiante) {
        this.form = { ...estudiante }
      } else {
        this.form = { id: null, nombre: '', apellido: '', carnet: '', carrera: '', correo: '', promedio: '' }
      }
      this.mostrarModal = true
    },
    cerrarModal() {
      this.mostrarModal = false
    },
    async guardar() {
      try {
        if (this.form.id) {
          await axios.put(`/api/estudiantes/${this.form.id}`, this.form)
          this.mostrarNotificacion('✅ Estudiante actualizado correctamente', 'success')
        } else {
          await axios.post('/api/estudiantes', this.form)
          this.mostrarNotificacion('✅ Estudiante agregado correctamente', 'success')
        }
        this.cerrarModal()
        this.obtenerEstudiantes()
      } catch (e) {
        this.mostrarNotificacion('❌ Error al guardar. Verifica los datos.', 'danger')
      }
    },
    async eliminar(id) {
      if (confirm('¿Estás seguro de eliminar este estudiante?')) {
        await axios.delete(`/api/estudiantes/${id}`)
        this.mostrarNotificacion('🗑️ Estudiante eliminado correctamente', 'warning')
        this.obtenerEstudiantes()
      }
    },
    mostrarNotificacion(mensaje, tipo) {
      this.notificacion = { mensaje, tipo }
      setTimeout(() => { this.notificacion.mensaje = '' }, 3000)
    }
  }
}
</script>