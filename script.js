class ControlHoras {
    constructor() {
        this.registros = [];
        this.registrosSemanal = [];
    }

    registrarHoras(nombre, rango, horaEntrada, horaSalida) {
        const entrada = new Date(`2023-01-01T${horaEntrada}`);
        const salida = new Date(`2023-01-01T${horaSalida}`);
        const diferenciaMs = salida - entrada;
        const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
        const minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferenciaMs % (1000 * 60)) / 1000);

        const registro = {
            nombre,
            rango,
            horaEntrada,
            horaSalida,
            horas,
            minutos,
            segundos,
            cumplido: horas >= 3
        };

        this.registros.push(registro);
        this.actualizarTablaRegistros();
        this.actualizarResumenSemanal(registro);
    }

    actualizarTablaRegistros() {
        const tbody = document.getElementById('registro-body');
        tbody.innerHTML = '';

        this.registros.forEach(registro => {
            const tr = document.createElement('tr');
            tr.classList.add(registro.cumplido ? 'cumplido' : 'no-cumplido');
            tr.innerHTML = `
                <td>${registro.nombre}</td>
                <td>${registro.rango}</td>
                <td>${registro.horaEntrada}</td>
                <td>${registro.horaSalida}</td>
                <td>${registro.horas}h ${registro.minutos}m ${registro.segundos}s</td>
                <td class="${registro.cumplido ? 'estado-cumplido' : 'estado-incumplido'}">
                    ${registro.cumplido ? '✓' : '✗'}
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    actualizarResumenSemanal(registro) {
        let empleadoExistente = this.registrosSemanal.find(r => r.nombre === registro.nombre);

        if (empleadoExistente) {
            empleadoExistente.horas += registro.horas;
            empleadoExistente.minutos += registro.minutos;
            empleadoExistente.segundos += registro.segundos;
        } else {
            this.registrosSemanal.push({
                nombre: registro.nombre,
                horas: registro.horas,
                minutos: registro.minutos,
                segundos: registro.segundos
            });
        }

        this.actualizarTablaSemanal();
    }

    actualizarTablaSemanal() {
        const tbody = document.getElementById('resumen-body');
        tbody.innerHTML = '';

        this.registrosSemanal.forEach(registro => {
            const tr = document.createElement('tr');
            const totalHoras = registro.horas + Math.floor(registro.minutos / 60);
            const cumplido = totalHoras >= 28;

            tr.innerHTML = `
                <td>${registro.nombre}</td>
                <td>${totalHoras}h ${registro.minutos % 60}m</td>
                <td>${cumplido ? '😊' : '😢'}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    buscarPorNombre(nombre) {
        return this.registros.filter(registro => 
            registro.nombre.toLowerCase().includes(nombre.toLowerCase())
        );
    }

    limpiarRegistros() {
        this.registros = [];
        this.registrosSemanal = [];
        this.actualizarTablaRegistros();
        this.actualizarTablaSemanal();
    }
}

const controlHoras = new ControlHoras();

document.getElementById('registro-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const rango = document.getElementById('rango').value;
    const horaEntrada = document.getElementById('hora-entrada').value;
    const horaSalida = document.getElementById('hora-salida').value;

    controlHoras.registrarHoras(nombre, rango, horaEntrada, horaSalida);
    
    // Limpiar formulario
    this.reset();
});

function buscarEmpleado() {
    const nombreBusqueda = document.getElementById('buscar-nombre').value;
    const resultados = controlHoras.buscarPorNombre(nombreBusqueda);
    
    const tbody = document.getElementById('registro-body');
    tbody.innerHTML = '';

    resultados.forEach(registro => {
        const tr = document.createElement('tr');
        tr.classList.add(registro.cumplido ? 'cumplido' : 'no-cumplido');
        tr.innerHTML = `
            <td>${registro.nombre}</td>
            <td>${registro.rango}</td>
            <td>${registro.horaEntrada}</td>
            <td>${registro.horaSalida}</td>
            <td>${registro.horas}h ${registro.minutos}m ${registro.segundos}s</td>
            <td class="${registro.cumplido ? 'estado-cumplido' : 'estado-incumplido'}">
                ${registro.cumplido ? '✓' : '✗'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function limpiarTabla() {
    controlHoras.limpiarRegistros();
}