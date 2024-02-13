<?php
include('php/fechaHora.php');

/*$_POST["USER_AUTH_TOKEN"]    ='494d97cb-9d23-11e5-8d02-0022640d58fa';
$_POST["SAGTEMSG_PKWHERE"]   ='790F3DD754B34679AC4EC820EA905822';
$_POST["SAGTEMSG_USUARIO"]   ='93136421';
$_POST["SVIRTUALCC"] 	     ='coppel';
$_POST["SOUTBOUNDPROCESSID"] ='cobranzaweb';
$_POST["SCAMPAIGNID"] 		 ='ORIGENCREDITO';
$_POST["SBATCHID"] 		     ='ORIGENCREDITO';
$_POST["SADDRESS"] 			 ='[52]-[1667]-[1618924]-[]';
$_POST["SCLIENTEID"] 		 ='8';
$_POST["SDESCRICAMPANA"]     ='ORIGENCREDITO';
$_POST["SCONTACTID"] 	     ='';
$_POST["SCLIENTE"] 			 ='15435746';*/

/*
$userName 	  = (isset($_GET['SAGTEMSG_USUARIO']))?$_GET['SAGTEMSG_USUARIO']:$_POST['SAGTEMSG_USUARIO'];  
$answerNumber = (isset($_GET['SADDRESS']))?$_GET['SADDRESS']:$_POST['SADDRESS'];
$clienteId    = (isset($_GET['SCLIENTEID']))?$_GET['SCLIENTEID']:$_POST['SCLIENTEID'];
$nameCampaign = (isset($_GET['SDESCRICAMPANA']))?$_GET['SDESCRICAMPANA']:$_POST['SDESCRICAMPANA'];
$contactId    = (isset($_GET['SCONTACTID']))?$_GET['SCONTACTID']:$_POST['SCONTACTID']; 
$cliente      = (isset($_GET['SCLIENTE']))?$_GET['SCLIENTE']:$_POST['SCLIENTE'];  
*/
/*
$_GET['username'] = '93889631';
$_GET['answernumber'] = '05491160520745';
$_GET['clienteid'] = '400100000000069';
$_GET['campaign'] = 'RADIOARGENTINA';
$_GET['cliente'] = '406153';
$_GET['uid'] = '00FJT3H8VGB7565J28NIO2LAES2S0LC4_2016-02-18_17-30-37';
*/
$userName 	  = (isset($_GET['username']))?$_GET['username']:$_POST['username'];  
$answerNumber = (isset($_GET['answernumber']))?$_GET['answernumber']:$_POST['answernumber'];
$clienteId    = (isset($_GET['clienteid']))?$_GET['clienteid']:$_POST['clienteid'];
$nameCampaign = (isset($_GET['campaign']))?$_GET['campaign']:$_POST['campaign'];
$cliente      = (isset($_GET['cliente']))?$_GET['cliente']:$_POST['cliente'];  
$pkwhererInconcert      = (isset($_GET['llamada_id']))?$_GET['llamada_id']:$_POST['llamada_id'];  

// echo $userName." ";
// echo $answerNumber." ";
// echo $clienteId." ";
// echo $nameCampaign;
// echo $cliente;
// echo $pkwhererInconcert;

/*Varibles para guardan fin gestion inconcert*/
$tokenInconcert			  = (isset($_GET['USER_AUTH_TOKEN']))?$_GET['USER_AUTH_TOKEN']:$_POST['USER_AUTH_TOKEN'];
//$pkwhererInconcert		  = (isset($_GET['SAGTEMSG_PKWHERE']))?$_GET['SAGTEMSG_PKWHERE']:$_POST['SAGTEMSG_PKWHERE'];
$virtualInconcert	  	  = (isset($_GET['SVIRTUALCC']))?$_GET['SVIRTUALCC']:$_POST['SVIRTUALCC'];
$outBoundProcessInconcert = (isset($_GET['SOUTBOUNDPROCESSID']))?$_GET['SOUTBOUNDPROCESSID']:$_POST['SOUTBOUNDPROCESSID']; 
$campanaInconcert 		  = (isset($_GET['SCAMPAIGNID']))?$_GET['SCAMPAIGNID']:$_POST['SCAMPAIGNID'];
$batchidInconcert	  	  = (isset($_GET['SBATCHID']))?$_GET['SBATCHID']:$_POST['SBATCHID']; 
/*Termina*/

