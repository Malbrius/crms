<?php
include('config.php');
include('fechaHora.php');
function guardaMovCampanaUnica()
{
	$search = strpos($_POST['totalArrayEndCallData'], '\"');
	if ($search) {
		$totalArrayEndCallData = stripslashes($_POST['totalArrayEndCallData']);
		$totalArrayTelAdic     = stripslashes($_POST['totalArrayTelAdic']);
		$totalArrayCorreAdic   = stripslashes($_POST['totalArrayCorreAdic']);
	} else {
		$totalArrayEndCallData = $_POST['totalArrayEndCallData'];
		$totalArrayTelAdic     = $_POST['totalArrayTelAdic'];
		$totalArrayCorreAdic   = $_POST['totalArrayCorreAdic'];
	}
	$phonesAdd  = json_decode($totalArrayTelAdic, true);
	$emailAdd 	= json_decode($totalArrayCorreAdic, true);

	$response = InsertaMovimientoCampanaUnica($totalArrayEndCallData);

	if ($response['estado'] = '1') {

		if (!empty($phonesAdd)) {

			if (!empty($phonesAdd['vTelAdic_1'])) {

				$endCallData = json_decode($totalArrayEndCallData, true);
				$endCallData['vCveMovimiento']    = 'L';
				$endCallData['vTipoMovimiento']	  = '2';
				$endCallData['vTelefonoNuevo']    = $phonesAdd['vTelAdic_1'];
				$endCallData['vTipoTelAdicional'] = $phonesAdd['vTipoTel_1'];
				$endCallData['vTipoRed']     	  = $phonesAdd['vTelAdicTipoRed_1'];
				$endCallData['vIdFinGestion']     = '0';
				$endCallData['vDescripcion']      = '0';
				$endCallData['vObservaciones']    = '0';
				$endCallData['vPkWhere']          = '0';
				$endCallData['vRespuestas']       = '0';

				$response = InsertaMovimientoCampanaUnica(json_encode($endCallData));
			}
			if (!empty($phonesAdd['vTelAdic_2'])) {

				$endCallData = json_decode($totalArrayEndCallData, true);
				$endCallData['vCveMovimiento']    = 'L';
				$endCallData['vTipoMovimiento']	  = '2';
				$endCallData['vTelefonoNuevo']    = $phonesAdd['vTelAdic_2'];
				$endCallData['vTipoTelAdicional'] = $phonesAdd['vTipoTel_2'];
				$endCallData['vTipoRed'] 		  = $phonesAdd['vTelAdicTipoRed_2'];
				$endCallData['vIdFinGestion']     = '0';
				$endCallData['vDescripcion']      = '0';
				$endCallData['vObservaciones']    = '0';
				$endCallData['vPkWhere']          = '0';
				$endCallData['vRespuestas']       = '0';

				$response = InsertaMovimientoCampanaUnica(json_encode($endCallData));
			}
		}
		if (!empty($emailAdd)) {

			$endCallData = json_decode($totalArrayEndCallData, true);
			$endCallData['vCveMovimiento']    = 'M';
			$endCallData['vTipoMovimiento']	  = '1';
			$endCallData['vTelefonoNuevo']    = '0';
			$endCallData['vTipoTelAdicional'] = '0';
			$endCallData['vTipoRed']     	  = '0';
			$endCallData['vIdFinGestion']     = '0';
			$endCallData['vDescripcion']      = '0';
			$endCallData['vObservaciones']    = $emailAdd['vEmailAdic'];
			$endCallData['vPkWhere']          = '0';
			$endCallData['vRespuestas']       = '0';

			$response = InsertaMovimientoCampanaUnica(json_encode($endCallData));
		}
	}
	$salidaJSON = array(
		'estado'  => $response['estado'],
		'mensaje' => $response['mensaje']
	);
	print json_encode($salidaJSON);
}
function InsertaMovimientoCampanaUnica($totalArrayEndCallData)
{

	$conexion = conectaBD_13_campunicaweb();
	$endCallData = json_decode($totalArrayEndCallData, true);
	$funcionInserta_1 = "fn_guarda_resultados_campanaunica_nva";
	$funcionInserta_2 = "fn_observacion_g_u_campanaunica_historica";

	$estado  = 0;
	$mensaje = "";

	if ($conexion) {

		$vCadenaGuardar = "select " . $funcionInserta_1 . "('";
		/*1*/
		$vCadenaGuardar .= "" . $endCallData['vCveMovimiento'] . "+";
		/*2*/
		$vCadenaGuardar .= "" . $endCallData['vTipoMovimiento'] . "+";
		/*3*/
		$vCadenaGuardar .= "" . $endCallData['vNomCampana'] . "+";
		/*4*/
		$vCadenaGuardar .= "" . $endCallData['vId'] . "+";
		/*5*/
		$vCadenaGuardar .= "" . $endCallData['vNumcliente'] . "+";
		/*6*/
		$vCadenaGuardar .= "" . $endCallData['vTelefonoContacto'] . "+";
		/*7*/
		$vCadenaGuardar .= "" . $endCallData['vTelefonoNuevo'] . "+";
		/*8*/
		$vCadenaGuardar .= "" . $endCallData['vTipoTelAdicional'] . "+";
		/*9*/
		$vCadenaGuardar .= "" . $endCallData['vTipoRed'] . "+";
		/*10*/
		$vCadenaGuardar .= "" . $endCallData['vTipoCarrier'] . "+";
		/*11*/
		$vCadenaGuardar .= "" . $endCallData['vContactoAdicional'] . "+";
		/*12*/
		$vCadenaGuardar .= "" . $endCallData['vIdFinGestion'] . "+";
		/*13*/
		$vCadenaGuardar .= "" . $endCallData['vDescripcion'] . "+";
		/*14*/
		$vCadenaGuardar .= "" . $endCallData['vObservaciones'] . "+";
		/*15*/
		$vCadenaGuardar .= "" . getTimeZone('F') . "+";
		/*16*/
		$vCadenaGuardar .= "" . getTimeZone('H') . "+";
		/*17*/
		$vCadenaGuardar .= "" . substr($endCallData['vHoraIniMovto'], 10) . "+";
		/*18*/
		$vCadenaGuardar .= "" . getTimeZone('H') . "+";
		/*19*/
		$vCadenaGuardar .= "" . substr($endCallData['vHoraIniLLam'], 10) . "+";
		/*20*/
		$vCadenaGuardar .= "" . getTimeZone('H') . "+";
		/*21*/
		$vCadenaGuardar .= "" . $endCallData['vEmpleadoregistro'] . "+";
		/*22*/
		$vCadenaGuardar .= "" . $endCallData['vPkWhere'] . "+";
		/*23*/
		$vCadenaGuardar .= "" . $endCallData['vRespuestas'] . "+";
		/*24*/
		$vCadenaGuardar .= "" . $endCallData['vCteDatosGenerales'] . "+";
		/*25*/
		$vCadenaGuardar .= "" . $endCallData['vPreguntas'] . "";
		$vCadenaGuardar .= "')";
		//print_r($vCadenaGuardar);
		if ($endCallData['vCveMovimiento'] == 'T') {

			$vCadenaGuardaObs = "select " . $funcionInserta_2 . "('";
			/*1*/
			$vCadenaGuardaObs .= "" . $endCallData['vNomCampana'] . "+";
			/*2*/
			$vCadenaGuardaObs .= "" . $endCallData['vId'] . "+";
			/*3*/
			$vCadenaGuardaObs .= "" . $endCallData['vEmpleadoregistro'] . "+";
			/*4*/
			$vCadenaGuardaObs .= "" . $endCallData['vTelefonoContacto'] . "+";
			/*5*/
			$vCadenaGuardaObs .= "" . $endCallData['vObservaciones'] . "";
			$vCadenaGuardaObs .= "')";
			$res = pg_query($conexion, utf8_decode($vCadenaGuardaObs));
		}
		$res = pg_query($conexion, utf8_decode($vCadenaGuardar));
		pg_close($conexion);
		if ($res) {
			$estado  = 1;
			$mensaje = "La información se guardo correctamente: " . $vCadenaGuardar;
		} else {
			$estado  = -2;
			$mensaje = pg_last_error($conexion) . "<br><br>" . $vCadenaGuardar;
		}
	} else {
		$estado  = -3;
		$mensaje = "No hay conexion favor de llamar a torre de control";
	}
	$response = array('estado' => $estado, 'mensaje' => $mensaje);
	return $response;
}
function fnValidaCofetelAdicionales()
{

	$conexion = conectaBD_13_promocioncoppel();
	$Telefono = trim($_POST['telefono']);
	$funcionConsulta = "fncorrigetelefono_nva";

	$estado  = 0;
	$mensaje = "error: funcion " . $funcionConsulta . " : " . $telefono;

	if ($conexion) {
		$sQuery = "Select " . $funcionConsulta . "(" . $Telefono . ")";
		$res = pg_fetch_row(pg_Exec($conexion, $sQuery), 0);
		pg_close($conexion);
		if ($res) {
			if (strlen($res[0]) == 11) {
				$estado  = 1;
				$mensaje = "OK";
				switch (substr($res[0], 0, 1)) {
					case '1':
						$tipoteladicional = 1;
						$tiporedadicional = 'F';
						break;
					case '2':
						$tipoteladicional = 2;
						$tiporedadicional = 'M';
						break;
				}
				$vTelefinoAdicional = $Telefono;
			} else {
				$estado  = 2;
				$mensaje = "telefono invalido en cofetel";
				$tipoteladicional = "NA";
				$tiporedadicional = "NA";
				$vTelefinoAdicional = $Telefono;
			}
		} else {
			$estado = -100;
			$mensaje = pg_last_error($conexion) . "<br><br>" . $sQuery;
			$tipoteladicional = "";
			$tiporedadicional = "";
			$vTelefinoAdicional = $Telefono;
		}
	} else {
		$estado = -400;
		$mensaje = "No hay conexion favor de llamar a torre de control";
		$tiporedadicional = "";
		$vTelefinoAdicional = $Telefono;
	}
	$salidaJSON = array(
		'estado' => $estado,
		'mensaje' => $mensaje,
		'tipoteladicional' => $tipoteladicional,
		'tiporedadicional' => $tiporedadicional,
		'vTelefinoAdicional' => $vTelefinoAdicional
	);
	print json_encode($salidaJSON);
}

