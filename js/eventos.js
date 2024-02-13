//Declaracion de variables para los eventos
var totalArrayTelAdic = "{}";
var totalArrayCorreAdic = "{}";
var preguntasCamino = "";
var finGestion = "";
var descripcion = "";
var contador = 0;
var cadenaPregRespuestas = "";
var arrayPregResp;

var inicia = function () {
    //Eventos botones del index
    $(document).on('keydown', desabilitaFs);
    $(document).bind('contextmenu', desabilitaClickDerecho);
    $('input,textarea').on('keypress', validaLetrasNumeros);
    $('#cbRespuestas').on('change', fnvalidarespuestacombo);
    $('#btnAnterior').on('click', fnAnteriorPregunta);
    $('#btnSiguiente').on('click', fnSiguientePregunta);
    //$('#btnAgregaTel').on('click',AbreModalTelAdicional);
    $('#btnCorreo').on('click', AbreModalCorreoAdicional);
    $('#btnFinGestion').on('click', FinalizaLlamada);
    $('#tblEncuesta input').on('keyup', validaSiguiente);
    $('#tblEncuesta input').on('focus', validaSiguiente);
}
$(document).on("ready", inicia);
var validaSiguiente = function (event) {
    if ($(this).val() != "") {
        if ($(this).attr("id") == "dateArrival") {
            if ($(this).val().indexOf('A') == -1 && $(this).val().length == 10) {
                $("#btnSiguiente").button("enable");
            } else {
                $("#btnSiguiente").button("disable");
            }
        } else {
            $("#btnSiguiente").button("enable");
        }

    } else {
        $("#btnSiguiente").button("disable");
    }
}
var desabilitaClickDerecho = function (e) {
    return false;
}
var desabilitaFs = function () {
    var keycode;
    keycode = window.event.keyCode;
    if (keycode >= 112 && keycode <= 123 || (window.event.ctrlKey && keycode == 82)) {
        window.event.returnValue = false;
        window.event.keyCode = 0;
    }
}
var isEmpty = function (id) {
    if ($.trim(id.val()) == 0 || $.trim(id.val()) == "") return false; else return true;
}
var validanumeros = function () {
    if (event.keyCode < 48 || event.keyCode > 57) {
        event.returnValue = false;
    }
}
var validaLetrasNumeros = function (e) {
    var key;
    if (window.event) {
        key = e.keyCode;
    }
    else if (e.which) {
        key = e.which;
    }

    if (key == 32) {
        return true;
    }
    if (key != 35 && key != 64 && key != 46) {
        if (key < 48 || key > 57) {
            if (key < 65 || key > 90) {
                if (key < 97 || key > 122) {
                    return false;
                }
            }
        }
    }
    return true;
}
var AbreModalTelAdicional = function () {
    $("#divLlenaTelefonosAdic").dialog("open");
}
var AbreModalCorreoAdicional = function () {
    $("#divLlenaCorreoAdic").dialog("open");
}
var buscaTelefonoValido = function (event) {
    var aux = event.data.param;
    var ndigitos;
    var numericTel;
    telefono = $(this).val();
    totalArrayTelAdic = JSON.stringify({});
    ndigitos = telefono.length;
    if (ndigitos == 0) {
        $("#guaTelefonosAdi").button("enable");
        $("#cmbTipoTel_" + aux).val(0);
        $("#imgvalido_" + aux).hide("true");
        $("#imgnovalido_" + aux).hide("true");
    } else if (ndigitos < 10) {
        $("#cmbTipoTel_" + aux).val(0);
        $("#imgvalido_" + aux).hide("true");
        $("#imgnovalido_" + aux).hide("true");
        $("#guaTelefonosAdi").button("disable");
    } else if (ndigitos == 10) {
        funcionValidaTelefonoCofetel(telefono, aux);
    }
    if ($("#txtTelAdic_1").val() == "" && $("#txtTelAdic_2").val() == "") {
        $("#guaTelefonosAdi").button("disable");
    }
}
var funcionValidaTelefonoCofetel = function (telefono, aux) {
    var parametros = "opc=fn_ValidaCofetel" +
        "&telefono=" + telefono +
        "&id=" + Math.random();
    //Enviamos los datos al PHP atraves de ajax
    $.ajax({
        cache: false,
        url: 'php/functions.php',
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (response) {
            if (response.estado == 1) {
                $("#guaTelefonosAdi").button("enable");
                $("#cmbTipoTel_" + aux).val(response.tipoteladicional);
                $("#hiddenTelAdicTipoRed_" + aux).val(response.tiporedadicional);
                $("#imgvalido_" + aux).show("true");
                $("#imgnovalido_" + aux).hide("true");

            } else {
                $("#guaTelefonosAdi").button("disable");
                $("#cmbTipoTel_" + aux).val(0);
                $("#imgvalido_" + aux).hide("true");
                $("#imgnovalido_" + aux).show("true");

                if (response.estado <= -100) {
                    alerta(response.mensaje, $("#span_sistema").html());
                }
            }
        },
        error: function (xhr, status, error) {
            $("#imgvalido" + aux).hide("true");
            $("#imgnovalido" + aux).hide("true");
            alerta('<div class="error">fn_ValidaCofetel: ' + xhr.responseText + '</div>', $("#span_sistema").html());
        }
    });
}
var guardaTelefonosAdicionales = function () {
    arrTelAdicionales = new Object();
    for (aux = 1; aux <= 2; aux++) {
        telefono = $("#txtTelAdic_" + aux).val();
        ndigitos = telefono.length;
        if (ndigitos != 0) {
            arrTelAdicionales['vTelAdic_' + aux] = $("#txtTelAdic_" + aux).val();
            arrTelAdicionales['vTipoTel_' + aux] = $("#cmbTipoTel_" + aux).val();
            arrTelAdicionales['vTelAdicTipoRed_' + aux] = $("#hiddenTelAdicTipoRed_" + aux).val();
        }
    }
    totalArrayTelAdic = JSON.stringify(arrTelAdicionales);
    $("#guaTelefonosAdi span").text("Modificar");
    $("#tablaTelsAdicionales").find("tr,input,select").attr("disabled", "disabled").css({ 'background': '#F1F0F0' });
}
var ActualizaTelefonosAdicionales = function () {
    totalArrayTelAdic = JSON.stringify({});
    $("#guaTelefonosAdi span").text("Guardar");
    $("#tablaTelsAdicionales").find("tr,input,select").removeAttr('disabled').css({ 'background': 'none' });
}
var validaCorreo = function (event) {
    var regex = /[\w-\.]{2,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;
    var aux = event.data.param;
    var ndigitos;
    email = $(this).val();
    ndigitos = email.length;
    totalArrayCorreAdic = JSON.stringify({});

    $("#guacorreoAdi").button("disable");

    if (ndigitos == 0) {
        $("#imgvalidocorreo_" + aux).hide("true");
        $("#imgnovalidocorreo_" + aux).hide("true");
    } else if (regex.test($(this).val())) {
        $("#imgvalidocorreo_" + aux).show("true");
        $("#imgnovalidocorreo_" + aux).hide("true");
        if (aux == 1) {
            $("#guacorreoAdi").button("enable");
        }
    } else {
        $("#imgvalidocorreo_" + aux).hide("true");
        $("#imgnovalidocorreo_" + aux).show("true");
    }
}
var guardaCorreoAdicional = function () {
    arrCorreoAdicinal = new Object();
    arrCorreoAdicinal['vEmailAdic'] = $("#txtemail").val();
    totalArrayCorreAdic = JSON.stringify(arrCorreoAdicinal);
    $("#guacorreoAdi span").text("Modificar");
    $("#divLlenaCorreoAdic").find("tr,input,select").attr("disabled", "disabled").css({ 'background': '#F1F0F0' });
}
var ActualizaCorreoAdicional = function () {
    totalArrayCorreAdic = JSON.stringify({});
    $("#guacorreoAdi span").text("Guardar");
    $("#divLlenaCorreoAdic").find("tr,input,select").removeAttr('disabled').css({ 'background': 'none' });
}
var fnvalidarespuestacombo = function () {
    try {
        //alert($('#cbRespuestas').text());
        var id = identificadorPregunta;
        var idrespuetsa = $('#cbRespuestas').val();
        for (r in respuestas) {
            if (respuestas[r]["idpregunta"] == id && respuestas[r]["idrespuesta"] == idrespuetsa) {
                $("#btnSiguiente").button("enable");
                fnMostrarControlesRespuesta(respuestas[r]["tipodescripcion"]);
                break;
            }
            else {
                $("#btnSiguiente").button("disable");
            }
        }
    } catch (e) {
        alerta('<div class="alerta">' + e.name + " - " + e.message + '</div>', $("#span_sistema").html());
    }
}
function fnAnteriorPregunta() {
    var arrayCadena = cadenaPregRespuestas.split("|");
    arrayPregResp = cadenaPregRespuestas.split("|");
    cadenaPregRespuestas = "";

    for (c in arrayCadena) {
        if (arrayCadena[c] != arrayPregResp[arrayPregResp.length - 1]) {
            if (cadenaPregRespuestas == "") {
                if (arrayCadena.length == 1) {
                    cadenaPregRespuestas = "";
                }
                else {
                    cadenaPregRespuestas = arrayCadena[c];
                }
            }
            else {
                if (cadenaPregRespuestas != '') {
                    cadenaPregRespuestas += '|' + arrayCadena[c];
                }
            }
        }
        else {
            if (arrayCadena.length == 1) {
                cadenaPregRespuestas = "";
            }
        }
    }
    //alert('2 '+cadenaPregRespuestas);	
    var preguntascaminoarray = preguntasCamino.split("|");
    var preganterior = preguntascaminoarray.length;

    for (p in preguntas) {
        //alert(preguntas[p]["descripcion"]);
        if (preguntas[p]["idpregunta"] == preguntascaminoarray[preganterior - 1]) {
            $('#txtPreguntaDes').html(preguntas[p]["descripcion"]);
            identificadorPregunta = preguntas[p]["idpregunta"];
            fnMostrarControlesPreguntas(preguntas[p]["tipocampo"]);
            break;
        } else {
            $("#btnSiguiente").button("disable");
        }
    }
    //recargar camino preguntas
    preguntasCamino = '';
    for (var pregunta in preguntascaminoarray) {
        if (pregunta < preganterior - 1) {
            if (preguntasCamino == '') {
                preguntasCamino = preguntascaminoarray[pregunta];
            } else {
                preguntasCamino = preguntasCamino + '|' + preguntascaminoarray[pregunta];
            }
        }
    }
    obtieneRespuesta();
}

function fnSiguientePregunta() {
    if (cadenaPregRespuestas == "") {
        cadenaPregRespuestas = $("#txtPreguntaDes").text() + ':' + $("#cbRespuestas option:selected").text();
    }
    else {
        if ($("#txtPreguntaDes").text() != '') {
            cadenaPregRespuestas += '|' + $("#txtPreguntaDes").text() + ':' + $("#cbRespuestas option:selected").text();
        }
    }
    //alert(cadenaPregRespuestas);
    var diferencia;
    var id = identificadorPregunta;
    var idvalorpregunta;
    if (preguntasCamino == '') {
        preguntasCamino = preguntasCamino + id;
    }
    else {
        preguntasCamino = preguntasCamino + '|' + id;
    }
    if ($('#cbRespuestas').val() != '0') {
        idvalorpregunta = $('#cbRespuestas').val();
        var respuestasarray = arrayRespuestas.split("|");

        if ($('#txtEspL').val() != '') {
            respuestasarray[id - 1] = idvalorpregunta + '-' + $('#txtEspL').val();
            $('#txtEspL').val("");
        } else {
            respuestasarray[id - 1] = idvalorpregunta;
            $('#txtEspL').val("");
        }
        if ($('#txtEspLN').val() != '') {
            respuestasarray[id - 1] = idvalorpregunta + '-' + $('#txtEspLN').val();
            $('#txtEspLN').val("");
        } else {
            respuestasarray[id - 1] = idvalorpregunta;
            $('#txtEspLN').val("");
        }
        if ($('#txtEspN').val() != '') {
            respuestasarray[id - 1] = idvalorpregunta + '-' + $('#txtEspN').val();
            $('#txtEspN').val("");
        } else {
            respuestasarray[id - 1] = idvalorpregunta;
            $('#txtEspN').val("");
        }

    }
    if ($('#txtRespN').val() != '') {
        idvalorpregunta = '-1';
        var respuestasarray = arrayRespuestas.split("|");
        respuestasarray[id - 1] = $('#txtRespN').val();
        $('#txtRespN').val("");
    }
    if ($('#txtRespL').val() != '') {
        idvalorpregunta = '-1';
        var respuestasarray = arrayRespuestas.split("|");
        respuestasarray[id - 1] = $('#txtRespL').val();
        $('#txtRespL').val("");
    }
    if ($('#txtRespLN').val() != '') {
        idvalorpregunta = '-1';
        var respuestasarray = arrayRespuestas.split("|");
        respuestasarray[id - 1] = $('#txtRespLN').val();
        $('#txtRespLN').val("");
    }
    if ($('#dateArrival').val() != 'AAAA-MM-DD') {
        idvalorpregunta = '-1';
        var respuestasarray = arrayRespuestas.split("|");
        respuestasarray[id - 1] = $('#dateArrival').val();
        $('#dateArrival').val('AAAA-MM-DD');
    }
    //recargar respuestas
    arrayRespuestas = '';
    for (var respuesta in respuestasarray) {
        if (arrayRespuestas == '') {
            arrayRespuestas = respuestasarray[respuesta];
        } else {
            arrayRespuestas = arrayRespuestas + '|' + respuestasarray[respuesta];
        }
    }
    for (s in secuencia) {
        if (secuencia[s]["idpregunta"] == id && secuencia[s]["idvalorpregunta"] == idvalorpregunta) {

            var idSiguientePregunta = secuencia[s]["idsiguientepregunta"];

            if (idSiguientePregunta == '0') {
                fnMostrarControlesPreguntas('0');
                break;
            }
            for (p in preguntas) {

                if (preguntas[p]["idpregunta"] == idSiguientePregunta) {
                    $("#btnSiguiente").button("disable");
                    $("#btnAnterior").button("enable");
                    $("#txtPreguntaDes").html(preguntas[p]["descripcion"]);
                    identificadorPregunta = preguntas[p]["idpregunta"];
                    fnMostrarControlesPreguntas(preguntas[p]["tipocampo"]);
                    break;
                } else {
                    $("#btnSiguiente").button("disable");
                }
            }
            break;
        }
    }
    for (d in desicion) {
        if (desicion[d]["idpregunta"] == id && desicion[d]["idrespuesta"] == idvalorpregunta) {

            var idFinGestion = desicion[d]["idfingestion"];
            finGestion = idFinGestion;
            for (f in fingestiones) {

                if (fingestiones[f]["idfingestion"] == idFinGestion) {
                    descripcion = fingestiones[f]["descripcion"];
                    break;
                }
            }
            break;
        }
    }
    obtieneRespuesta();
}
function fnMostrarControlesPreguntas(tipocampo) {

    switch (tipocampo) {
        case '-1':
            for (var i = 0; i <= 11; i++) {
                $('#tblEncuesta tr').eq(i).fadeOut(0);
            };
            break;
        case '0':
            for (var i = 0; i <= 11; i++) {
                if (i == 11) {
                    $('#tblEncuesta tr').eq(i).fadeIn(0);
                } else {
                    $('#tblEncuesta tr').eq(i).fadeOut(0);
                }
            };
            break;
        case '1':
            for (var i = 0; i <= 11; i++) {
                if (i == 0 || i == 6 || i == 10) {
                    $('#tblEncuesta tr').eq(i).fadeIn(0);
                } else {
                    $('#tblEncuesta tr').eq(i).fadeOut(0);
                }
            };
            break;
        case '2':
            for (var i = 0; i <= 11; i++) {
                if (i == 0 || i == 4 || i == 10) {
                    $('#tblEncuesta tr').eq(i).fadeIn(0);
                } else {
                    $('#tblEncuesta tr').eq(i).fadeOut(0);
                }
            };
            break;
        case '3':
            for (var i = 0; i <= 11; i++) {
                if (i == 0 || i == 5 || i == 10) {
                    $('#tblEncuesta tr').eq(i).fadeIn(0);
                } else {
                    $('#tblEncuesta tr').eq(i).fadeOut(0);
                }
            };
            break;
        case '4':
            for (var i = 0; i <= 11; i++) {
                if (i == 0 || i == 3 || i == 10) {
                    $('#tblEncuesta tr').eq(i).fadeIn(0);
                } else {
                    $('#tblEncuesta tr').eq(i).fadeOut(0);
                }
            };
            break;
        case '5':
            for (var i = 0; i <= 11; i++) {
                if (i == 0 || i == 1 || i == 10) {
                    $('#tblEncuesta tr').eq(i).fadeIn(0);
                } else {
                    $('#tblEncuesta tr').eq(i).fadeOut(0);
                }
            };
            break;
        default:
            break;
    }
}
function fnMostrarControlesRespuesta(tipoDescripcion) {

    switch (tipoDescripcion) {
        case '0':
            for (var i = 0; i <= 11; i++) {
                if (i == 2 || i == 7 || i == 8 || i == 9) {
                    $('#tblEncuesta tr').eq(i).fadeOut(0);
                }
            };
            break;
        case '1':
            for (var i = 0; i <= 11; i++) {
                if (i == 2 || i == 8 || i == 9) {
                    $('#tblEncuesta tr').eq(i).fadeOut(0);
                } else if (i == 7) {
                    $('#tblEncuesta tr').eq(i).fadeIn(0);
                }
            };
            break;
        case '2':
            for (var i = 0; i <= 11; i++) {
                if (i == 2 || i == 7 || i == 9) {
                    $('#tblEncuesta tr').eq(i).fadeOut(0);
                } else if (i == 8) {
                    $('#tblEncuesta tr').eq(i).fadeIn(0);
                }
            };
            break;
        case '3':
            for (var i = 0; i <= 11; i++) {
                if (i == 2 || i == 7 || i == 8) {
                    $('#tblEncuesta tr').eq(i).fadeOut(0);
                } else if (i == 9) {
                    $('#tblEncuesta tr').eq(i).fadeIn(0);
                }
            };
            break;
        case '4':
            for (var i = 0; i <= 11; i++) {
                if (i == 7 || i == 8 || i == 9) {
                    $('#tblEncuesta tr').eq(i).fadeOut(0);
                } else if (i == 2) {
                    $('#tblEncuesta tr').eq(i).fadeIn(0);
                }
            };
            break;
        default:
            break;
    }
}
var obtieneRespuesta = function () {

    $('#cbRespuestas').html('<option selected>Cargando...</option>');
    var idPregunta = identificadorPregunta;
    $("#cbRespuestas").html('<option value=0>Seleccione respuesta</option>')
    for (r in respuestas) {
        if (respuestas[r]["idpregunta"] == idPregunta) {
            $("#cbRespuestas").append('<option value=' + respuestas[r]["idrespuesta"] + '>' + respuestas[r]["descripcion"] + '</option>');
        }
    }
    $('#timerEncuesta').fadeOut(0);
}
var respuestasCadena
var arrayCadenaRespuestas
var arrayRespuestasArray
var resultado

var FinalizaLlamada = function () {
    $("#btnFinGestion span").text("Finalizando...");
    $("input,textarea").prop('disabled', true);
    $("#btnFinGestion").button("disable");
    $('#imgGuardaLoad').fadeIn(0);

    respuestasCadena = $("#hidden_preguntas").val();
    arrayCadenaRespuestas = respuestasCadena.split("|");
    arrayRespuestasArray = arrayRespuestas.split("|");
    resultado = "";

    if (arrayCadenaRespuestas.length == arrayRespuestasArray.length) {
        for (r in arrayCadenaRespuestas) {
            if (resultado == "") {
                resultado += arrayCadenaRespuestas[r] + ':' + arrayRespuestasArray[r];
            }
            else {
                resultado += '|' + arrayCadenaRespuestas[r] + ':' + arrayRespuestasArray[r];
            }
        }
    }

    arrayEndCallData = new Object();

    /*1*/arrayEndCallData['vCveMovimiento'] = 'T';
    /*2*/arrayEndCallData['vTipoMovimiento'] = finGestion;
    /*3*/arrayEndCallData['vNomCampana'] = namecampaingGlobal;
    /*4*/arrayEndCallData['vId'] = clienteidGlobal;
    /*5*/arrayEndCallData['vNumcliente'] = clienteGlobal;
    /*6*/arrayEndCallData['vTelefonoContacto'] = $('#hidden_telefonoContruido').val();
    /*7*/arrayEndCallData['vTelefonoNuevo'] = '0';
    /*8*/arrayEndCallData['vTipoTelAdicional'] = $('#hidden_tipoTel').val();
    /*9*/arrayEndCallData['vTipoRed'] = $('#hidden_tipoRed').val();
    /*10*/arrayEndCallData['vTipoCarrier'] = '0';
    /*11*/arrayEndCallData['vContactoAdicional'] = '0';
    /*12*/arrayEndCallData['vIdFinGestion'] = finGestion;
    /*13*/arrayEndCallData['vDescripcion'] = descripcion;
    /*14*/arrayEndCallData['vObservaciones'] = $('#txtObservaciones').val();
    /*15*/arrayEndCallData['vFechaMovto'] = 'PHP';
    /*16*/arrayEndCallData['vHoraMovto'] = 'PHP';
    /*17*/arrayEndCallData['vHoraIniMovto'] = $('#hidden_horaInicioLlamada').val();
    /*18*/arrayEndCallData['vHoraFinMovto'] = 'PHP';
    /*19*/arrayEndCallData['vHoraIniLLam'] = $('#hidden_horaInicioLlamada').val();
    /*20*/arrayEndCallData['vHoraFinLLam'] = 'PHP';
    /*21*/arrayEndCallData['vEmpleadoregistro'] = usernameGlobal;
    /*22*/arrayEndCallData['vPkWhere'] = pkwhererinconcertGlobal;
    /*23*/arrayEndCallData['vRespuestas'] = arrayRespuestas;
	/*24*/arrayEndCallData['vCteDatosGenerales'] = $("#hidden_datosGenerales").val();
	/*25*/arrayEndCallData['vPreguntas'] = respuestasCadena;

    totalArrayEndCallData = JSON.stringify(arrayEndCallData);
    //console.log(arrayEndCallData);
    //console.log(totalArrayTelAdic);
    //console.log(totalArrayCorreAdic);

    var parametros = "opc=guardaMovCampanaUnica" +
        "&totalArrayEndCallData=" + totalArrayEndCallData +
        "&totalArrayTelAdic=" + totalArrayTelAdic +
        "&totalArrayCorreAdic=" + totalArrayCorreAdic +
        "&id=" + Math.random();

    //alert($("#hidden_datosGenerales").val() +' '+ cadenaPregRespuestas);
    $.ajax({
        cache: false,
        //async: false,
        //timeout: 5000,
        url: 'php/functions.php',
        type: 'POST',
        dataType: 'JSON',
        data: parametros,
        success: function (response) {
            if (response.estado == 1) {
                //  Confeti()
                if (finGestion == 1 && namecampaingGlobal != 'CP_CUE_ENCUESTACOPPELMAX_20210526') {
                    Confeti()

                    setTimeout(function () {
                        colgarLlamada();
                    }, 2000);

                } else {

                    colgarLlamada();
                }
            } else if (response.estado <= 0) {
                alerta('<div class="error">' + response.mensaje + '</div>', $("#span_sistema").html());
            }
        },
        error: function (xhr, status, error) {
            $('#imgGuardaPreventiva').fadeOut(0);
            alerta('<div class="error">guardaMovCampanaUnica: ' + xhr.responseText + '</div>', $("#span_sistema").html());
        }
    });
}
/*Funciones para colgar en Genesys*/

var colgarLlamada = function () {
    // var finGestion = parseInt($("#finllamadaCob").val());
    var sdispositioncode = '0';

    if (finGestion < 10) {
        sdispositioncode = '7' + finGestion.toString();
    } else {
        sdispositioncode = '7' + finGestion.toString();
    }

    console.log('Prueba sdispositioncode');
    console.log(finGestion.toString());
    console.log('Prueba llamada_id');
    console.log(pkwhererinconcertGlobal);

    califLlamada(sdispositioncode, pkwhererinconcertGlobal);

    setDispositionCodeGenesys(sdispositioncode);
    release(true, true);
    lblLlamando();
}
function Confeti() {

    var canva = document.createElement("canvas")
    canva.id = "confetis"

    $("#contPrincipal").append(canva)

    let W = $("#contPrincipal").width();
    let H = $("#contPrincipal").height();
    const canvas = document.getElementById("confetis");
    const context = canvas.getContext("2d");
    const maxConfettis = 150;
    const particles = [];

    const possibleColors = [
        "DodgerBlue",
        "OliveDrab",
        "Gold",
        "Pink",
        "SlateBlue",
        "LightBlue",
        "Gold",
        "Violet",
        "PaleGreen",
        "SteelBlue",
        "SandyBrown",
        "Chocolate",
        "Crimson"
    ];

    function randomFromTo(from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }

    function confettiParticle() {
        this.x = Math.random() * W; // x
        this.y = Math.random() * H - H; // y
        this.r = randomFromTo(11, 33); // radius
        this.d = Math.random() * maxConfettis + 11;
        this.color =
            possibleColors[Math.floor(Math.random() * possibleColors.length)];
        this.tilt = Math.floor(Math.random() * 33) - 11;
        this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
        this.tiltAngle = 0;

        this.draw = function () {
            context.beginPath();
            context.lineWidth = this.r / 2;
            context.strokeStyle = this.color;
            context.moveTo(this.x + this.tilt + this.r / 3, this.y);
            context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
            return context.stroke();
        };
    }

    function Draw() {
        const results = [];

        // Magical recursive functional love
        requestAnimationFrame(Draw);

        context.clearRect(0, 0, W, $("#contPrincipal").height());

        for (var i = 0; i < maxConfettis; i++) {
            results.push(particles[i].draw());
        }

        let particle = {};
        let remainingFlakes = 0;
        for (var i = 0; i < maxConfettis; i++) {
            particle = particles[i];

            particle.tiltAngle += particle.tiltAngleIncremental;
            particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
            particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

            if (particle.y <= H) remainingFlakes++;

            // If a confetti has fluttered out of view,
            // bring it back to above the viewport and let if re-fall.
            if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
                particle.x = Math.random() * W;
                particle.y = -30;
                particle.tilt = Math.floor(Math.random() * 10) - 20;
            }
        }

        return results;
    }

    window.addEventListener(
        "resize",
        function () {
            W = $("#contPrincipal").width();
            H = $("#contPrincipal").height();
            canvas.width = $("#contPrincipal").width();
            canvas.height = $("#contPrincipal").height();
        },
        false
    );

    // Push new confetti objects to `particles[]`
    for (var i = 0; i < maxConfettis; i++) {
        particles.push(new confettiParticle());
    }

    // Initialize
    canvas.width = W;
    canvas.height = H;
    Draw();

}

