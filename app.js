/*
app.js - Simulador de Crédito
Proyecto Coderhouse, Entrega 3
Ezequiel A. Verón
*/
/*Definición de los estados del Simulador
0: Inicial: se pide el Nombre y Apellido
1: Edad: Se pide la edad del aplicante
2: Importe: Se solicita el importe que el aplicante quiere solicitar
3: Cuotas: Se pide la cantidad de cuotas en las que desea abonarse el crédito
4: Renderizado: Se tienen todos los datos y se renderiza el crédito
*/
class Credito {
    constructor(estado, nombreApellido, edad, importe, cuotas) {
        this.estado = estado;
        this.nombreApellido = nombreApellido;
        this.edad = edad;
        this.importe = importe;
        this.cuotas = cuotas;
    }
    //GETTERS
    getEstado = () => this.estado;
    getNombreApellido = () => this.nombreApellido;
    getEdad = () => this.edad;
    getImporte = () => this.importe;
    getCuotas = () => this.cuotas;

    //SETTERS
    setEstado = (estado) => this.estado = estado;
    setNombreApellido = (nombreApellido) => this.nombreApellido = nombreApellido;
    setEdad = (edad) => this.edad = edad;
    setImporte = (importe) => this.importe = importe;
    setCuotas = (cuotas) => this.cuotas = cuotas;
}

//Reset del Préstamo Guardado
const resetPrestamo = () => {
    if (confirm('¿Deseas eliminar el Crédito almacenado?\nEsta acción no se puede revertir')) {
        sessionStorage.removeItem('credito');
        credito = new Credito(0, '', 0, 0, 0);
        const cuadroCuotas = document.querySelector(".cuadroCuotas");
        if (cuadroCuotas !== null) {
            cuadroCuotas.remove();
        }
        const cuadroResumen = document.querySelector(".cuadroResumen");
        if (cuadroResumen !== null) {
            cuadroResumen.remove();
        }
        renderHTML();
    }
}
//Lectura del Crédito Almacenado en sessionStorage
let creditoAlmacenado = sessionStorage.getItem('credito');
if (!creditoAlmacenado) {
    credito = new Credito(0, '', 0, 0, 0);
    sessionStorage.setItem('credito', JSON.stringify(credito));
} else {
    datosCredito = JSON.parse(creditoAlmacenado);
    credito = new Credito(datosCredito.estado, datosCredito.nombreApellido, datosCredito.edad, datosCredito.importe, datosCredito.cuotas);
}

//Array para el manejo de mensajes de error
const mensajesDeError = [];
mensajesDeError[100] = "No has ingresado un nombre. Por favor, vuelve a intentarlo.";
mensajesDeError[101] = "No podemos otorgarte un préstamo ya que no cumples con el rango de edad necesario";
mensajesDeError[102] = "El importe que has solicitado no se encuentra en el rango correcto. Por favor, vuelve a intentarlo";
mensajesDeError[103] = "Las cuotas que especificaste no son correctas. Por favor, vuelve a intentarlo.";

//Clase con la configuración del simulador
class Simulador {
    constructor(interes, edadMinima, edadMaxima, impMinimoPermitido, impMaximoPermitido, cuotasMinimas, cuotasMaximas) {
        this.interes = interes;
        this.edadMinima = edadMinima;
        this.edadMaxima = edadMaxima;
        this.impMinimoPermitido = impMinimoPermitido;
        this.impMaximoPermitido = impMaximoPermitido;
        this.cuotasMinimas = cuotasMinimas;
        this.cuotasMaximas = cuotasMaximas;
    }
}

//Clase para el manejo de errores
class ManejoErrores {
    constructor(resultado = false, codigo = false) {
        this.resultado = resultado;
        this.codigo = codigo;
    }
    obtenerMensajeError = () => mensajesDeError[this.codigo];
}

const enviarNotificacion = (tipoNotificacion, mensaje, duracionSegundos = 3) => {
    let bgToast = '';
    if (tipoNotificacion == 'error') {
        bgToast = 'linear-gradient(to right, #C81F70, #D19592)'
    } else if (tipoNotificacion == 'ok') {
        bgToast = 'linear-gradient(to right, #00b09b, #96c93d)'
    }
    Toastify({
        text: mensaje,
        duration: (1000 * duracionSegundos),
        backgroundColor: bgToast,
    }).showToast();
}


const parametrosSimulador = new Simulador(0.6, 18, 100, 100000, 1000000, 12, 70);

