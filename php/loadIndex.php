<?php
include('config.php');
function CargaInf_General(){
	$conexion = conectaBD_13_campunicaweb();

	$clienteId     = $_POST['clienteid'];
	$nombreCampana = $_POST['nombrecampana'];
	$telefonoMarcando = $_POST['telefonomarcando'];
	$htmlTablaGeneral = "";
	$estado  = 0;
	$mensaje = "";
	
	$sQuery = "SELECT attname FROM pg_attribute WHERE attrelid = (SELECT oid FROM pg_class WHERE lower(relname) = lower('".$nombreCampana."')) and attstattarget < 0 order by attnum;";
	$resDescripciones = pg_query($conexion,$sQuery);
	
	$sQuery = "SELECT * FROM $nombreCampana WHERE id = '$clienteId' limit 1";
	$resDatos = @pg_Exec($conexion, $sQuery);


	// $unaVariable = pg_fetch_array($resDatos,null,PGSQL_ASSOC);
	// var_dump($unaVariable);
	// 	exit($unaVariable);
	// print_r($unaVariable);
	// exit();
	if($resDatos){
		$htmlTablaGeneral  ='<table align="center" class="ui-widget">';
			$htmlTablaGeneral .='<thead>';
	            $htmlTablaGeneral .='<tr align="center">';
					$htmlTablaGeneral .='<th class="ui-state-default ui-th-column ui-th-ltr">DESCRIPCIÓN</th>';
					$htmlTablaGeneral .='<th class="ui-state-default ui-th-column ui-th-ltr">DATOS DEL CLIENTE</th>';					
				$htmlTablaGeneral .='</tr>';
			$htmlTablaGeneral .='</thead>';
			$htmlTablaGeneral .='<tbody>';
			// print_r($resDatos);
		
		if(pg_num_rows($resDatos) > 0){
			$lDatos = pg_fetch_row($resDatos,0);
			$columnas = 0;
			$cadenaDatosGenerales = "";
			while($Array=pg_fetch_array($resDescripciones)){
					$htmlTablaGeneral .='<tr>';
						$htmlTablaGeneral .='<td style="background:#4D99D2;color: white;font-weight: bold;" class="marcoColumnas" align = "right">';
						$htmlTablaGeneral .=''.strtoupper($Array[0]).' :';
						$htmlTablaGeneral .='</td>';
						
						if(rtrim($lDatos[$columnas])=="" or $lDatos[$columnas]==null){
							$htmlTablaGeneral .='<td style="background:#E0E0E0;" class="marcoColumnas" align = "left">';
						}else{
							$htmlTablaGeneral .='<td style="font-weight:bold;" class="marcoColumnas" align = "left">';
							$htmlTablaGeneral .=''.htmlentities($lDatos[$columnas],ENT_QUOTES).'';
						}
						$htmlTablaGeneral .='</td>';
					$htmlTablaGeneral .='</tr>';
					if($cadenaDatosGenerales  == "")
					{	
						 if(stristr($Array[0], 'tel') == false)
						 {
							if(stristr($Array[0], 'cel') == false)
							{
								$cadenaDatosGenerales .=$Array[0].':'.utf8_encode($lDatos[$columnas]);
							}
						 }
					}
					else
					{
						if(stristr($Array[0], 'tel') == false)
						 {
							if(stristr($Array[0], 'cel') == false)
							{
								$cadenaDatosGenerales .='|'.$Array[0].':'.utf8_encode($lDatos[$columnas]);
							}
						 }
					}
					
					$columnas++;
				}
				//print_r($cadenaDatosGenerales);
				$datosGeneralesHidden ='<input type="hidden" id="hidden_datosGenerales" value="'.$cadenaDatosGenerales.'">';
		}else{
			$htmlTablaGeneral .='<tr>';
				$htmlTablaGeneral .='<td class="marcoColumnas" align = "center">SIN DATOS</td>';
			$htmlTablaGeneral .='</tr>';
		}
			$htmlTablaGeneral .='</tbody>';
		$htmlTablaGeneral .='</table>';
		$response = ContruyeTelefono($telefonoMarcando);
		if($response['estado'] == 1){
			$estado  = 1;
			$mensaje = "OK";
			$htmlTablaMarcando = $response['ConstruyeTelefonoMarcandoHtml'];
		}else{
			$estado  = $response['estado'];
			$mensaje = $response['mensaje'];
			$htmlTablaMarcando = $response['ConstruyeTelefonoMarcandoHtml'];
		}
	}else{
		$htmlTablaGeneral = "Ocurrio error al ejecutar Query";
		$estado  = -100;
		$mensaje = pg_last_error($conexion)."<br><br>".$sQuery;
	}
    $salidaJSON = array('estado' => $estado,
		                'htmlTablaGeneral' => $htmlTablaGeneral.$datosGeneralesHidden,
						//'htmlTablaGeneral' => $htmlTablaGeneral,
		                'htmlTablaMarcando'=> $htmlTablaMarcando,
		                'mensaje' => $mensaje);
	print json_encode($salidaJSON);
}
function ContruyeTelefono($telefonoresive){
	$ConstruyeTelefonoMarcandoHtml = "";
	/*Contruye telefono por incocnert*/
	/*$search  = array('[', ']');
	$telefonopartido = explode('-',str_replace( $search , '', $telefonoresive));
	
	$telefonoresive = $telefonopartido[1].$telefonopartido[2];*/
	/*Termina*/
	if(strlen($telefonoresive) == 11){
		$TelefonoContruido = substr($telefonoresive,1,11);
	}else{
		$TelefonoContruido = $telefonoresive;
	}
    $ConstruyeTelefonoMarcandoHtml ='<table style="font-size:1em;" class="ui-widget">';

    $response = funcionValidaCofetel($TelefonoContruido);
    if($response['estado']==1){

    	$estado  = $response['estado'];
		$mensaje = $response['mensaje'];

    	if($response['tipored']=='F'){
    		$descripcionTel = 'CASA';
    	}else{
    		$descripcionTel = 'CELULAR';
    	}
    	$ConstruyeTelefonoMarcandoHtml .='<tr align="left"><td>TIPO TEL:</td><td style="font-weight:bold;">'.$descripcionTel.'</td></tr>';
		$ConstruyeTelefonoMarcandoHtml .='<tr align="left"><td>TELEFONO:</td><td style="font-weight:bold; color:red;">'.$TelefonoContruido.'</td></tr>';
		$ConstruyeTelefonoMarcandoHtml .='<input type="hidden" id="hidden_telefonoContruido" value="'.$TelefonoContruido.'">';
		$ConstruyeTelefonoMarcandoHtml .='<input type="hidden" id="hidden_tipoTel" value="'.$response['tipotel'].'">';
    	$ConstruyeTelefonoMarcandoHtml .='<input type="hidden" id="hidden_descTel" value="'.$descripcionTel.'">';
    	$ConstruyeTelefonoMarcandoHtml .='<input type="hidden" id="hidden_tipoRed" value="'.$response['tipored'].'">';
		
    }else{
    	$ConstruyeTelefonoMarcandoHtml .='<tr align="left"><td>TIPO TEL:</td><td style="font-weight:bold;">DESCONOCIDO</td></tr>';
		$ConstruyeTelefonoMarcandoHtml .='<tr align="left"><td>TELEFONO:</td><td style="font-weight:bold; color:red;">'.$TelefonoContruido.'</td></tr>';
		$ConstruyeTelefonoMarcandoHtml .='<input type="hidden" id="hidden_telefonoContruido" value="'.$TelefonoContruido.'">';
		$ConstruyeTelefonoMarcandoHtml .='<input type="hidden" id="hidden_tipoTel" value="'.$response['tipotel'].'">';
    	$ConstruyeTelefonoMarcandoHtml .='<input type="hidden" id="hidden_descTel" value="DESCONOCIDO">';
    	$ConstruyeTelefonoMarcandoHtml .='<input type="hidden" id="hidden_tipoRed" value="'.$response['tipored'].'">';
		$estado   = $response['estado'];
		$mensaje  = $response['mensaje'];
    }
    $ConstruyeTelefonoMarcandoHtml .='</table>';
	$response = array('estado'  => $estado,
					  'mensaje' => $mensaje,
					  'ConstruyeTelefonoMarcandoHtml' => $ConstruyeTelefonoMarcandoHtml);
	return $response;
}
function funcionValidaCofetel($telefono){
	// $conexion = conectaBD_13_promocioncoppel();
	// $response = array();
	// $funcionConsulta = "fncorrigetelefono_nva";

	// $estado  = 0;
	// $mensaje = "error: funcion ".$funcionConsulta." : ".$telefono;
	// $tipored ='0';
	// $tipotel = 0;

	// $sQuery = "Select ".$funcionConsulta."(".$telefono.")";
	// $res = pg_fetch_row(pg_Exec($conexion,$sQuery),0);
	// pg_close($conexion);
	$res = array ("Resultado" => '11111111111');

	if($res){
		if (strlen($res[0])==11){
			$estado  = 1;
			$mensaje = "OK";
			switch (substr($res[0],0,1)){   
				case '1':
					$tipored ='F';
					$tipotel =1;
				break;   
				case '2':
					$tipored ='M';
					$tipotel =2;
				break;
			}
		}
		else{
			$estado  = 1;
			$mensaje = "OK";
			$tipored ='M';
			$tipotel =2;
		}
	}else{
		$estado  = -100;
		// $mensaje = pg_last_error($conexion)."<br><br>".$sQuery;
	}
	$response = array('estado'=>$estado,
					  'mensaje'=>$mensaje,
					  'telefono'=>$telefono,
					  'tipored'=>$tipored,
					  'tipotel'=>$tipotel);
	return $response;
}




