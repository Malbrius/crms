// Sig: 798. Ant: 315, Cargar la encuesta: 199. #txtPreguntaDes <- el ID del elemento HTML de la pregunta
/**
 * Valores por defecto de todas las peticiones AJAX.
 */
$.ajaxSetup({
    type: 'POST',
    dataType: 'JSON',
    error: function (xhr) {
        console.log("Error: " + xhr.responseText);
    },
    complete: function (xhr) {
        console.log("Fin de la petición AJAX.");
    }
});

//El siguiente objeto almacena global los parámetros de la URL. Los carga la función llamada "parámetrosGET".
var variablesGET = {};
// Esto define cuál pregunta se va a cargar primero
var inicioDeEncuesta = 'a';
//Esto define la pregunta a la que hay que regresar en caso de pulsar el botón de atrás
var preguntasAnteriores = new Array();
// Esto marca en qué número de pregunta va
var preguntaActual = 1;
// Esto marca cuál es la última pregunta (determinada por la tabla) [no me dio tiempo, determinada por esta constante]
var últimaPregunta = 5;

var v_id_fingestion = '';
var v_fecha_movto = '';
var v_hora_movto = '';
var v_hora_fin = '1900-01-01';
var v_descripcion = '';

var v_contesto_cliente = '';   //1
var v_acepto_recibir_info = '';   //2
var v_experiencia_servicio = '';   //3 - Pregunta 2
var v_razones_calificacion = '';   //4 - Razón pregunta 2
var v_facil_contacto = '';   //5 
var v_razon_dificil_contacto = '';   //6
var v_minutos_espera = '';   //7 
var v_amabilidad_ejecutivo = '';   //8   
var v_info_servicio = '';   //9
var v_tiempo_cumplido = '';   //10
var v_tiempo_espera = '';   //11
var v_cal_tiempo_espera = '';   //12 // Pregunta 3
var v_razones_calificacion_tiempo_espera = '';   //68 - Razón pregunta 3
var v_amabilidad_persona = '';   //13
var v_servicio_brindado = '';   //14
var v_espera_abogado = '';   //15
var v_cal_espera_abogado = '';   //16
var v_amabilidad_abogado = '';   //17
var v_asesoria_abogado = '';   //18
var v_tiempo_solucion = '';   //19
var v_tiempo_esp_asesor = '';   //20
var v_cal_tiempo_esp_asesor = '';   //21
var v_amabilidad_asesor = '';   //22
var v_cal_asesoria = '';   //23
var v_costo_adicional = '';   //24
var v_comunicacion_const = '';   //25
var v_atencion_seguimiento = '';   //26   
var v_amabilidad_personal = '';   //27
var v_lugar_servicio_f = '';   //28
var v_cal_inst_f = '';   //29
var v_espera_servicio = '';   //30
var v_cal_servicio_f = '';   //31
var v_pagar_club_protec = '';   //32 //Esto sí se guarda, pregunta 4
var v_recomen_club_protec = '';   //33 //Esto sí se guarda Pregunta 5
var v_comentario_adicional = '';   //34 //Esto sí se guarda Comentario después de pregunta 5
var v_porque_no_contesto = '';   //35
var v_fin_efectivo = '';   //36 //Esto sí se guarda
var v_fin_abandono = '';   //37 //Esto sí se guarda
//Días de experiencia se calcula y se guarda al guardar el movimiento. 66, variable 38
var v_razones_de_no_se_le_otorgó_el_servicio = ""; // 
//Falta encontrar la columna observaciones_2


//****************************************************************************//

/**
 * Esta función se ejecuta al cargarse la página y se encarga de inicializar todas las
 * variables y funciones en el orden correcto.
 */
function iniciar() {
    variablesGET = parámetrosGET();
    if (!variablesGET) {
        console.error("No se pudo leer ninguna variable GET");
        variablesGET = {cliente:"0", username:"0", answernumber:"0", campaign:"SIN DATOS", clienteid:"0", tipo_operacion:"SIN DATOS", llamada_id:"0"};
    }
    
    cargarDatosEnPantalla(variablesGET);
    buscarCliente();
    cargarEncuesta();
    actualizarNombreCampana()
    console.log("Servicio (v_info_servicio): " + v_info_servicio);

    btnSiguiente = document.getElementById("btnSiguiente");
    btnAnterior = document.getElementById("btnAnterior");
    btnFinGestion = document.getElementById("btnFinGestion");

    // Listener para los eventos de clic y pulsaciones de teclas
    btnSiguiente.addEventListener('click', fn_btnSiguiente, false);
    btnAnterior.addEventListener('click', fn_btnAnterior, false);
    btnFinGestion.addEventListener('click', finDeEncuesta, false);
    document.oncontextmenu = function () { return false };
    $('#txtObservaciones').on('keypress', validaLetrasNumeros);
    $('#txtOtro').on('keypress', validaLetrasNumeros);
    // $("#txtOtro").on("paste", validaLetrasNumeros);    
    $("#txtObservaciones").on("paste keydown", validaLetrasNumeros);
    $("#txtOtro").on("paste keydown", validaLetrasNumeros);
}
function actualizarNombreCampana() {
    var encabezado = document.getElementById('nombreCampana');
    encabezado.textContent = variablesGET(campaign);
}

/**
 * Lee los parámetros recibidos en la URL y los guarda en un objeto relacional llamado variablesGET, que se debe encontrar hasta arriba en el código.
 * @returns {({}|false)} un objeto relacional con las variables leídas desde la URL o false en caso de error.
 */
function parámetrosGET() {
    try {
        const url = document.location.href;
        let params = url.split('?')[1];
        params = params.split('&');
        let data = {};
        let tmp;
        for (let i = 0, l = params.length; i < l; i++) {
            tmp = params[i].split('=');
            data[tmp[0]] = tmp[1];
        }
        if (Object.keys(data).length === 0 || Object.keys(data)[0] === "" || Object.keys(data)[0] === undefined) {
            throw new Error('No se leyó ningún parámetro en la URL');
        }
        return data;
    } catch (error) {
        return false;
    }
}