//Funcionalidad de los Botones 'Anterior' y 'Siguiente'
const handlerPasoAnterior = () => {
    if (credito.getEstado() === 0) {
        enviarNotificacion('error', 'Estás al comienzo del proceso, no puedes ir para atrás');
    } else {
        credito.setEstado(credito.getEstado() - 1);
    }
    renderHTML();
}

const handlerPasoSiguiente = () => {
    switch (credito.getEstado()) {
        case 0:
            const validacionNombre = validarNombre(inputRequerimiento.value);
            if (validacionNombre.resultado === false) {
                enviarNotificacion('error', validacionNombre.obtenerMensajeError());
            } else {
                credito.setNombreApellido(inputRequerimiento.value);
                credito.setEstado(credito.getEstado() + 1);
                sessionStorage.setItem('credito', JSON.stringify(credito));
                inputRequerimiento.value = '';

                renderHTML();
            }
            break;

        case 1:
            const validacionEdad = validarEdad(parseInt(inputRequerimiento.value));
            if (validacionEdad.resultado === false) {
                enviarNotificacion('error', validacionEdad.obtenerMensajeError());
            } else {
                credito.setEdad(parseInt(inputRequerimiento.value));
                credito.setEstado(credito.getEstado() + 1);
                sessionStorage.setItem('credito', JSON.stringify(credito));
                inputRequerimiento.value = '';

                renderHTML();
            }
            break;

        case 2:
            const validacionImporte = validarImporteSolicitado(parseFloat(inputRequerimiento.value).toFixed(2));
            if (validacionImporte.resultado === false) {
                enviarNotificacion('error', validacionImporte.obtenerMensajeError());
            } else {
                credito.setImporte(parseFloat(inputRequerimiento.value).toFixed(2));
                credito.setEstado(credito.getEstado() + 1);
                sessionStorage.setItem('credito', JSON.stringify(credito));
                inputRequerimiento.value = '';
                renderHTML();
            }
            break;
        case 3:
            const validacionCuotas = validarCuotas(parseInt(inputRequerimiento.value));
            if (validacionCuotas.resultado === false) {
                enviarNotificacion('error', validacionCuotas.obtenerMensajeError());
            } else {
                credito.setCuotas(parseInt(inputRequerimiento.value));
                credito.setEstado(credito.getEstado() + 1);
                sessionStorage.setItem('credito', JSON.stringify(credito));
                inputRequerimiento.value = '';
                enviarNotificacion('ok', 'Gracias ' + credito.getNombreApellido() + ", éste es tu préstamo:");
                renderHTML();
            }
    }

}
//Captura de elementos del DOM
const btnAnterior = document.querySelector(".btnAnterior");
btnAnterior.addEventListener('click', handlerPasoAnterior);

const btnReset = document.querySelector(".btnReset");
btnReset.addEventListener('click', resetPrestamo);

const btnSiguiente = document.querySelector(".btnSiguiente");
btnSiguiente.addEventListener('click', handlerPasoSiguiente);

const labelRequerimiento = document.querySelector(".labelRequerimiento");
const inputRequerimiento = document.querySelector(".inputRequerimiento");
const cuadroSimulador = document.querySelector(".cuadroSimulador");
const divTablaCuotas = document.querySelector(".divTablaCuotas");
const divTablaResumen = document.querySelector(".divTablaResumen");
const subtitulo = document.querySelector(".subtitulo");

//Función que arma el subtítulo según los datos que tengo cargados
const armadoSubtitulo = () => {
    let txtSubtitulo = 'Indica el importe que necesitas y lo calcularemos.';
    if (credito.getNombreApellido() !== '') {
        txtSubtitulo = 'Hola <b>' + credito.getNombreApellido() + '</b>';
    }
    if (credito.getEdad() > 0) {
        txtSubtitulo += '. Tienes <b>' + credito.getEdad() + '</b> años';
    }
    if (credito.getImporte() > 0) {
        txtSubtitulo += '. Solicitaste <b>$' + credito.getImporte() + '</b>';
    }
    if (credito.getCuotas() > 0) {
        txtSubtitulo += ' pagaderos en <b>' + credito.getCuotas() + '</b> Cuotas mensuales';
    }
    subtitulo.innerHTML = txtSubtitulo;
}