// Funcion para llamar el proceso almacenado de calif llamada
function califLlamada(dispositioncode, pkwhererinconcertGlobal) {
    var vIdgenesys = $('#llamada_id').val();

    var parametros = {
        'opc': 'califLlamada',
        'vCalifLlamada': pkwhererinconcertGlobal,
        'vFinllamada': dispositioncode,
    };

    //console.log("Hola papu");
    console.log("ID GENESYS: " + pkwhererinconcertGlobal);
    console.log("DISPOSITION CODE: " + dispositioncode);

    $.ajax({
        cache: false,
        type: 'POST',
        //async: false,
        datatype: 'json',
        url: './php/functions.php',
        data: parametros,
        success: function (response) {
            console.log("Aqui va el response:");
            console.log(response);
        },
        error: function () {
            alert("Error: califLlamada");
            console.log("Error califllamada");
        }
    });
}

var markDone = function () {
    var parameters = new Array();
    return window.external.WorkspaceInvoke('MarkDone', parameters);
    return;
}
var release = function (markDone, agentReady) {
    var parameters = new Array();
    parameters['MarkDone'] = markDone;
    parameters['AgentReady'] = agentReady;
    return window.external.WorkspaceInvoke('Release', parameters);
    return;
}
var setAgentReady = function () {
    var parameters = new Array();
    return window.external.WorkspaceInvoke('AgentReady', parameters);
    return;
}
var setDispositionCodeGenesys = function (dispositionCode) {
    var parameters = new Array();
    //parameters['dispositionCode'] = document.getElementById('dispositionCode').value;
    parameters['dispositionCode'] = dispositionCode;
    return window.external.WorkspaceInvoke('SetDispositionCode', parameters);
    return;
}