/**
 * Este método no sirve. En su lugar los datos se cargan desde la consulta a la base de datos.
 * Carga los datos en etiquetas que probablemente nunca se van a mostrar.
 * @param {{}} parámetrosURL Un objeto conteniendo todas las variables recibidas desde la URL.
 */
function cargarDatosEnPantalla(parámetrosURL) {
    $("#numeroClienteNoEncontrado").text(parámetrosURL.cliente);
    $("#numeroTelefonoNoEncontrado").text(parámetrosURL.answernumber);
    $("#answernumberformatted").text("(" + parámetrosURL.answernumber.substring(0, 3) + ") " + parámetrosURL.answernumber.substring(3, 6) + "-" + parámetrosURL.answernumber.substring(6));
    $("#username").text(parámetrosURL.username);
    $("#cliente").val(parámetrosURL.cliente);
    $("#clienteid").val(parámetrosURL.cliente);
    // let hora = horaDeInicio();
    // console.log("Variable de la hora: " + hora);
    horaDeInicio();
    $("#id_llamada").val(parámetrosURL.llamada_id);
    $("#empleado_registro").val(parámetrosURL.username);
    $("#telefono_contacto").val(parámetrosURL.answernumber);
}

/**
 * Carga la hora de inicio de la llamada nadamás
 */
function horaDeInicio() {
    $.ajax({
        url: './php/horas.php',
        success: function (hora) {
                console.log("Hora de inicio: " + hora);
                $("#hora_inicio").val(hora);
        }
    });
}

//*****************************************//
//*******FUNCIONES PARA LAS VALIDACIONES********//


function validaLetrasNumeros(e) {
    // var key = e.key;
    if (window.event) {
        key = e.keyCode;
        console.log("Pulsada Key Code: " + key);
    }
    else if (e.which) {
        key = e.which;
    }

    if (key == 32) { // Espacio en blanco
        return true;
    }

    if (key == 8) { // retroceso
        return true;
    }

    if (key == 86) { // Pegar usando Ctrl. + V
        // Manejar el pegado.
        const portapapeles = window.clipboardData.getData('Text').replace(/([^\w\d\s])/ig, "");
        window.clipboardData.setData ("Text", portapapeles);
        return true;
    }
    
    if (key < 48 || key > 57) {
        if (key < 65 || key > 90) {
            if (key < 97 || key > 122) {
                return false;
            }
        }
    }

    return true;
}

/**
 * Esta función no se usa, pero originalmente colocaba un reloj en la parte superior
 * derecha de la pantalla.
 */
function fechaHora() {
    var mydate = new Date();
    var year = mydate.getYear();
    if (year < 1000) {
        year += 1900;
    }
    var day = mydate.getDay();
    var month = mydate.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var daym = mydate.getDate();
    if (daym < 10) {
        daym = "0" + daym;
    }
    var Digital = new Date();
    var hours = Digital.getHours();
    var minutes = Digital.getMinutes();
    var seconds = Digital.getSeconds();
    var dn = "AM";
    if (hours > 12) {
        dn = "PM";
        hours = hours;
    }
    if (hours == 0) {
        hours = 12;
    }
    if (minutes <= 9) {
        minutes = "0" + minutes;
    }
    if (seconds <= 9) {
        seconds = "0" + seconds;
    }
    $("#FechaHora").html("" + daym + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds + " " + dn);
    setTimeout("fechaHora()", 1000);
}

//***********************************//
//****FUERA DEL INICIAR****//

/**
 * Carga los datos del cliente desde la base de datos y los coloca en la vista de la página.
 */
function buscarCliente() {
    const parametros = {
        opcion: 'buscarCliente',
        clienteId: document.getElementById('clienteid').value,
        telefonoContacto: document.getElementById('telefono_contacto').value
    };

    //telefono_contacto
    if (parametros["clienteId"].length == 0 || parametros["telefonoContacto"].length == 0) {
        document.getElementById("divRecibirInfoCliente").style.display = "block";
    }
    else {
        callAPI(parametros);
    }
}

/**
 * Carga los datos de las preguntas, respuestas y el flujo de la encuesta y los almacena en variables.
 */
function cargarEncuesta() {
    $.ajax({
        url: './php/controller/clienteController.php',
        data: { opcion: 'cargarEncuesta' },

        success: function (info) {
                console.log(info);
                try {
                    mostrarPreguntasRespuestas(info.preguntas, info.respuestas, info.preguntasYRespuestas, info.catálogo);
                } catch (error) {
                    mostrarPreguntasRespuestas({0: "ERROR"}, {0: "ERROR"}, {0: "ERROR"});
                }
        }
    });
}

/**
 * A pesar de su nombre, esta no es una API, sólo es un método de control de llamadas AJAX.
 * @param {any} request los parámetros para saber qué va a hacer el backend.
 */
function callAPI(request) {
    $.ajax({
        url: './php/controller/clienteController.php',
        data: request,
        success: function (info) {
            if (request["opcion"] == "buscarCliente") {
                // alert(info.error)
                if(info.error){
                    console.error("No se encontró este cliente o la consulta falló");
                    mostrarInfoCliente({"Error": true, "numerocliente": variablesGET.cliente, "fechadeservicio": "SIN DATOS", "nombre_cliente": "DESCONOCIDO", "apellidopaterno": "DESCONOCIDO", "apellidomaterno": "DESCONOCIDO", "servicio_cliente": "SIN DATOS", "estado_cliente": "DESCONOCIDO", "ciudad_cliente": "DESCONOCIDA", "telefono_particular": variablesGET.answernumber, "telefono_celular": variablesGET.answernumber, "correoelectronico": "SIN DATOS", "tipodeplan": "DESCONOCIDO", "numserviciosutilizados": "SIN DATOS", "tipodesolucion": "SIN DATOS", "provedor": "SIN DATOS", "fechaadquisiciondelclub": "SIN DATOS", "importeofrecido": "DESCONOCIDO", "tiempoduracionllamada": "0", "diasexperiencia": "0"})
                    return;
                }
                mostrarInfoCliente(info);
            } else if (info.estado == 1) {
                try {
                    colgarLlamada();
                    alert(sdispositioncode);
                } catch (error) {
                    console.info("Llamada finalizada.");
                }
            }
        }
    });
}

