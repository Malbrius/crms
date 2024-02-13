$.ajaxSetup({cache:false});
if(history.forward(1))location.replace(history.forward(1));
//Declaracion de todas las variables que usamos en el sistema.
var usernameGlobal;
var answernumberGlobal;
var clienteidGlobal;
var namecampaingGlobal;
var contactidGlobal;
var clienteGlobal;
var tokeninconcertGlobal;
var pkwhererinconcertGlobal;
var virtualinconcertGlobal;
var outboundprocessinconcertGlobal;
var campanainconcertGlobal;
var batchidinconcertGlobal;
var hidden_horaInicioLlamadaGlobal;

var preguntas;
var respuestas;
var secuencia;
var desicion;
var fingestiones;
var cadenaPreguntas;

var identificadorPregunta;
var tipoCampo;
var arrayRespuestas;

var inicia = function(){
    //Barra principal
	$("#tabs").tabs();
    $("#tabs").tabs({collapsible: false});
    $('input').addClass("ui-widget ui-widget-content ui-corner-all").css("border","2px solid #a6c9e2");
    $('button').addClass("ui-widget ui-widget-content ui-corner-all").css("border","2px solid #a6c9e2");
    $('select').addClass("ui-widget ui-widget-content ui-corner-all").css("border","2px solid #a6c9e2");
	$("#btnAgregaTel").css({width: '200px', height: '30px','padding-top': '1px', 'padding-bottom': '1px'});
    $("#btnAgregaTel").button();
    $("#btnCorreo").css({width: '200px', height: '30px','padding-top': '1px', 'padding-bottom': '1px'});
    $("#btnCorreo").button();
    $("#btnAnterior").css({width: '130px', height: '40px','padding-top': '1px', 'padding-bottom': '1px'});
    $("#btnAnterior").button({
        icons: {
            primary: "ui-icon-circle-arrow-w"
        },
        disabled:true
    });
    $("#btnSiguiente").css({width: '130px', height: '40px','padding-top': '1px', 'padding-bottom': '1px'});
    $("#btnSiguiente").button({
        icons: {
            secondary: "ui-icon-circle-arrow-e"
        },
        disabled:true
    });
    $("#btnFinGestion").css({width: '150px', height: '50px','padding-top': '1px', 'padding-bottom': '1px'});
    $("#btnFinGestion").button();
    $('#imgGuardaLoad').fadeOut(0);
    FechaHora();
    //Abre la ventana de la pantalla, se ajusta automatico
    window.onload = maxWindow;
    function maxWindow(){
        if(screen.availHeight == "786"){                
            window.moveTo(0,122);
        }else if(screen.availHeight == "759"){
            window.moveTo(0,122);
        }else if(screen.availHeight == "841"){
            window.moveTo(0,40);
        }else if(screen.availHeight == "869"){
            window.moveTo(0,0);
        }else if(screen.availHeight == "829"){
            window.moveTo(0,40);
        }else if(screen.availHeight == "954"){
            window.moveTo(0,40);
        }
        window.resizeTo(screen.availWidth,screen.availHeight);
    }//Termina ajuste de la pantalla
       
    var CargaHtmlTablaInfCliente = function(clienteidGlobal,namecampaingGlobal,answernumberGlobal){
        $('.timer').fadeIn(0);
        var parametros = "opc=CargaInf_General"+
                         "&clienteid="+clienteidGlobal+
                         "&nombrecampana="+namecampaingGlobal+
                         "&telefonomarcando="+answernumberGlobal+
                         "&id="+Math.random();
        //Enviamos los datos al PHP atraves de ajax
        $.ajax({
                cache: false,
                //async: false,
                //timeout: 1000,
                url: 'php/loadIndex.php',
                type: 'POST',
                dataType: 'JSON',
                data: parametros,
                success: function(response){
                    $('#divLlenaMarcando').html(response.htmlTablaMarcando);
                    $('#divLlenaInformacionGeneral').html(response.htmlTablaGeneral);
                    CargaHtmlObsvHistarial(usernameGlobal,clienteidGlobal,namecampaingGlobal);
                    if(response.estado != 1){
                        alerta('<div class="alerta">'+response.mensaje+'</div>',$("#span_sistema").html());
                    }
                    $('#timerGeneral').fadeOut(0);
                    $('#timerMarcando').fadeOut(0);
                },
                error:function(xhr,status,error){
                    $('#timerGeneral').fadeOut(0);
                    $('#timerMarcando').fadeOut(0);
                    alerta('<div class="error">CargaInf_General: '+xhr.responseText+'</div>',$("#span_sistema").html());
                }
              });
    }
    var CargaHtmlObsvHistarial = function(usernameGlobal,clienteidGlobal,namecampaingGlobal){
        var parametros = "opc=CargaInf_ObsHistorial"+
                         "&usernameglobal="+usernameGlobal+
                         "&clienteid="+clienteidGlobal+
                         "&nombrecampana="+namecampaingGlobal+
                         "&id="+Math.random();
        //Enviamos los datos al PHP atraves de ajax
        $.ajax({
                cache: false,
                //async: false,
                //timeout: 1000,
                url: 'php/loadIndex.php',
                type: 'POST',
                dataType: 'JSON',
                data: parametros,
                success: function(response){

                    $('#divLlenaHistObservaciones').html(response.htmlTablaObsHistory);
                   
                    CargaHtmlEncuestaAndArrays(namecampaingGlobal);
                    if(response.estado != 1){
                        alerta('<div class="alerta">'+response.mensaje+'</div>',$("#span_sistema").html());
                    }
                    $('#timerHistObsv').fadeOut(0);
                },
                error:function(xhr,status,error){
                    $('#timerHistObsv').fadeOut(0);
                    alerta('<div class="error">CargaInf_ObsHistorial: '+xhr.responseText+'</div>',$("#span_sistema").html());
                }
              });
    }
    var CargaHtmlEncuestaAndArrays = function(namecampaingGlobal){
        var parametros = "opc=CargaInf_Encuesta"+
                         "&nombrecampana="+namecampaingGlobal+
                         "&id="+Math.random();
        //Enviamos los datos al PHP atraves de ajax
        $.ajax({
                cache: false,
                //async: false,
                //timeout: 1000,
                url: 'php/loadIndex.php',
                type: 'POST',
                dataType: 'JSON',
                data: parametros,
                success: function(response){
                    preguntas  = response.ArrayPregunta;					
                    respuestas = response.ArrayRespuestas;
                    secuencia  = response.ArraySecuencia;
                    desicion   = response.ArrayDesicion;
                    fingestiones = response.ArrayFinGestion;
                    arrayRespuestas = response.ArrayPreguntasdefaul;
					cadenaPreguntas = respuestas[0]['cadenapreguntas'];
					$("#spanpreguntas").html("<input type='hidden' id='hidden_preguntas' value='"+cadenaPreguntas+"'>");
					//alert($("#hidden_preguntas").val());
					//alert(cadenaPreguntas);
                    $('#txtPreguntaDes').html(preguntas[0]['descripcion']);
                    identificadorPregunta = preguntas[0]['idpregunta'];
                    tipoCampo             = preguntas[0]['tipocampo'];
                    obtieneRespuesta();
                    if(tipoCampo != ''){
                        fnMostrarControlesPreguntas(tipoCampo);
                    }else{
                        fnMostrarControlesPreguntas('-1');
                    }
                    CargaHtmlTelefonosAdicional();
                    if(response.estado != 1){
                        alerta('<div class="alerta">'+response.mensaje+'</div>',$("#span_sistema").html());
                    }
                },
                error:function(xhr,status,error){
                    alerta('<div class="error">CargaInf_Encuesta: '+xhr.responseText+'</div>',$("#span_sistema").html());
                }
              });
    }
    var CargaHtmlTelefonosAdicional = function(){
        hidden_cliente  = clienteidGlobal;
        var htmlTablaTelefonosAdic = "";
        htmlTablaTelefonosAdic  ='<table style="font-size:15px; font-weight:bold;" class="ui-widget">';
            htmlTablaTelefonosAdic +='<tr>';
                htmlTablaTelefonosAdic +='<td class="ui-state-default ui-th-column ui-th-ltr" align = "left">ID:</td>';
                htmlTablaTelefonosAdic +='<td style="color:red;" class="marcoColumnas" align = "left">'+hidden_cliente+'</td>';
            htmlTablaTelefonosAdic +='</tr>';
        htmlTablaTelefonosAdic +='</table>';
        htmlTablaTelefonosAdic +='<br>';
        htmlTablaTelefonosAdic +='<table id="tablaTelsAdicionales" style="font-size:15px;" align="center" class="ui-widget" >';
             htmlTablaTelefonosAdic +='<tr>';
                htmlTablaTelefonosAdic +='<td colspan="2" class="ui-state-default ui-th-column ui-th-ltr" align="center">Tel&eacute;fono</td>';
                htmlTablaTelefonosAdic +='<td class="ui-state-default ui-th-column ui-th-ltr" align="center">Tipo</td>';
            htmlTablaTelefonosAdic +='</tr>';
            htmlTablaTelefonosAdic +='<tr>';
                htmlTablaTelefonosAdic +='<td class="ui-state-default ui-th-column ui-th-ltr" width="15" align="center">1</td>';
                htmlTablaTelefonosAdic +='<td class="marcoColumnas"><input type="text" id="txtTelAdic_1" maxlength="10" size="10"></td>';
                htmlTablaTelefonosAdic +='<td class="marcoColumnas">';
                    htmlTablaTelefonosAdic +='<select id="cmbTipoTel_1">';
                            htmlTablaTelefonosAdic +='<option value="0" selected >Seleccione</option>';                     
                            htmlTablaTelefonosAdic +='<option value="2">CELULAR</option>';
                            htmlTablaTelefonosAdic +='<option value="1">CASA</option>';
                    htmlTablaTelefonosAdic +='</select>';
                    htmlTablaTelefonosAdic +='<img id="imgvalido_1"   src="css/img/clean.png" width="20" style="display:none; position:relative; top:4px;" >';
                    htmlTablaTelefonosAdic +='<img id="imgnovalido_1" src="css/img/cruz.png"  width="20" style="display:none; position:relative; top:4px;" >';
                htmlTablaTelefonosAdic +='</td>';
            htmlTablaTelefonosAdic +='</tr>';
            htmlTablaTelefonosAdic +='<tr>';
                htmlTablaTelefonosAdic +='<td class="ui-state-default ui-th-column ui-th-ltr" width="15" align="center">2</td>';
                htmlTablaTelefonosAdic +='<td class="marcoColumnas"><input type="text" id="txtTelAdic_2" maxlength="10" size="10"></td>';
                htmlTablaTelefonosAdic +='<td class="marcoColumnas">';
                    htmlTablaTelefonosAdic +='<select id="cmbTipoTel_2">';
                            htmlTablaTelefonosAdic +='<option value="0" selected >Seleccione</option>';                  
                            htmlTablaTelefonosAdic +='<option value="2">CELULAR</option>';
                            htmlTablaTelefonosAdic +='<option value="1">CASA</option>';
                    htmlTablaTelefonosAdic +='</select>';
                    htmlTablaTelefonosAdic +='<img id="imgvalido_2"   src="css/img/clean.png" width="20" style="display:none; position:relative; top:4px;" >';
                    htmlTablaTelefonosAdic +='<img id="imgnovalido_2" src="css/img/cruz.png"  width="20" style="display:none; position:relative; top:4px;" >';
                htmlTablaTelefonosAdic +='</td>';
            htmlTablaTelefonosAdic +='</tr>';
        htmlTablaTelefonosAdic +='</table>';
        htmlTablaTelefonosAdic +='<input type="hidden" id="hiddenTelAdicTipoRed_1">';
        htmlTablaTelefonosAdic +='<input type="hidden" id="hiddenTelAdicTipoRed_2">';

        $('#divLlenaTelefonosAdic').html(htmlTablaTelefonosAdic);
        $('#divLlenaTelefonosAdic').dialog({
            title: "Captura telefonos adic.",
            autoOpen: false,
            height: "auto",
            width: "auto",
            show: "blind",
            resizable: false,
            modal: true,
            buttons:
            [
                {
                    disabled:true,
                    id: "guaTelefonosAdi",
                    text: "Guardar",
                    click: function(){
                        guardaTelefonosAdicionales();
                    },
                    dblclick:function(){
                        ActualizaTelefonosAdicionales();
                    }
                },
                {
                    text: "Cerrar",
                    click: function(){
                        $(this).dialog("close");
                    }
                }
            ]            
        });
        //eventos del dialog telefonos adicionales
        $('#txtTelAdic_1').on('keyup',{ param:'1'},buscaTelefonoValido);
        $('#txtTelAdic_2').on('keyup',{ param:'2'},buscaTelefonoValido);
        $('#txtTelAdic_1').on('keypress',validanumeros);
        $('#txtTelAdic_2').on('keypress',validanumeros);
        CargaHtmlCorreoAdicinal();
    }
    var CargaHtmlCorreoAdicinal= function(){
         /*Ventana modal del correo adicional*/
        var htmlTabla = "";
        htmlTabla ='<br>';
        htmlTabla +='<table id="tablacorreoAdic" style="font-size:15px;" align="center" class="ui-widget" >';
             htmlTabla +='<tr>';
                htmlTabla +='<td colspan="2" class="ui-state-default ui-th-column ui-th-ltr" align="center">Correo</td>';
            htmlTabla +='</tr>';
            htmlTabla +='<tr>';
                htmlTabla +='<td class="ui-state-default ui-th-column ui-th-ltr" width="15" align="center">1</td>';
                htmlTabla +='<td class="marcoColumnas">';
                    htmlTabla +='<input id="txtemail" type="text"  size="40" style="text-transform: uppercase;" onkeyup="javascript:this.value=this.value.toUpperCase();">';
                    htmlTabla +='<img id="imgvalidocorreo_1"   src="css/img/clean.png" width="20" style="display:none; position:relative; top:4px;" >';
                    htmlTabla +='<img id="imgnovalidocorreo_1" src="css/img/cruz.png"  width="20" style="display:none; position:relative; top:4px;" >';
                htmlTabla +='</td>';
            htmlTabla +='</tr>';
        htmlTabla +='</table>';

        $('#divLlenaCorreoAdic').html(htmlTabla);
        $('#divLlenaCorreoAdic').dialog({
            title: "Captura correo",
            autoOpen: false,
            height: "auto",
            width: "auto",
            show: "blind",
            resizable: false,
            modal: true,
            buttons:
            [
                {
                    disabled:true,
                    id: "guacorreoAdi",
                    text: "Guardar",
                    click: function(){
                        guardaCorreoAdicional();
                    },
                    dblclick:function(){
                        ActualizaCorreoAdicional();
                    }
                },
                {
                    text: "Cerrar",
                    click: function(){
                        $(this).dialog("close");
                    }
                }
            ]            
        });
        $('#txtemail').on('keyup',{param:'1'},validaCorreo);
    }
    //Valida si los inputs de resive tipo hidden exixten de lo contrario vacia el html
    if ( $("#clienteid").length && $("#answernumber").length  && $("#username").length ){

        usernameGlobal                  = $.trim($("#username").val());
        answernumberGlobal              = $.trim($("#answernumber").val());
        clienteidGlobal                 = $.trim($("#clienteid").val());
        namecampaingGlobal              = $.trim($("#namecampaing").val());
        contactidGlobal                 = $.trim($("#contactid").val());
        clienteGlobal                   = $.trim($("#cliente").val());
        tokeninconcertGlobal            = $.trim($("#tokeninconcert").val());
        pkwhererinconcertGlobal         = $.trim($("#pkwhererinconcert").val());
        virtualinconcertGlobal          = $.trim($("#virtualinconcert").val());
        outboundprocessinconcertGlobal  = $.trim($("#outboundprocessinconcert").val());
        campanainconcertGlobal          = $.trim($("#campanainconcert").val());
        batchidinconcertGlobal          = $.trim($("#batchidinconcert").val());
        hidden_horaInicioLlamadaGlobal  = $.trim($("#hidden_horaInicioLlamada").val());

        $("#lblEjecutivo").html("<label>Ejecutivo: "+usernameGlobal+"</label>");
        $("#nomCampana").html(namecampaingGlobal.toUpperCase());

        /*Validamos que el numero de empleado sea numerico*/
        if(tiene_letras(usernameGlobal)){
            $("#contPrincipal").html("");
            alerta('<div class="alerta">El numero de empleado ( '+usernameGlobal+' ) <br> Es un usuario incorrecto debido a que contiene letras.</div>',$("#span_sistema").html());
            return;
        }
        if(tokeninconcertGlobal != ''){
            loginByToken(tokeninconcertGlobal);
        }
        /*Termina*/
        CargaHtmlTablaInfCliente(clienteidGlobal,namecampaingGlobal,answernumberGlobal);
    }else{
        var htmlinInformacionSinDatos='';
        htmlinInformacionSinDatos+='<ul style="font-size:2.2em;text-align:center;" class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">';
            htmlinInformacionSinDatos+='<img style="margin-left:5px;" src="css/img/error.png"/>';
            htmlinInformacionSinDatos+='Error al cargar los datos';
        htmlinInformacionSinDatos+='</ul>';
        $("#contPrincipal").html(htmlinInformacionSinDatos);
    }
}
$(document).on("ready",inicia);
var tiene_letras = function (texto){

    var letras="abcdefghyjklmnñopqrstuvwxyz";
    texto = texto.toLowerCase();
    for(i=0; i<texto.length; i++){
        if (letras.indexOf(texto.charAt(i),0)!=-1){
         return true;
        }
   }
   return false;
}
var alerta = function(msj,titulo,focus){
    var div = $("<div title='"+titulo+"' style='font-size:15px; color: #2e6e9e;'>"+msj+"</div>");
    div.dialog({
        modal: true,        
        height: "auto",
        width: "auto",
        hide: 'fold',
        show: 'blind',
        //resizable:false
        buttons:{ 'Aceptar': function(){
            $(this).dialog('close');
            $(this).remove();
            }
        },
        closeOnEscape: true,
        close:function(){
            $(this).remove();
            if(focus != undefined){
                setTimeout(function(){document.getElementById(focus).focus();},10);
            }
        }
    });
}
var FechaHora = function(){          
    var mydate=new Date();
    var year=mydate.getYear();            
    if (year < 1000){
        year+=1900;
    }
    var day=mydate.getDay();
    var month=mydate.getMonth()+1;     
    if (month<10){
        month="0"+month; 
    }
    var daym=mydate.getDate();          
    if (daym<10){
        daym="0"+daym; 
    }           
    var Digital=new Date(); 
    var hours=Digital.getHours(); 
    var minutes=Digital.getMinutes(); 
    var seconds=Digital.getSeconds(); 
    var dn="AM";
    if (hours>12){
        dn="PM";
        hours=hours;
    }
    if (hours==0){
        hours=12;
    }
    if (minutes<=9){
        minutes="0"+minutes; 
    }
    if (seconds<=9){
        seconds="0"+seconds;
    }
    $("#FechaHora").html(""+daym+"/"+month+"/"+year+" "+hours+":"+minutes+":"+seconds+" "+dn);
    setTimeout("FechaHora()",1000);          
}