function califLlamada()
{
	$vFinllamada = $_POST['vFinllamada'];
	$vIdgenesys = $_POST['vCalifLlamada'];
	//echo "datos calif";
	//echo $vFinllamada;
	//echo $vIdgenesys;
	//echo " fin datos calif";

	/*$string_de_conexión2 = "Driver={SQL Server};Server={10.44.155.242};Database={ICON_DB_GIR}";
	$con2 = odbc_connect($string_de_conexión2, "DBICON", "0319b3af57883817dbd395dbed323674774f50ee9f6481cda22650b149edea18", SQL_CUR_USE_ODBC) or False;

	$consulta2 = "Exec sp_set_califLlamada_by_ExternalID @califnameExt='$vFinllamada', @externalID='$vIdgenesys'";
	$rs2 = odbc_exec($con2, $consulta2);*/

	$string_de_conexión = "Driver={SQL Server};Server={10.44.155.232};Database={speechminer_ver8_5_4}";
	$con = odbc_connect($string_de_conexión, "CalifLlamada_SetExternalID", "BH|mus^qv4]~^O{", SQL_CUR_USE_ODBC) or False;

	$consulta = "Exec sp_set_califLlamada_by_ExternalID @califnameExt='$vFinllamada', @externalID='$vIdgenesys'";
	$rs = odbc_exec($con, $consulta);

	//$rs2 = 1;

	$estado = 'OK';

	$salidaJSON = array(
		'estado' => $estado
	);

	print json_encode($salidaJSON);
}

$opcion = $_POST['opc'];
switch ($opcion) {
	case 'guardaMovCampanaUnica':
		guardaMovCampanaUnica();
		break;
	case 'fn_ValidaCofetel':
		fnValidaCofetelAdicionales();
		break;
	case 'califLlamada':
		califLlamada();
		break;
	default:
		break;
}