/**
 * Coloca los datos del cliente recibidos en el parámetro dentro de etiquetas HTML específicas.
 * Este método no funcionará si los parámetros no están completos, si tiene parámetros de más
 * o si no existen todas las etiquetas HTML que necesita.
 * @param {[]} info Un arreglo de un solo espacio conteniendo un objeto con muchos datos correspondientes
 * a la información confidencial del cliente.
 */
function mostrarInfoCliente(info) {
        if (info.Error) {
            document.getElementById("divEncontroCliente").style.display = "block";
        }
        if (Object.keys(info).length > 0) {
        document.getElementById("numerocliente").textContent = info["numerocliente"];
        document.getElementById("fechadeservicio").textContent = info["fechadeservicio"];
        document.getElementById("nombre_cliente").textContent = info["nombre_cliente"];
        document.getElementById("apellidopaterno").textContent = info["apellidopaterno"];
        document.getElementById("apellidomaterno").textContent = info["apellidomaterno"];
        document.getElementById("servicio_cliente").textContent = info["servicio_cliente"];
        document.getElementById("estado_cliente").textContent = info["estado_cliente"];
        document.getElementById("ciudad_cliente").textContent = info["ciudad_cliente"];
        document.getElementById("telefono_particular").textContent = info["telefono_particular"];
        document.getElementById("telefono_celular").textContent = info["telefono_celular"];
        document.getElementById("correoelectronico").textContent = info["correoelectronico"];
        document.getElementById("tipodeplan").textContent = info["tipodeplan"];
        document.getElementById("numserviciosutilizados").textContent = info["numserviciosutilizados"];
        document.getElementById("tipodesolucion").textContent = info["tipodesolucion"];
        document.getElementById("provedor").textContent = info["provedor"];
        document.getElementById("fechaadquisiciondelclub").textContent = info["fechaadquisiciondelclub"];
        document.getElementById("importeofrecido").textContent = info["importeofrecido"];
        document.getElementById("tiempoduracionllamada").textContent = info["tiempoduracionllamada"];
        document.getElementById("diasexperiencia").textContent = info["diasexperiencia"];
    }
}

// Sacados de la función por que no debería haber variables globales declaradas dentro de funciones.
var arrayPreguntas = null;
var arrayRespuestas = null;
var arrayRelación = null;
var arrayCatálogoDeFinesDeGestión = null;
/**
 * Este método almacena las preguntas, las posibles respuestas, y las relaciones que hay entre ellos.
 * @param {Array} preguntas Una colección enumerada de las preguntas que se van a utilizar
 * @param {Array} respuestas Una colección enumerada de los grupos de respuestas que se van a utilizar
 * @param {Array} relación Una colección enumerada que sirve como apoyo para el flujo de la encuesta
 * @param {Array} catálogoDeFinesDeGestión Una colección enumerada del catálogo de fines de gestión
 */
function mostrarPreguntasRespuestas(preguntas, respuestas, relación, catálogoDeFinesDeGestión) {
    // posición = 0;
    arrayPreguntas = preguntas; // valores igualados para no tener que batallar con el resto del código que no tiene ningún comentario ni documentación.
    arrayRespuestas = respuestas;
    arrayRelación = relación;
    arrayCatálogoDeFinesDeGestión = catálogoDeFinesDeGestión;
    // let índiceDeLaPreguntaInicial = buscarPregunta(arrayPreguntas, inicioDeEncuesta)
    cambioDePregunta(inicioDeEncuesta);
}

/**
 * Esta función cambia la pregunta actual en pantalla por la pregunta correspondiente a la clave dada en el parámetro.
 * También se encarga de que el tipo de entrada de respuestas correspondiente se muestre, junto con las respuestas.
 * @param {string} claveDeLaPregunta un string representando la clave de la pregunta que se va a mostrar en pantalla a continuación.
 */
function cambioDePregunta(claveDeLaPregunta) {
    $('#txtOtro').css("display", "none");
    $('#txtOtro').text("");
    $("#cbRespuestas").css("display", "block");
    let índiceDeLaPregunta = buscarPregunta(arrayPreguntas, claveDeLaPregunta);
    let respuestas = buscarRespuestas(claveDeLaPregunta);
    const textoDePregunta = arrayPreguntas[índiceDeLaPregunta].pregunta.replace("[MENCIONAR SERVICIO]", $("#servicio_cliente").text()).replace("[FECHA]", $("#fechadeservicio").text());
    $('#txtPreguntaDes').html(textoDePregunta);
    $('#txtPreguntaDes').attr("indice", arrayPreguntas[índiceDeLaPregunta].id_pregunta);
    $("#cbRespuestas").empty();
    if(respuestas[0].respuesta.toLowerCase() == "Texto".toLowerCase()){
        console.log("Cuadro de texto");
        $("#cbRespuestas").css("display", "none");
        $('#txtOtro').css("display", "block");
        return;
    }
    if(respuestas[0].respuesta.toLowerCase() == "Fines".toLowerCase()){
        console.log("Selector de fines de gestión");
        // $("#cbRespuestas").css("display", "none");
        // $('#txtOtro').css("display", "block");
        respuestas = finesDeGestiónParaComboDeNoContestó();
        $("#cbRespuestas").append("<option>Seleccione respuesta</option>");
        for (var i = 0; i < respuestas.length; i++) {
            $("#cbRespuestas").append('<option tipo="' + respuestas[i].id_fingestion + '">' + respuestas[i].descripcion + '</option>');
        }
        return;
    }
    $("#cbRespuestas").append("<option>Seleccione respuesta</option>");
    for (var i = 0; i < respuestas.length; i++) {
        $("#cbRespuestas").append('<option tipo="' + respuestas[i].tipo_de_respuesta + '">' + respuestas[i].respuesta + '</option>');
    }
}