function CargaInf_ObsHistorial(){
	$conexion = conectaBD_13_campunicaweb();
	$usernameGlobal = $_POST['usernameglobal'];
	$clienteId     = $_POST['clienteid'];
	$nombreCampana = $_POST['nombrecampana'];
	$htmlTablaObsHistory = "";
	$estado  = 0;
	$mensaje = "";
	$sQuery  ="SELECT ";
	$sQuery .="numempleado, ";
	$sQuery .="telefono, ";
	$sQuery .="observacion ";
	$sQuery .="FROM campanaunica_observaciones ";
	$sQuery .="WHERE lower(campanainconcert) = lower('".$nombreCampana."') AND relacioncliente = ".$clienteId."; ";

	$rs = pg_query($conexion,$sQuery);
	pg_close($conexion);
	if($rs){
		$htmlTablaObsHistory  ='<table style="margin-bottom: 20px;" align="center" class="ui-widget">';
		$htmlTablaObsHistory .='<thead>';
            $htmlTablaObsHistory .='<tr align="center">';
				$htmlTablaObsHistory .='<th class="ui-state-default ui-th-column ui-th-ltr">AGENTE</th>';
				$htmlTablaObsHistory .='<th class="ui-state-default ui-th-column ui-th-ltr">TELEFONO</th>';
				$htmlTablaObsHistory .='<th style="width: 80%;" class="ui-state-default ui-th-column ui-th-ltr">OBSERVACIÓNES</th>';
			$htmlTablaObsHistory .='</tr>';
		$htmlTablaObsHistory .='</thead>';
		$htmlTablaObsHistory .='<tbody>';
			while($Array=pg_fetch_array($rs)){
				$htmlTablaObsHistory .='<tr style="font-weight:bold;">';
				for($i=0;$i<3;$i++){
					if($Array[$i]!=""){
						$style="";
						if($i==2){
							$style="padding: 10px 10px 10px 10px;";
						}
						$htmlTablaObsHistory .='<td style="'.$style.'" class="marcoColumnas" align = "left">';
						$htmlTablaObsHistory .=''.utf8_encode($Array[$i]).'';
					}else{
						$htmlTablaObsHistory .='<td style="background:#E0E0E0;" class="marcoColumnas">';
					}
					$htmlTablaObsHistory .='</td>';
				}
				$htmlTablaObsHistory .='</tr>';
			}
		$htmlTablaObsHistory .='</tbody>';
			$htmlTablaObsHistory .='</table>';
	    $estado  = 1;
		$mensaje = "OK";	
	}else{
		$estado  = -100;
		$mensaje = pg_last_error($conexion)."<br><br>".$sQuery;
	}
    $salidaJSON = array('estado' => $estado,
		                'htmlTablaObsHistory' => $htmlTablaObsHistory, 
		                'mensaje' => $mensaje);
	print json_encode($salidaJSON);
}
function CargaInf_Encuesta(){
	$conexion = conectaBD_13_campunicaweb();
	$nombreCampana = $_POST['nombrecampana'];
	$ArrayPregunta = array();
	$Pregunta = array();
	$ArrayRespuestas = array();
	$Respuestas = array();
	$respuestasPreguntasdefaul;
	$ArraySecuencia = array();
	$secuencia = array();
	$ArrayDesicion = array();
	$desicion = array();
	$ArrayFinGestion = array();
	$fingestion = array();
	$estado  = 1;
	$mensaje = "";

	$sQuery ="select idpregunta,descripcion,tipocampo from campanaunica_preguntas where lower(campanainconcert) = lower('".$nombreCampana."') order by idpregunta";
	$resPreguntas= pg_Exec($conexion,$sQuery);
	$cantidadrespuestas = pg_num_rows($resPreguntas);
	$preguntasCadena = "";
	while($lPreguntas=pg_fetch_array($resPreguntas)){
		if($respuestasPreguntasdefaul == ""){
			$respuestasPreguntasdefaul = "0";
		}else{
			$respuestasPreguntasdefaul = $respuestasPreguntasdefaul."|0";
		}
		
		if($preguntasCadena =="")
		{
			$preguntasCadena = $lPreguntas['descripcion'];
		}
		else
		{
			$preguntasCadena .= "|".$lPreguntas['descripcion'];
		}
		
		$Pregunta['idpregunta'] = $lPreguntas['idpregunta'];
		$Pregunta['descripcion'] = $lPreguntas['descripcion'];
		$Pregunta['tipocampo'] = $lPreguntas['tipocampo'];
		//$Pregunta['cadenapreguntas'] = $preguntasCadena;
		$ArrayPregunta[] = array_map('utf8_encode', $Pregunta);
	}
	
	//print_r($preguntasCadena);
	$sQuery = "select idpregunta,idrespuesta,descripcion,tipodescripcion from campanaunica_respuestas where lower(campanainconcert) = lower('".$nombreCampana."') order by idpregunta";
	$resRespuestas = pg_Exec($conexion, $sQuery);
	while($lRespuestas=pg_fetch_array($resRespuestas)){
			
		$Respuestas['idpregunta'] = $lRespuestas['idpregunta'];
		$Respuestas['idrespuesta'] = $lRespuestas['idrespuesta'];
		$Respuestas['descripcion'] = $lRespuestas['descripcion'];
		$Respuestas['tipodescripcion'] = $lRespuestas['tipodescripcion'];
		$Respuestas['cadenapreguntas'] = $preguntasCadena;
		$ArrayRespuestas[] = array_map('utf8_encode', $Respuestas);
	}
	$sQuery = "select idsecuencia,idpregunta,idvalorpregunta,idsiguientepregunta from campanaunica_secuencia where lower(campanainconcert) = lower('".$nombreCampana."')";
	$resSecuencia = pg_Exec($conexion, $sQuery);
	while($lSecuencia=pg_fetch_array($resSecuencia)){			
		$secuencia['idsecuencia'] = $lSecuencia['idsecuencia'];
		$secuencia['idpregunta'] = $lSecuencia['idpregunta'];
		$secuencia['idvalorpregunta'] = $lSecuencia['idvalorpregunta'];
		$secuencia['idsiguientepregunta'] = $lSecuencia['idsiguientepregunta'];
		$ArraySecuencia[] = array_map('utf8_encode', $secuencia);
	}
	$sQuery = "select idfingestion,idpregunta,idrespuesta from campanaunica_decision where lower(campanainconcert) = lower('".$nombreCampana."')";
	$resDecision = pg_Exec($conexion, $sQuery);
	while($lDesicion=pg_fetch_array($resDecision)){			
		$desicion['idfingestion'] = $lDesicion['idfingestion'];
		$desicion['idpregunta'] = $lDesicion['idpregunta'];
		$desicion['idrespuesta'] = $lDesicion['idrespuesta'];
		$ArrayDesicion[] = array_map('utf8_encode', $desicion);
	}
	$sQuery = "select idfingestion,descripcion from campanaunica_fingestion where lower(campanainconcert) = lower('".$nombreCampana."')";
	$resFinGestion = pg_Exec($conexion, $sQuery);
	while($lFinGestion=pg_fetch_array($resFinGestion)){			
		$fingestion['idfingestion'] = $lFinGestion['idfingestion'];
		$fingestion['descripcion'] = $lFinGestion['descripcion'];
		$ArrayFinGestion[] = array_map('utf8_encode', $fingestion);
	}
    $salidaJSON = array('estado' => $estado,
		                'mensaje' => $mensaje,
		                'ArrayPreguntasdefaul' => $respuestasPreguntasdefaul,
		                'ArrayPregunta'   => $ArrayPregunta,
		                'ArrayRespuestas' => $ArrayRespuestas,
		                'ArraySecuencia'  => $ArraySecuencia,
		                'ArrayDesicion'   => $ArrayDesicion,
		                'ArrayFinGestion' => $ArrayFinGestion);
	print json_encode($salidaJSON);
}
$opcion = $_POST['opc'];
switch ($opcion){
	case 'CargaInf_General':
		CargaInf_General();
		break;
	case 'CargaInf_ObsHistorial':
		CargaInf_ObsHistorial();
		break;
	case 'CargaInf_Encuesta':
		CargaInf_Encuesta();
		break;
	default:
		break;
}
?>