/*Termina*/

/*Funciones para colgar en Inconcert*/
/*var colgarLlamada = function(){
    
    if(contador == 0){
        colgarLlamada_unavez();
    }
    if(contador == 1){
        if($("#V_SUCCESS_CODE").val() != "200"){
            contador=0;
        }
    }           
    if(contador == 2){
        setDispositionCode(outboundprocessinconcertGlobal,"",contactidGlobal,pkwhererinconcertGlobal,"0",finGestion);
    }
    if(contador == 3){
        if($("#V_SUCCESS_CODE").val() != "200"){
            contador=2;
        }
    }
    if(contador == 4){                 
        logout();
    }
    if(contador == 5){                                         
        colgarLlamada_dosvez();
    }
    if(contador == 6){                                         
        return false;
    }
    contador=contador+1;
    setTimeout('colgarLlamada()',1000);
}
var colgarLlamada_unavez = function(){    
    try {
        var INTERACTIONID;
        var STATUSLLAMADA;
        MyObject = new ActiveXObject("BarAgentControl.BAControl");  
        INTERACTIONID = MyObject.GetIdCall();       
        STATUSLLAMADA = MyObject.CurrentIntStateByID(INTERACTIONID);
        
        while(STATUSLLAMADA == 'TAKED'){            
            switch(STATUSLLAMADA){
                case 'TAKED':
                    MyObject.HangUp();
                    break;
                default:            
            }
            STATUSLLAMADA = MyObject.CurrentIntStateByID(INTERACTIONID);
        }
    } catch(e) {
        alerta('<div class="error">colgarLlamada_unavez:'+e.name + " - "+e.message+'</div>',$("#span_sistema").html());
    }
}
var colgarLlamada_dosvez = function(){
    lblLlamando();
    try {
        var INTERACTIONID;
        var STATUSLLAMADA;
        MyObject = new ActiveXObject("BarAgentControl.BAControl");  
        INTERACTIONID = MyObject.GetIdCall();       
        STATUSLLAMADA = MyObject.CurrentIntStateByID(INTERACTIONID);
        
        while(STATUSLLAMADA != ""){ 
            switch(STATUSLLAMADA){
                case "TAKED":
                    MyObject.HangUp();                      
                    break;
                case "ENDED":               
                    MyObject.WrapUp();                      
                    break;          
                default:
            }
            STATUSLLAMADA = MyObject.CurrentIntStateByID(INTERACTIONID);    
        }
    } catch(e) {
        alerta('<div class="error">colgarLlamada_dosvez:'+e.name + " - "+e.message+'</div>',$("#span_sistema").html());
    }   
}*/
/*Termina*/
var lblLlamando = function () {
    $('#imgGuardaLoad').fadeOut(0);
    var htmlBarraEspLLamada = '';
    htmlBarraEspLLamada += '<ul style="font-size:2.5em;text-align:center;" class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">';
    htmlBarraEspLLamada += 'Esperando llamada';
    htmlBarraEspLLamada += '<img style="width:25px;height:25px;margin-left:5px;" src="css/img/telefono-azul1.png">';
    htmlBarraEspLLamada += '<img style="width:2%;margin-left:5px;" src="css/img/3_puntos.gif">';
    htmlBarraEspLLamada += '</ul>';
    $("#contPrincipal").html(htmlBarraEspLLamada);
}