/**
 * Se encarga de finalizar la encuesta y de iniciar el guardado de mocimientos.
 * Recibe el fin de gestión que se va a guardar.
 * @param {string} fin un string representando el número del fin de gestión.
 */
function finDeEncuesta() {
    let fin = v_id_fingestion;
    // console.info("fin de la encuesta.\nPregunta final: " + $("#txtPreguntaDes").attr("indice") + "\nFin de gestión: " + fin);
    FinalizaLlamada(fin);
    console.info("fin de la encuesta.\nPregunta final: " + $("#txtPreguntaDes").attr("indice") + "\nFin de gestión: " + fin);
    // $("#btnAnterior").prop('disabled', true);
    // $("#btnSiguiente").prop('disabled', true);
    // $("#txtPreguntaDes").text("Fin.");
    // $.confirm({
    //     title: "Fin",
    //     content: "fin de la encuesta.<br>Pregunta final: " + $("#txtPreguntaDes").attr("indice") + "<br>Fin de gestión: " + fin,
    //     type: 'blue',
    //     typeAnimated: true,
    //     buttons: {
    //         cerrar: function () {
    //         }
    //     }
    // });
}

/**
 * Se encarga de colocar las variables correspondientes según sea la respuesta.
 */
function guardarVariables(){
    if($("#txtPreguntaDes").attr("indice") == "1"){
        //Pregunta 1
        v_acepto_recibir_info = $("#cbRespuestas option:selected").val().toUpperCase();
    } else if($("#txtPreguntaDes").attr("indice") == "2"){
        //Pregunta 2
        v_experiencia_servicio = $("#cbRespuestas option:selected").val();
    } else if(preguntaActual == 2 && $("#txtPreguntaDes").attr("indice") == "e"){
        //Razón de calificación para la pregunta 2
        // v_razones_calificacion = $("#txtOtro").val();
        v_razones_calificacion = $("#cbRespuestas option:selected").val().toUpperCase();
    } else if($("#txtPreguntaDes").attr("indice") == "3"){
        // Pregunta 3
        v_cal_tiempo_espera = $("#cbRespuestas option:selected").val();
    } else if(preguntaActual == 3 && $("#txtPreguntaDes").attr("indice") == "h"){
        // Razón de calificación para la pregunta 3 que se colocó en la columna 68 por que es una pregunta recién añadida.
        v_razones_calificacion_tiempo_espera = $("#txtOtro").val();
    } else if ($("#txtPreguntaDes").attr("indice") == "4") {
        // Pregunta 4
        v_pagar_club_protec = $("#cbRespuestas option:selected").val();
    } else if ($("#txtPreguntaDes").attr("indice") == "5") {
        // Pregunta 5
        v_recomen_club_protec = $("#cbRespuestas option:selected").val();
    } else if(preguntaActual == 5 && $("#txtPreguntaDes").attr("indice") == "f"){
        // Razón pregunta 5
        v_comentario_adicional = $("#txtOtro").val();
    } else if ($("#txtPreguntaDes").attr("indice") == "d") {
        v_razones_de_no_se_le_otorgó_el_servicio = $("#txtOtro").val();
    }
    
}

/**
 * Maneja la siquieente pregunta según la respuesta actual, definida por su clave en el primer
 * parámetro, y el tipo de respuesta dado en el segundo parámetro. El tipo de respuesta puede
 * ser "pos" para positivo, "neg" para negativo, o "alt" para el tipo de respuesta alternativo.
 * El camino que tomará la encuesta está definido por el tipo de respuesta recibido aquí.
 * @param {string} claveDeLaPreguntaActual un string representando la clave de la pregunta actual.
 * @param {string} tipoDeRespuesta un string representando la clave del tipo de respuesta dado.
 * @returns null
 */