$horaInicioLlamada 	     = getTimeZone('FH');
if(isset($cliente) && isset($userName) && isset($answerNumber)){
																
	$htmlInputHiddenResive="";
	$htmlInputHiddenResive.="<input type='hidden' id='username' 				value='".$userName."'>";
	$htmlInputHiddenResive.="<input type='hidden' id='answernumber' 			value='".$answerNumber."'>";
	$htmlInputHiddenResive.="<input type='hidden' id='clienteid' 			    value='".$clienteId."'>";
	$htmlInputHiddenResive.="<input type='hidden' id='namecampaing' 			value='".$nameCampaign."'>";
	$htmlInputHiddenResive.="<input type='hidden' id='contactid' 			    value='".$contactId."'>";
	$htmlInputHiddenResive.="<input type='hidden' id='cliente' 				    value='".$cliente."'>";
	$htmlInputHiddenResive.="<input type='hidden' id='tokeninconcert' 	        value='".$tokenInconcert."'>";
	$htmlInputHiddenResive.="<input type='hidden' id='pkwhererinconcert' 	    value='".$pkwhererInconcert."'>";
	$htmlInputHiddenResive.="<input type='hidden' id='virtualinconcert' 	    value='".$virtualInconcert."'>";
	$htmlInputHiddenResive.="<input type='hidden' id='outboundprocessinconcert' value='".$outBoundProcessInconcert."'>";
	$htmlInputHiddenResive.="<input type='hidden' id='campanainconcert' 		value='".$campanaInconcert."'>";
	$htmlInputHiddenResive.="<input type='hidden' id='batchidinconcert' 		value='".$batchidInconcert."'>";
	$htmlInputHiddenResive.="<input type='hidden' id='hidden_horaInicioLlamada' value='".$horaInicioLlamada."'>";	
	$htmlInputHiddenResive.="<input type='hidden' id='V_SUCCESS_MESG' value='' >";
	$htmlInputHiddenResive.="<input type='hidden' id='V_SUCCESS_CODE' value='' >";
	$htmlInputHiddenResive.="<input type='hidden' id='V_ERROR_MESG'   value='' >";
	$htmlInputHiddenResive.="<input type='hidden' id='V_ERROR_CODE'   value='' >";
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Campa&ntilde;a Unica 2.0</title>
		<meta http-equiv="Expires" content="0" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="X-UA-Compatible" content="IE=8;IE=9;IE=10;IE=Edge;">
		<link href="css/img/key_coppel.ico" rel="shortcut icon" type="image/x-icon">
		<link href="css/theme/jquery.ui.all.css" rel="stylesheet"    type="text/css">
		<link rel="stylesheet" type="text/css" href="js/bli/JSCal2/css/jscal2.css" />
		<link rel="stylesheet" type="text/css" href="js/bli/JSCal2/css/border-radius.css" />
		<link rel="stylesheet" type="text/css" href="js/bli/JSCal2/css/steel/steel.css" />
		<link href="css/index.css" rel="stylesheet" type="text/css">
		<script type="text/javascript" src="js/bli/JSCal2/js/jscal2.js"></script>
      	<script type="text/javascript" src="js/bli/JSCal2/js/lang/es.js"></script>
		<script src="js/bli/jquery-1.10.2.js" type="text/javascript" charset="utf-8"></script>
		<script src="js/bli/jquery-ui.min.js" type="text/javascript" charset="utf-8"></script>
		<!--<script src="js/bli/inconcert.session_storage.js" type="text/javascript"></script>
		<script src="js/bli/sessvars.js" type="text/javascript"></script>
		<script src="js/bli/cookies.js" type="text/javascript"></script>
		<script src="js/bli/inConcertSDK.js" type="text/javascript"></script>
		<script src="js/bli/funciones_inconcert.js" type="text/javascript"></script>-->
		<script src="js/load.js" type="text/javascript" charset="utf-8"></script>
		<script src="js/eventos.js" type="text/javascript" charset="utf-8"></script>
	</head>
	<body>
		<header>
	        <div id="header">
	            <div class="headerbackground">
	                <img  src="css/img/logo_coppel.png" width="109" height="21" align="absmiddle"/>
	                <span id="span_sistema" class="header_text">Campa&ntilde;a Unica 2.0</span><small> Mexico</small>
	                <span style="position:absolute; right:50px; font-weight:bold;" >
	                    <span id="span_nom_rol" style="color:white;"></span>
	                    <span id="span_nom_usuario" style="color:white;"><label id="FechaHora"></label></span>
	                </span>
	            </div>
	        </div>
	    </header>
	    <section>
	    	<?php print $htmlInputHiddenResive;?>
		    <div id="contenedor">
	            <div id="contPrincipal">
	                <div id="contConfiguracion">
	                    <div id="tabs" style="width: 99%" align="center">
	                    <div id="lblEjecutivo" style="font-weight:bold; position:absolute;top:15px;left:15px;color:white;font-size:20px;">
                  			<label>Ejecutivo:</label>
                  		</div>
	                        <ul id="nomCampana" style="font-size: 25px;"></ul>
	                        <p></p>
	                        <fieldset id="ContenedorPreventiva">
                            <legend aling="center">INFORMACION CONFIDENCIAL DEL CLIENTE</legend>
                            <img id="imgGuardaLoad" src="css/img/loader_2.gif" >
                                <table style="width: 100%;">
                                <br>
	                               	<tr>
	                               		<td colspan="3" style="width: 40%;">
	                               			<fieldset>
			                                <legend>Marcando</legend>
			                                <br>
			                                	<span class="timer" id="timerMarcando"></span>
				                                <div id="divLlenaMarcando"></div> 
			                                </fieldset>
			                                <br>
		                               		<fieldset>
			                                <legend>Informaci&oacute;n Cliente</legend>
			                                <br>
			                                	<span class="timer" id="timerGeneral"></span>
			                                	<div id="divLlenaInformacionGeneral" style="height:500px;overflow:scroll;"></div>
			                                </fieldset>
		                                </td>
	                               		<td >
	                               			<fieldset>
			                                <legend>Captura Encuesta</legend>
			                                <br>
			                                	<span class="timer" id="timerEncuesta"></span>
				                             	<div id="divLlenaEncuesta"></div>
				                             	<table id="tblEncuesta" align="left" class="ui-widget" style="margin-bottom: 20px;">
				                             		<tr ><!--0-->
				                             			<td style="padding: 15px; background:#4D99D2;color: white;font-weight: bold;" class="marcoColumnas" align = "right">PREGUNTA:</td>
				                             			<td style="padding: 35px; width: 90%; white;font-weight: bold;" class="marcoColumnas"  align = "left">
				                             				<label id="txtPreguntaDes"></label>
				                             			</td>
														<span id="spanpreguntas"></span>
				                             		</tr>
				                             		<tr style="display:none"><!--1-->
				                             			<td style="padding: 15px; background:#4D99D2;color: white;font-weight: bold;" class="marcoColumnas" align = "right">RESPUESTA:</td>
				                             			<td style="padding: 15px; width: 90%; white;font-weight: bold;" class="marcoColumnas" align = "left">
					                             			<select id="cbRespuestas">
					                             				<option VALUE=0>Seleccione Respuesta</option>
					                             			</select>
				                             			</td>
				                             		</tr>
				                             		<tr style="display:none"><!--2-->
														<td style="padding: 15px; background:#4D99D2;color: white;font-weight: bold;" class="marcoColumnas" align = "right">POR QUE?</td>
				                             			<td style="padding: 15px; width: 90%; white;font-weight: bold;" class="marcoColumnas" align = "left">
															<input type="text" name="txtRespuestaPorQue" size="65" style="text-transform: uppercase;" onKeyUp="this.value=this.value.toUpperCase();">
														</td>							
													</tr>
													<tr style="display:none"><!--3-->
														<td style="padding: 15px; background:#4D99D2;color: white;font-weight: bold;" class="marcoColumnas" align = "right">FECHA:</td>
				                             			<td style="padding: 15px; width: 90%; white;font-weight: bold;" class="marcoColumnas" align = "left">
															<input  type="text" id="dateArrival" name="dateArrival" value="AAAA-MM-DD" size ="15" maxlength="10"><img id="img_calender" src="css/img/Icono_calendario.png" style="position: absolute; cursor: pointer;">
							                                <script>
							                                    Calendar.setup
							                                    ({ 
							                                        trigger    : "img_calender", 
							                                        inputField : "dateArrival", 
							                                        min: 19000101, 
							                                        max: 20300101,
							                                        onSelect   : function() { this.hide(); $("#dateArrival").focus(); }
							                                    }); 
							                                </script> 
														</td>
													</tr>
													<tr style="display:none"><!--4-->
														<td style="padding: 15px; background:#4D99D2;color: white;font-weight: bold;" class="marcoColumnas" align = "right">RESPUESTA:</td>
				                             			<td style="padding: 15px; width: 90%; white;font-weight: bold;" class="marcoColumnas" align = "left">
															<input type="text" name="txtRespL" id="txtRespL" size="65" style="text-transform: uppercase;" onKeyUp="this.value=this.value.toUpperCase();" >
														</td>
													</tr>
													<tr style="display:none"><!--5-->
														<td style="padding: 15px; background:#4D99D2;color: white;font-weight: bold;" class="marcoColumnas" align = "right">RESPUESTA:</td>
				                             			<td style="padding: 15px; width: 90%; white;font-weight: bold;" class="marcoColumnas" align = "left">
															<input type="text" name="txtRespLN" id="txtRespLN" size="65" style="text-transform: uppercase;" onKeyUp="this.value=this.value.toUpperCase();" >
														</td>
													</tr>
													<tr style="display:none"><!--6-->
														<td style="padding: 15px; background:#4D99D2;color: white;font-weight: bold;" class="marcoColumnas" align = "right">RESPUESTA:</td>
				                             			<td style="padding: 15px; width: 90%; white;font-weight: bold;" class="marcoColumnas" align = "left">
															<input type="text" name="txtRespN" id="txtRespN" size="65" >
														</td>
													</tr>
													<tr style="display:none"><!--7-->
														<td style="padding: 15px; background:#4D99D2;color: white;font-weight: bold;" class="marcoColumnas" align = "right">OTRO:</td>
				                             			<td style="padding: 15px; width: 90%; white;font-weight: bold;" class="marcoColumnas" align = "left">
															<input type="text" name="txtEspL" id="txtEspL" size="65"  style="text-transform: uppercase;" onKeyUp="this.value=this.value.toUpperCase();" onKeyPress="validanumeros();">
														</td>
													</tr>
													<tr style="display:none"><!--8-->
														<td style="padding: 15px; background:#4D99D2;color: white;font-weight: bold;" class="marcoColumnas" align = "right">OTRO:</td>
				                             			<td style="padding: 15px; width: 90%; white;font-weight: bold;" class="marcoColumnas" align = "left">
															<input type="text" name="txtEspLN" id="txtEspLN" size="65" style="text-transform: uppercase;" onKeyUp="this.value=this.value.toUpperCase();" onKeyPress="validanumeros();">
														</td>
													</tr>
													<tr style="display:none"><!--9-->
														<td style="padding: 15px; background:#4D99D2;color: white;font-weight: bold;" class="marcoColumnas" align = "right">OTRO:</td>
				                             			<td style="padding: 15px; width: 90%; white;font-weight: bold;" class="marcoColumnas" align = "left">
															<input type="text" name="txtEspN" id="txtEspN" size="65" onKeyPress="validanumeros();">
														</td>
													</tr>									
				                             		<tr ><!--10-->
				                             			<td style="padding: 15px; background:#4D99D2;color: white;font-weight: bold;" class="marcoColumnas" align = "right">ACCI&Oacute;N:</td>
				                             			<td style="padding: 15px; width: 90%;" class="marcoColumnas" align = "center">
				                             				<button id="btnAnterior" >Anterior</button>
				                             				<button id="btnSiguiente" >Siguiente</button>
				                             			</td>
				                             		</tr>
				                             		<tr style="display:none"><!--11-->
														<td style="padding: 15px; background:#4D99D2;color: white;font-weight: bold;" class="marcoColumnas" align = "right">ACCI&Oacute;N:</td>
				                             			<td style="padding: 15px; width: 90%;" class="marcoColumnas" align = "center">
															<button id="btnFinGestion">Fin llamada</button>
														</td>
													</tr>
				                             	</table>
			                                </fieldset>
			                                <br>
			                                <fieldset>
			                                <legend>Datos Adicionales</legend>
			                                <br>
			                                	<table style="margin-bottom: 20px;">
			                                		<tr>
			                                			<td>
			                                				<div id="divLlenaTelefonosAdic"></div>
			                                				<input type="button" id="btnAgregaTel" value="Tel&eacute;fonos Adicionales"/>
			                                			</td>
			                                			<td rowspan="2" style="width: 100%;">
			                                				<fieldset >
			                                				<legend>Observaciones</legend>
			                                				<br>
			                                				<textarea id="txtObservaciones" style="width: 99%;height:50px;resize:none;text-transform: uppercase;" maxlength="100" size="110" onKeyUp="this.value=this.value.toUpperCase();"></textarea>
			                                				</fieldset>
			                                			</td>
			                                		</tr>
			                                		<tr>
			                                			<td>
			                                				<div id="divLlenaCorreoAdic"></div>
			                                				<input type="button" id="btnCorreo" value="Correo Electr&oacute;nico"/>
			                                			</td>
			                                		</tr>
			                                	</table>
			                                </fieldset>
			                                <br>
			                                <fieldset>
			                                <legend>Historial Observaciones</legend>
			                                <br>
			                                	<span class="timer" id="timerHistObsv"></span>
				                             	<div id="divLlenaHistObservaciones"></div> 
			                                </fieldset>
	                               		</td>
	                               	</tr>
                                </table>  
                            </fieldset>
	                    </div>
	                </div>
	            </div>
            </div>
	    </section>
	    <footer>
        	<div id="footer" ><?php print date('Y')?> - Coppel - Control Cr&eacute;dito - CAT <span id="lbl_rights">Todos los Derechos Reservados</span> &copy;</div>
      	</footer>
	</body>
</html>