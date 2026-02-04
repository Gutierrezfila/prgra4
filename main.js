const { createApp } = Vue;

createApp({
    data() {
        return {
            alumno: {
                codigo: "",
                nombre: "",
                direccion: "",
                municipio: "",
                departamento: "",
                telefono: "",
                fechaNacimiento: "",
                sexo: "",
                email: ""
            },
            accion: 'nuevo',
            id: 0,
            buscar: '',
            alumnos: []
        }
    },
    methods: {
        obtenerAlumnos() {
            let n = localStorage.length;
            this.alumnos = [];
            for (let i = 0; i < n; i++) {
                let key = localStorage.key(i);
                if (Number(key)) {
                    try {
                        let data = JSON.parse(localStorage.getItem(key));
                        // Filtrar por nombre o código
                        if (data.nombre && data.codigo) {
                            if (data.nombre.toUpperCase().includes(this.buscar.toUpperCase()) ||
                                data.codigo.toUpperCase().includes(this.buscar.toUpperCase())) {
                                this.alumnos.push(data);
                            }
                        }
                    } catch (e) {
                        console.error("Error al parsear datos:", e);
                    }
                }
            }
            this.alumnos.sort((a, b) => a.codigo.localeCompare(b.codigo));
        },

        eliminarAlumno(id, e) {
            e.stopPropagation();
            if (confirm("¿Está seguro de eliminar este alumno?")) {
                localStorage.removeItem(id);
                this.obtenerAlumnos();
                this.mostrarNotificacion('Alumno eliminado correctamente', 'success');
            }
        },

        modificarAlumno(alumno) {
            this.accion = 'modificar';
            this.id = alumno.id;
            this.alumno.codigo = alumno.codigo;
            this.alumno.nombre = alumno.nombre;
            this.alumno.direccion = alumno.direccion;
            this.alumno.municipio = alumno.municipio;
            this.alumno.departamento = alumno.departamento;
            this.alumno.telefono = alumno.telefono;
            this.alumno.fechaNacimiento = alumno.fechaNacimiento;
            this.alumno.sexo = alumno.sexo;
            this.alumno.email = alumno.email;

            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        guardarAlumno() {
            if (!this.validarFormulario()) {
                alert("Por favor, complete todos los campos requeridos");
                return;
            }

            if (!this.validarEmail(this.alumno.email)) {
                alert("Por favor, ingrese un email válido");
                return;
            }

            let datos = {
                id: this.accion === 'modificar' ? this.id : this.getId(),
                codigo: this.alumno.codigo.trim(),
                nombre: this.alumno.nombre.trim(),
                direccion: this.alumno.direccion,
                municipio: this.alumno.municipio.trim(),
                departamento: this.alumno.departamento,
                telefono: this.alumno.telefono.trim(),
                fechaNacimiento: this.alumno.fechaNacimiento,
                sexo: this.alumno.sexo,
                email: this.alumno.email.trim().toLowerCase()
            };

            let codigoDuplicado = this.buscarAlumno(datos.codigo);
            if (codigoDuplicado && this.accion === 'nuevo') {
                alert("El código del alumno ya existe: " + codigoDuplicado.nombre);
                return;
            }

            if (this.accion === 'modificar' && codigoDuplicado && codigoDuplicado.id !== datos.id) {
                alert("El código del alumno ya existe: " + codigoDuplicado.nombre);
                return;
            }

            try {
                localStorage.setItem(datos.id.toString(), JSON.stringify(datos));

                this.mostrarNotificacion(
                    this.accion === 'nuevo' ? 'Alumno registrado correctamente' : 'Alumno actualizado correctamente',
                    'success'
                );

                this.limpiarFormulario();
                this.obtenerAlumnos();
            } catch (e) {
                alert("Error al guardar el alumno: " + e.message);
                console.error("Error en guardarAlumno:", e);
            }
        },

        getId() {
            return new Date().getTime();
        },

        limpiarFormulario() {
            this.accion = 'nuevo';
            this.id = 0;
            this.alumno.codigo = '';
            this.alumno.nombre = '';
            this.alumno.direccion = '';
            this.alumno.municipio = '';
            this.alumno.departamento = '';
            this.alumno.telefono = '';
            this.alumno.fechaNacimiento = '';
            this.alumno.sexo = '';
            this.alumno.email = '';
        },

        buscarAlumno(codigo = '') {
            if (!codigo) return null;

            let n = localStorage.length;
            for (let i = 0; i < n; i++) {
                let key = localStorage.key(i);
                if (Number(key)) {
                    try {
                        let datos = JSON.parse(localStorage.getItem(key));
                        if (datos?.codigo && datos.codigo.trim().toUpperCase() === codigo.trim().toUpperCase()) {
                            return datos;
                        }
                    } catch (e) {
                        console.error("Error al parsear datos:", e);
                    }
                }
            }
            return null;
        },

        validarFormulario() {
            return this.alumno.codigo.trim() !== '' &&
                this.alumno.nombre.trim() !== '' &&
                this.alumno.direccion.trim() !== '' &&
                this.alumno.municipio.trim() !== '' &&
                this.alumno.departamento !== '' &&
                this.alumno.telefono.trim() !== '' &&
                this.alumno.fechaNacimiento !== '' &&
                this.alumno.sexo !== '' &&
                this.alumno.email.trim() !== '';
        },

        validarEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },

        mostrarNotificacion(mensaje, tipo) {
            const notification = document.createElement('div');
            notification.className = `alert alert-${tipo} position-fixed top-0 start-50 translate-middle-x mt-3`;
            notification.style.zIndex = '9999';
            notification.style.minWidth = '300px';
            notification.innerHTML = `
                <i class="bi bi-${tipo === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
                ${mensaje}
            `;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    },

    mounted() {
        this.obtenerAlumnos();
    }
}).mount("#app");