function siguientePregunta(claveDeLaPreguntaActual, tipoDeRespuesta) {
    índiceDeLaPregunta = buscarPregunta(arrayPreguntas, claveDeLaPreguntaActual);
    let siguiente = -1;
    if(tipoDeRespuesta.toLocaleLowerCase() == "pos"){
        siguiente = arrayPreguntas[índiceDeLaPregunta].id_siguiente_positiva;
    } else if(tipoDeRespuesta.toLocaleLowerCase() == "neg"){
        siguiente = arrayPreguntas[índiceDeLaPregunta].id_siguiente_negativa;
    } else if(tipoDeRespuesta.toLocaleLowerCase() == "alt"){
        siguiente = arrayPreguntas[índiceDeLaPregunta].id_siguiente_alternativa;
    } else if(typeof parseInt(tipoDeRespuesta) == "number"){
        // siguiente = arrayPreguntas[índiceDeLaPregunta].id_siguiente_alternativa;
        console.log("Se encontró el fin de gestión " + tipoDeRespuesta);
        siguiente = "fg" + tipoDeRespuesta;
        // return;
    } else {
        console.error("Qué pregunta sigue? algo anda mal en siguientePregunta()");
        return;
    }
    if (siguiente == -1) {
        console.error("índice de pregunta no válido en siguientePregunta()");
    }

    guardarVariables();
    
    if (siguiente == "+") {
        siguiente = ++preguntaActual;
        if (siguiente > últimaPregunta) {
            preguntaActual = últimaPregunta;
            $("#btnAnterior").prop('disabled', true);
            $("#btnSiguiente").prop('disabled', true);
            $("#btnAnterior").css('display', "none");
            $("#btnSiguiente").css('display', "none");
            $('#cbRespuestas').css("display", "none");
            $('#txtOtro').css("display", "none");
            $("#txtPreguntaDes").text("Fin.");
            $("#btnFinGestion").css("display", "inline");
            $("#btnFinGestion").prop("disabled", false);
            v_id_fingestion = "1";
            // finDeEncuesta("1");
            return;
        }
    }
    if(siguiente.toString().substring(0, 2).toLowerCase() == "fg"){
        // FinalizaLlamada(fin);
        $("#btnAnterior").prop('disabled', true);
        $("#btnSiguiente").prop('disabled', true);
        $("#btnAnterior").css('display', "none");
        $("#btnSiguiente").css('display', "none");
        $('#cbRespuestas').css("display", "none");
        $('#txtOtro').css("display", "none");
        $("#txtPreguntaDes").text("Fin.");
        $("#btnFinGestion").css("display", "inline");
        $("#btnFinGestion").prop("disabled", false);
        v_id_fingestion = siguiente.substring(2);
        // finDeEncuesta(siguiente.substring(2));
        return;
    }
    // Guardar la respuesta
    

    cambioDePregunta(siguiente);
    preguntasAnteriores.push(claveDeLaPreguntaActual);
    try {
        const tmpNumeroDePregunta = parseInt(siguiente);
        if (!isNaN(tmpNumeroDePregunta)) {
            preguntaActual = tmpNumeroDePregunta;
        }
    } catch (error) {
        
    }
    
    console.log("Pregunta anterior: " + preguntasAnteriores[preguntasAnteriores.length-1] + "\n" + "Pregunta actual: " + $("#txtPreguntaDes").attr("indice") + "\n" + "Pregunta principal actual: " + preguntaActual);
    $("#txtOtro").val("");//Vaciar el texto de la respuesta
}

/**
 * Este método maneja el botón de retroceso de las preguntas.
 * @returns null
 */
function preguntaAnterior() {
    const clave = preguntasAnteriores.pop();
    if (clave == undefined) {
        console.warn("No hay más preguntas atrás.");
        return;
    }
    índiceDeLaPregunta = buscarPregunta(arrayPreguntas, clave);
    if (preguntaActual.toString() == $("#txtPreguntaDes").attr("indice")) {
        --preguntaActual;
    }
    cambioDePregunta(clave);
    console.log("Pregunta anterior: " + preguntasAnteriores[preguntasAnteriores.length-1] + "\n" + "Pregunta actual: " + $("#txtPreguntaDes").attr("indice") + "\n" + "Pregunta principal actual: " + preguntaActual);
}

/**
 * Esta función devuelve el índice de la pregunta que buscas a partir de su clave.
 * Devuelve -1 si no se encontró la clave de la pregunta.
 * @param {Array} preguntas la colección de las preguntas.
 * @param {string} clave la clave de la pregunta que se busca como un string.
 */
function buscarPregunta(preguntas, clave){
    for (let a = 0; a < preguntas.length; a++) {
        if (preguntas[a].id_pregunta == clave) {
            return a;
        }
    }
    return -1;
}

/**
 * Esta función devuelve una colección enumerada de las respuestas para la pregunta
 * que buscas a partir de su clave. Devuelve -1 si no se encontró
 * ningún grupo de respuestas para la pregunta.
 * @param {Array} preguntas la colección de las preguntas.
 * @param {string} clave la clave de la pregunta que se busca como un string.
 */
function buscarRespuestas(clave){
    let respuestas = new Array();
    for (let a = 0; a < arrayRelación.length; a++) {
        if (arrayRelación[a].id_pregunta == clave) {
            respuestas = respuestas.concat(buscarGrupoDeRespuestas(arrayRelación[a].id_respuestas));
        }
    }
    if (respuestas.length == 0) {
        return -1;
    }
    return respuestas;
}

/**
 * Busca las respuestas correspondientes al grupo de respuestas dado en el parámetro.
 * @param {string} idDelGrupoDeRespuestas El ID del grupo de respuestas que se busca.
 * @returns {Array} una colección con las respuestas correspondientes al grupo de respuestas que se de en el parámetro.
 */
function buscarGrupoDeRespuestas(idDelGrupoDeRespuestas){
    let respuestas = new Array();
    for (let a = 0; a < arrayRespuestas.length; a++) {
        if (arrayRespuestas[a].id_grupo_de_respuestas == idDelGrupoDeRespuestas) {
            respuestas.push(arrayRespuestas[a]);
        }
    }
    return respuestas;
}

function finesDeGestiónParaComboDeNoContestó(){
    respuestas = new Array();
    if (arrayCatálogoDeFinesDeGestión.length != 0 || arrayCatálogoDeFinesDeGestión != null || arrayCatálogoDeFinesDeGestión != undefined) {
        for (let a = 0; a < arrayCatálogoDeFinesDeGestión.length; a++) {
            let fin = arrayCatálogoDeFinesDeGestión[a].id_fingestion;
            if (fin == "19" || 
                fin == "22" || 
                fin == "17" || 
                fin == "16" || 
                fin == "24" || 
                fin == "10" || 
                fin == "11" || 
                fin == "13" || 
                fin == "4" || 
                fin == "6" || 
                fin == "7" || 
                fin == "23" || 
                fin == "20") {
                respuestas.push(arrayCatálogoDeFinesDeGestión[a]);
            }
        }
    }
    return respuestas;
}

//********************************************//
//*************SECUENCIA DE PREGUNTAS, GUARDAR Y OTRAS COSAS**************//

/**
 * Maneja qué ocurre si pulsas el botón "Anterior".
 * @returns null
 */
function fn_btnAnterior() {
    $("#txtOtro").val("");
    preguntaAnterior();
    return;
}