//Función que renderiza el HTML y maneja el DOM según el estado del crédito
const renderHTML = () => {
    switch (credito.getEstado()) {
        case 0:
            labelRequerimiento.innerHTML = 'Introduce tu Nombre y Apellido:';
            btnAnterior.style.display = 'none';
            btnReset.style.display = 'none';
            btnSiguiente.style.display = '';
            cuadroSimulador.style.display = '';
            divTablaCuotas.innerHTML = '';
            divTablaResumen.innerHTML = '';
            btnSiguiente.className = 'btn btn-primary';
            btnSiguiente.innerHTML = 'Siguiente >';
            inputRequerimiento.value = credito.getNombreApellido();
            inputRequerimiento.focus();
            break;
        case 1:
            labelRequerimiento.innerHTML = 'Ingresa tu Edad (Mínimo: ' + parametrosSimulador.edadMinima + " / Máximo: " + parametrosSimulador.edadMaxima + "):";
            btnAnterior.style.display = '';
            btnReset.style.display = '';
            btnSiguiente.style.display = '';
            cuadroSimulador.style.display = '';
            btnSiguiente.className = 'btn btn-primary';
            btnSiguiente.innerHTML = 'Siguiente >';
            if (credito.getEdad() > 0) {
                inputRequerimiento.value = credito.getEdad();
            }
            inputRequerimiento.focus();
            break;
        case 2:
            labelRequerimiento.innerHTML = 'Importe Solicitado: (Mínimo: ' + parametrosSimulador.impMinimoPermitido + " / Máximo: " + parametrosSimulador.impMaximoPermitido + "):";
            btnAnterior.style.display = '';
            btnReset.style.display = '';
            btnSiguiente.style.display = '';
            cuadroSimulador.style.display = '';
            btnSiguiente.className = 'btn btn-primary';
            btnSiguiente.innerHTML = 'Siguiente >';
            if (credito.getImporte() > 0) {
                inputRequerimiento.value = credito.getImporte();
            }
            inputRequerimiento.focus();
            break;
        case 3:
            labelRequerimiento.innerHTML = 'Cantidad de Cuotas: (Mínimo: ' + parametrosSimulador.cuotasMinimas + " / Máximo: " + parametrosSimulador.cuotasMaximas + "):";
            btnAnterior.style.display = '';
            btnReset.style.display = '';
            btnSiguiente.style.display = '';
            cuadroSimulador.style.display = '';
            btnSiguiente.className = 'btn btn-success';
            btnSiguiente.innerHTML = 'Calcular';
            if (credito.getCuotas() > 0) {
                inputRequerimiento.value = credito.getCuotas();
            }
            inputRequerimiento.focus();
            break;
        case 4:
            cuadroSimulador.style.display = 'none';
            const totalPrestamo = parseFloat(credito.getImporte()) + (parseFloat(credito.getImporte()) * parametrosSimulador.interes);
            const valorCuota = totalPrestamo / credito.getCuotas();
            const capitalCuota = parseFloat(credito.getImporte()) / credito.getCuotas();
            const interesCuota = capitalCuota * parametrosSimulador.interes;
            const totalInteres = parseFloat(credito.getImporte()) * parametrosSimulador.interes;
            let tablaResumen = document.createElement("div");
            tablaResumen.innerHTML = armarTablaResumen(credito.getNombreApellido(), credito.getEdad(), parseFloat(credito.getImporte()), totalPrestamo, totalInteres, credito.getCuotas(), parametrosSimulador.interes, capitalCuota, interesCuota, valorCuota);
            tablaResumen.className = 'container cuadroResumen';
            document.body.appendChild(tablaResumen);
            let tablaCuotas = document.createElement("div");
            tablaCuotas.className = 'container cuadroCuotas';
            tablaCuotas.innerHTML = armarTablaHTMLCuotas(parseFloat(credito.getImporte()), capitalCuota, interesCuota, credito.getCuotas());
            document.body.appendChild(tablaCuotas);
            const btnReiniciar = document.querySelector(".btnReiniciar");
            btnReiniciar.addEventListener('click', resetPrestamo);
            break;
    }
    armadoSubtitulo();
}