/**
 * Maneja qué ocurre si pulsas el botón "Siguiente". Y valida que se haya seleccionado
 * alguna respuesta válida.
 * @returns null
 */
function fn_btnSiguiente() {
    if ($("#txtOtro").css("display") == "block") {
        if ($('#txtOtro').val() == "") {
            $.confirm({
                title: 'Advertencia',
                content: 'Por favor, especifique la razón.',
                type: 'blue',
                typeAnimated: true,
                buttons: {
                    cerrar: function () {
                    }
                }
            });
            return;
        }
        var tipoDeRespuesta = "pos";
    } else {
        var tipoDeRespuesta = $("#cbRespuestas option:selected").attr("tipo");
    }
    const índiceDeLaPreguntaActual = $("#txtPreguntaDes").attr("indice");
    if (tipoDeRespuesta != undefined) {
        siguientePregunta(índiceDeLaPreguntaActual, tipoDeRespuesta)
        return;

    } else {
        $.confirm({
            title: 'Advertencia',
            content: 'Favor de seleccionar una opción válida',
            type: 'blue',
            typeAnimated: true,
            buttons: {
                cerrar: function () {

                }
            }
        });
    }
}


function guardarFinGestion(finGestión) {

    // v_descripcion = document.getElementById("cbRespuestas").value;
    v_descripcion = "";

    if (finGestión == "9") {
        v_porque_no_contesto = document.getElementById("txtOtro").value;
        v_acepto_recibir_info = '';
        v_experiencia_servicio = ''; // Pregunta 2
        v_razones_calificacion = ''; // Razón pregunta 2
        v_facil_contacto = '';
        v_razon_dificil_contacto = '';
        v_minutos_espera = '';
        v_amabilidad_ejecutivo = '';
        v_info_servicio = '';
        v_tiempo_cumplido = '';
        v_tiempo_espera = '';
        v_cal_tiempo_espera = ''; // Pregunta 3
        v_amabilidad_persona = '';
        v_servicio_brindado = '';
        v_espera_abogado = '';
        v_cal_espera_abogado = '';
        v_amabilidad_abogado = '';
        v_asesoria_abogado = '';
        v_tiempo_solucion = '';
        v_tiempo_esp_asesor = '';
        v_cal_tiempo_esp_asesor = '';
        v_amabilidad_asesor = '';
        v_cal_asesoria = '';
        v_costo_adicional = '';
        v_comunicacion_const = '';
        v_atencion_seguimiento = '';
        v_amabilidad_personal = '';
        v_lugar_servicio_f = '';
        v_cal_inst_f = '';
        v_espera_servicio = '';
        v_cal_servicio_f = '';
        v_pagar_club_protec = '';
        v_recomen_club_protec = '';
        v_comentario_adicional = '';
        v_fin_efectivo = "";
        v_razones_de_no_se_le_otorgó_el_servicio = "";
        v_razones_calificacion_tiempo_espera = "";
        //Variables adicionales
    }

    // if (finGestión == '9') {
    //     v_id_fingestion = '9';
    //     v_descripcion = 'NO ACEPTO PARTICIPAR';
    //     v_fin_abandono = "9";
    // }

    switch (finGestión) {
        case "1":
            v_id_fingestion = '1';
            v_descripcion = 'ENCUESTA EFECTIVA';
            v_fin_efectivo = "1"
            break;
        case "4":
            v_id_fingestion = '4';
            v_descripcion = 'RECADO';
            v_fin_abandono = "4";
            break;
        case "6":
            v_id_fingestion = "6";
            v_descripcion = 'EQUIVOCADO';
            v_fin_abandono = "6";
            break;
        case "7":
            v_id_fingestion = '7';
            v_descripcion = "COLGO";
            v_fin_abandono = "7";
            break;
        case "8":
            v_id_fingestion = '8';
            v_descripcion = "ABANDONO ENCUESTA";
            v_fin_abandono = "8";
            break;
        case "9":
            v_id_fingestion = '9';
            v_descripcion = "NO ACEPTO PARTICIPAR";
            v_fin_abandono = "9";
            break;
        case "10":
            v_id_fingestion = '10';
            v_descripcion = "CLIENTE FALLECIO";
            v_fin_abandono = "10";
            break;
        case "11":
            v_id_fingestion = '11';
            v_descripcion = "YA NO VIVE AHI";
            v_fin_abandono = "11";
            break;
        case "13":
            v_id_fingestion = '13';
            v_descripcion = "LLAMAR DESPUES";
            v_fin_abandono = "13";
            break;
        case "16":
            v_id_fingestion = '16';
            v_descripcion = "NO EXISTE TELEFONO";
            v_fin_abandono = "16";
            break;
        case "17":
            v_id_fingestion = '17';
            v_descripcion = "FAX";
            v_fin_abandono = "17";
            break;
        case "19":
            v_id_fingestion = '19';
            v_descripcion = "CEL NO DISPONIBLE";
            v_fin_abandono = "19";
            break;
        case "20":
            v_id_fingestion = '20';
            v_descripcion = "FUERA DE SERVICIO";
            v_fin_abandono = "20";
            break;
        case "22":
            v_id_fingestion = '22';
            v_descripcion = "TEL OCUPADO";
            v_fin_abandono = "22";
            break;
        case "23":
            v_id_fingestion = '23';
            v_descripcion = "NO RESPONDE";
            v_fin_abandono = "23";
            break;
        case "24":
            v_id_fingestion = '24';
            v_descripcion = "MENSAJE DE VOZ";
            v_fin_abandono = "24";
            break;
    }
}

/**
 * Este método se debe de llamar al llegar a una conclusión de llamada.
 * @param {string} finGestión un string representando el número del fin de gestión que se va a insertar.
 */
function FinalizaLlamada(finGestión) {
    $("#btnFinGestion").prop("disabled", true);
    // $('#txtPreguntaDes').css("display", "none");
    // $('#cbRespuestas').css("display", "none");
    // $('#txtOtro').css("display", "none");

    let hora_inicio = document.getElementById("hora_inicio").value;
    let id_llamada = document.getElementById("id_llamada").value;
    let empleado_registro = document.getElementById("empleado_registro").value;
    let telefono_contacto = document.getElementById("telefono_contacto").value;

    /*1*/ let numerocliente = document.getElementById("numerocliente").textContent;
    /*2*/ let fechadeservicio = document.getElementById("fechadeservicio").textContent;
    /*3*/ let nombre_cliente = document.getElementById("nombre_cliente").textContent;
    /*4*/ let apellidopaterno = document.getElementById("apellidopaterno").textContent;
    /*5*/ let apellidomaterno = document.getElementById("apellidomaterno").textContent;
    /*6*/ let servicio_cliente = document.getElementById("servicio_cliente").textContent;
    /*7*/ let estado_cliente = document.getElementById("estado_cliente").textContent;
    /*8*/ let ciudad_cliente = document.getElementById("ciudad_cliente").textContent;
    /*9*/ let correoelectronico = document.getElementById("correoelectronico").textContent;
    /*10*/ let tipodeplan = document.getElementById("tipodeplan").textContent;
    /*11*/ let numserviciosutilizados = document.getElementById("numserviciosutilizados").textContent;
    /*12*/ let tipodesolucion = document.getElementById("tipodesolucion").textContent;
    /*13*/ let provedor = document.getElementById("provedor").textContent;
    /*14*/ let fechaadquisiciondelclub = document.getElementById("fechaadquisiciondelclub").textContent;
    /*15*/ let importeofrecido = document.getElementById("importeofrecido").textContent;
    /*16*/ let tiempoduracionllamada = document.getElementById("tiempoduracionllamada").textContent;
    /*16*/ let id_plataforma = 1;
    let v_observaciones = document.getElementById("txtObservaciones").value;

    v_info_servicio = v_info_servicio.replace(/ú/gi, "u");
    v_info_servicio = v_info_servicio.replace(/ó/gi, "o");
    v_info_servicio = v_info_servicio.replace(/í/gi, "i");
    v_info_servicio = v_info_servicio.replace(/é/gi, "e");
    v_info_servicio = v_info_servicio.replace(/á/gi, "a");


    guardarFinGestion(finGestión);

    arrayEndCallData = new Object();

    /*1*/ arrayEndCallData['v_num_cliente'] = numerocliente;
    /*2*/ arrayEndCallData['v_tipo_movimiento'] = v_id_fingestion;
    /*3*/ arrayEndCallData['v_fecha_movto'] = v_fecha_movto;
    /*4*/ arrayEndCallData['v_hora_movto'] = v_hora_movto;
    /*5*/ arrayEndCallData['v_id_llamada'] = id_llamada;
    /*6*/ arrayEndCallData['v_telefono_contacto'] = telefono_contacto;
    /*7*/ arrayEndCallData['v_id_fingestion'] = v_id_fingestion;
    /*8*/ arrayEndCallData['v_descripcion'] = v_descripcion; // cómo se llama o qué significa el fin de gestión
    /*9*/ arrayEndCallData['v_observaciones'] = v_observaciones; // Las observaciones de la caja grande que pone "Observaciones"
    /*10*/arrayEndCallData['v_empleado_registro'] = empleado_registro;
    /*11*/arrayEndCallData['v_fecha_servicio'] = fechadeservicio.length > 0 ? fechadeservicio : '1900-01-01';
    /*12*/arrayEndCallData['v_nombres'] = nombre_cliente;
    /*13*/arrayEndCallData['v_apellido_paterno'] = apellidopaterno;
    /*14*/arrayEndCallData['v_apellido_materno'] = apellidomaterno;
    /*15*/arrayEndCallData['v_servicio'] = servicio_cliente;
    /*16*/arrayEndCallData['v_estado'] = estado_cliente;
    /*17*/arrayEndCallData['v_ciudad'] = ciudad_cliente;
    /*18*/arrayEndCallData['v_correo'] = correoelectronico;
    /*19*/arrayEndCallData['v_tipo_plan'] = tipodeplan;
    /*20*/arrayEndCallData['v_num_serv_utilizados'] = numserviciosutilizados.length > 0 ? numserviciosutilizados : 0;
    /*21*/arrayEndCallData['v_tipo_solucion'] = tipodesolucion;
    /*22*/arrayEndCallData['v_proveedor'] = provedor;
    /*23*/arrayEndCallData['v_fecha_obtuvo_club'] = fechaadquisiciondelclub.length > 0 ? fechaadquisiciondelclub : '1900-01-01';
    /*24*/arrayEndCallData['v_importe_ofrecido'] = importeofrecido.length > 0 ? importeofrecido : 0;
    /*25*/arrayEndCallData['v_duracion_llamada'] = tiempoduracionllamada.length > 0 ? tiempoduracionllamada : '00:00:00'; // Esto viene desde el directorio
    /*26*/arrayEndCallData['v_id_plataforma'] = id_plataforma;
    /*27*/arrayEndCallData['v_hora_inicio'] = hora_inicio;
    /*28*/arrayEndCallData['v_hora_fin'] = v_hora_fin;
    /*29*/arrayEndCallData['v_contesto_cliente'] = v_id_fingestion == "4" ? "NO" : "SI";
    /*30*/arrayEndCallData['v_acepto_recibir_info'] = v_acepto_recibir_info; // Pregunta 1
    /*31*/arrayEndCallData['v_experiencia_servicio'] = v_experiencia_servicio; // Pregunta 2
    /*32*/arrayEndCallData['v_razones_calificacion'] = v_razones_calificacion; // Razón pregunta 2
    /*33*/arrayEndCallData['v_facil_contacto'] = v_facil_contacto;
    /*34*/arrayEndCallData['v_razon_dificil_contacto'] = v_razon_dificil_contacto;
    /*35*/arrayEndCallData['v_minutos_espera'] = v_minutos_espera;
    /*36*/arrayEndCallData['v_amabilidad_ejecutivo'] = v_amabilidad_ejecutivo;
    /*37*/arrayEndCallData['v_info_servicio'] = v_info_servicio;
    /*38*/arrayEndCallData['v_tiempo_cumplido'] = v_tiempo_cumplido;
    /*39*/arrayEndCallData['v_tiempo_espera'] = v_tiempo_espera;
    /*40*/arrayEndCallData['v_cal_tiempo_espera'] = v_cal_tiempo_espera; // Pregunta 3
    /*41*/arrayEndCallData['v_amabilidad_persona'] = v_amabilidad_persona;
    /*42*/arrayEndCallData['v_servicio_brindado'] = v_servicio_brindado;
    /*43*/arrayEndCallData['v_espera_abogado'] = v_espera_abogado;
    /*44*/arrayEndCallData['v_cal_espera_abogado'] = v_cal_espera_abogado;
    /*45*/arrayEndCallData['v_amabilidad_abogado'] = v_amabilidad_abogado;
    /*46*/arrayEndCallData['v_asesoria_abogado'] = v_asesoria_abogado;
    /*47*/arrayEndCallData['v_tiempo_solucion'] = v_tiempo_solucion;
    /*48*/arrayEndCallData['v_tiempo_esp_asesor'] = v_tiempo_esp_asesor;
    /*49*/arrayEndCallData['v_cal_tiempo_esp_asesor'] = v_cal_tiempo_esp_asesor;
    /*50*/arrayEndCallData['v_amabilidad_asesor'] = v_amabilidad_asesor;
    /*51*/arrayEndCallData['v_cal_asesoria'] = v_cal_asesoria;
    /*52*/arrayEndCallData['v_costo_adicional'] = v_costo_adicional;
    /*53*/arrayEndCallData['v_comunicacion_const'] = v_comunicacion_const;
    /*54*/arrayEndCallData['v_atencion_seguimiento'] = v_atencion_seguimiento;
    /*55*/arrayEndCallData['v_amabilidad_personal'] = v_amabilidad_personal;
    /*56*/arrayEndCallData['v_lugar_servicio_f'] = v_lugar_servicio_f;
    /*57*/arrayEndCallData['v_cal_inst_f'] = v_cal_inst_f;
    /*58*/arrayEndCallData['v_espera_servicio'] = v_espera_servicio;
    /*59*/arrayEndCallData['v_cal_servicio_f'] = v_cal_servicio_f;
    /*60*/arrayEndCallData['v_pagar_club_protec'] = v_pagar_club_protec; // pregunta 4
    /*61*/arrayEndCallData['v_recomen_club_protec'] = v_recomen_club_protec; // pregunta 5
    /*62*/arrayEndCallData['v_comentario_adicional'] = v_comentario_adicional; // Comentario adicional después de pregunta 5
    /*63*/arrayEndCallData['v_porque_no_contesto'] = v_porque_no_contesto;
    /*64*/arrayEndCallData['v_fin_efectivo'] = v_fin_efectivo; // Numero de fin gestion efectivo
    /*65*/arrayEndCallData['v_fin_abandono'] = v_fin_abandono; // numero de fingestion no efectivo
    /*66*/arrayEndCallData['v_dias_experiencia'] = $("#diasexperiencia").text(); //Agregadas el 06/06/2023
    /*67*/arrayEndCallData['v_observaciones_2'] = v_razones_de_no_se_le_otorgó_el_servicio; // Razón de que en la pregunta 1 diga que no se le otorgó el servicio
    /*68*/arrayEndCallData['v_razones_calificacion_2'] = v_razones_calificacion_tiempo_espera; // Razón pregunta 3

    totalArrayEndCallData = JSON.stringify(arrayEndCallData);

    const parametros = { opcion: 'guardaMovimientos', totalArrayEndCallData: totalArrayEndCallData };

    callAPI(parametros);
}