//Armado de Tablas de Cuotas y Resumen
const armarTablaHTMLCuotas = (solicitado, capitalCuota, interesCuota, meses) => {
    let tablaCuotas = "<table class='table table-bordered table-striped'>";
    tablaCuotas += "<thead><tr><th>Cuota</th><th>Capital Adeudado</th><th>Interés Adeudado</th></tr></thead><tbody>";
    let capitalAdeudado = solicitado;
    let interesAdeudado = (capitalCuota * parametrosSimulador.interes * meses);
    for (let cuota = 1; cuota <= meses; cuota++) {
        capitalAdeudado -= capitalCuota;
        interesAdeudado -= interesCuota;
        tablaCuotas += "<tr><td>" + cuota + "</td><td>$" + Math.abs(capitalAdeudado.toFixed(2)) + "</td><td>$" + Math.abs(interesAdeudado.toFixed(2)) + "</td></tr>";
    }
    tablaCuotas += "</tbody></table>";
    return tablaCuotas;
}
const armarTablaResumen = (nombre, edad, solicitado, totalPrestamo, totalInteres, meses, interes, capitalCuota, interesCuota, valorCuota) => {
    let tablaResumen = "<table class='table table-bordered table-striped'><thead><tr><th colspan='2'>Datos del Préstamo</th></tr></thead>";
    tablaResumen += "<tbody><tr><td>Nombre</td><td><strong>" + nombre + "</strong></td></tr>";
    tablaResumen += "<tr><td>Edad</td><td><strong>" + edad + "</strong></td></tr>";
    tablaResumen += "<tr><td>Importe Solicitado</td><td><strong>$" + solicitado + "</strong></td></tr>";
    tablaResumen += "<tr><td>Tasa de Interés</td><td><strong>" + (interes * 100) + "%</strong></td></tr>";
    tablaResumen += "<tr><td>Importe Interés</td><td><strong>$" + totalInteres.toFixed(2) + "</strong></td></tr>";
    tablaResumen += "<tr><td>Total Adeudado</td><td><strong>$" + totalPrestamo.toFixed(2) + "</strong></td></tr>";
    tablaResumen += "<tr><td>Cuotas Mensuales</td><td><strong>" + meses + "</strong></td></tr>";
    tablaResumen += "<tr><td>Capital por Cuota</td><td><strong>$" + capitalCuota.toFixed(2) + "</strong></td></tr>";
    tablaResumen += "<tr><td>Interés por Cuota</td><td><strong>$" + interesCuota.toFixed(2) + "</strong></td></tr>";
    tablaResumen += "<tr><td>Valor total de Cuota</td><td><strong>$" + valorCuota.toFixed(2) + "</strong></td></tr>";
    tablaResumen += "<tr><td colspan='2' class='text-center'><button class='btn btn-danger btnReiniciar'>Comenzar de Nuevo</button></td></tr></tbody></table>";
    return tablaResumen;
}

//Funciones para Validaciones
const validarNombre = (nombre) => {
    let resultadoValidacion = new ManejoErrores();
    if (nombre == null || nombre == "") {
        resultadoValidacion.resultado = false;
        resultadoValidacion.codigo = 100;
    } else {
        resultadoValidacion = true;
    }
    return resultadoValidacion;
}
const validarEdad = (edad) => {
    let resultadoValidacion = new ManejoErrores();
    if (edad < parametrosSimulador.edadMinima || isNaN(edad) || edad > parametrosSimulador.edadMaxima) {
        resultadoValidacion.resultado = false;
        resultadoValidacion.codigo = 101;
    } else {
        resultadoValidacion.resultado = true;
    }
    return resultadoValidacion;
}
const validarImporteSolicitado = (solicitado) => {
    let resultadoValidacion = new ManejoErrores();
    if (solicitado < parametrosSimulador.impMinimoPermitido || solicitado > parametrosSimulador.impMaximoPermitido || isNaN(solicitado)) {
        resultadoValidacion.resultado = false;
        resultadoValidacion.codigo = 102;
    } else {
        resultadoValidacion.resultado = true;
    }
    return resultadoValidacion;
}
const validarCuotas = (meses) => {
    let resultadoValidacion = new ManejoErrores();
    if (meses < parametrosSimulador.cuotasMinimas || meses > parametrosSimulador.cuotasMaximas || isNaN(meses)) {
        resultadoValidacion.resultado = false;
        resultadoValidacion.codigo = 103;
    } else {
        resultadoValidacion.resultado = true;
    }
    return resultadoValidacion;
}

//Al iniciar la aplicación, detecta si hay un crédito guardado
if (credito.getEstado() !== 0) {
    enviarNotificacion('ok', 'Tienes un Crédito guardado, lo cargamos para ti', 5);
}

//Renderización inicial
renderHTML();