/**
 * Función llamada cuando "CALL API" info.estado es 1.
 */
var colgarLlamada = function () {
    var sdispositioncode = '0';

    if (v_id_fingestion < 10) {
        sdispositioncode = '7' + v_id_fingestion.toString();
    } else {
        sdispositioncode = '7' + v_id_fingestion.toString();
    }
    setDispositionCodeGenesys(sdispositioncode);
    release(true, true);
    lblLlamando();
}

/**
 * ... Función de WDE. Fallará si el navegador que se usa no es el interno del WDE.
 * @returns ...
 */
var markDone = function () {
    var parameters = new Array();
    return window.external.WorkspaceInvoke('MarkDone', parameters);
}

/**
 * ...
 * @param {*} markDone ... ¿true?
 * @param {*} agentReady ... ¿true?
 * @returns ...
 */
var release = function (markDone, agentReady) {
    var parameters = new Array();
    parameters['MarkDone'] = markDone;
    parameters['AgentReady'] = agentReady;
    return window.external.WorkspaceInvoke('Release', parameters);
}

/**
 * ¿Algo de Genesys? supongo que coloca el estado del agente como listo para recibir otra llamada.
 * @returns null
 */
var setAgentReady = function () {
    var parameters = new Array();
    return window.external.WorkspaceInvoke('AgentReady', parameters);
}

/**
 * Uhm...
 * @param {*} dispositionCode ...
 * @returns null
 */
var setDispositionCodeGenesys = function (dispositionCode) {
    var parameters = new Array();
    parameters['dispositionCode'] = dispositionCode;
    return window.external.WorkspaceInvoke('SetDispositionCode', parameters);
}

document.addEventListener("DOMContentLoaded", iniciar, true);