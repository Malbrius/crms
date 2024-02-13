<?php
set_time_limit(0);
date_default_timezone_set('America/Mazatlan');

/**
 * El tiempo de desarrollo no me dio más oportunidad de hacer esto de manera adecuada así que aquí cambio las preguntas de la base
 * de datos por preguntas con caracteres correctos y los símbolos que no puedo escribir en la base de datos, como el "¿", o el "á".
 */
function corrigeALaCarrera($pregunta) {
    // echo json_encode($pregunta);
    // exit;
    if ($pregunta["id_pregunta"] == "a") {
        $pregunta["pregunta"] = "¿Contestó Cliente?";
    } else if ($pregunta["id_pregunta"] == "b") {
        $pregunta["pregunta"] = "¿Deseas agregar algún comentario adicional?";
    } else if ($pregunta["id_pregunta"] == "c") {
        $pregunta["pregunta"] = "¿Aceptó realizar encuesta?";
    } else if ($pregunta["id_pregunta"] == "d") {
        $pregunta["pregunta"] = "¿Cuál es el motivo por el que no se le brindó el servicio?";
    } else if ($pregunta["id_pregunta"] == "e") {
        $pregunta["pregunta"] = "¿Cuáles son las principales razones por las que otorgas esta calificación?";
    } else if ($pregunta["id_pregunta"] == "f") {
        $pregunta["pregunta"] = "¿Deseas agregar algún comentario adicional?";
    } else if ($pregunta["id_pregunta"] == "g") {
        $pregunta["pregunta"] = "¿Por qué no contestó?";
    } else if ($pregunta["id_pregunta"] == "h") {
        $pregunta["pregunta"] = "¿Cuáles son las principales razones por las que otorgas esta calificación?";
    } else if ($pregunta["id_pregunta"] == "1") {
        $pregunta["pregunta"] = "Para iniciar con la encuesta, ¿Te brindaron el servicio de [MENCIONAR SERVICIO] que solicitaste el día [FECHA]?";
    } else if ($pregunta["id_pregunta"] == "2") {
        $pregunta["pregunta"] = "En una escala de 0 al 10, donde 10 es totalmente satisfecho y 0 es nada satisfecho, ¿Qué tan satisfecho estás con la experiencia general del servicio de [MENCIONAR SERVICIO] utilizado en la última semana del Club de Proteccion Familiar Coppel?";
    } else if ($pregunta["id_pregunta"] == "3") {
        $pregunta["pregunta"] = "Continuando con la escala de 0 al 10, donde 10 es totalmente satisfecho y 0 es nada satisfecho, ¿Qué tan satisfecho estás con el tiempo que esperaste para que te brindaran el servicio de [MENCIONAR SERVICIO]?";
    } else if ($pregunta["id_pregunta"] == "4") {
        $pregunta["pregunta"] = "En una escala de 0 al 10, donde 10 es muy probable y 0 es nada probable, ¿Cuál es la probabilidad de que continúes pagando Club de Proteccion Familiar Coppel?";
    } else if ($pregunta["id_pregunta"] == "5") {
        $pregunta["pregunta"] = "En una escala de 0 al 10, donde 10 es muy probable y 0 es nada probable, ¿Qué tan probable es que recomiendes el Club de Proteccion Familiar Coppel a un familiar o amigo?";
    }
    return $pregunta;
}

class clienteDAO {
    // function getConnection36() {
    //     $server = '10.49.123.31';
    //     $user = 'syscredito';
    //     $pass = '53cbbb95d9fd2ae183cb36b6642ebd70';
    //     $bd = 'pruebasjl';
    //     $connec = pg_connect("host=" . $server . " dbname=" . $bd . " user=" . $user . " password=" . $pass . " ") or die("Error de conexion servidor ( " . $server . " ) Base de datos ( " . $bd . " )");
    //     return $connec;
    // }

    function getConnection36() {
        $server = '10.50.8.36';
        $user = 'syscredito';
        $pass = '4e37b030c9239ad04447ed9000a6a4de';
        $bd = 'ces';
        $connec = @pg_connect("host=$server dbname=$bd user=$user password=$pass");
        if (!$connec) {
            throw new Exception("Error en la conexión con el servidor $server", 1);
        }
        return $connec;
    }

    public function buscarCliente($cliente) {
        $bd = $this->getConnection36();

        $consulta = "SELECT  
        numerocliente
       ,fechadeservicio
       ,nombres as nombre_cliente 
       ,apellidopaterno
       ,apellidomaterno
       ,servicio as servicio_cliente 
       ,estado as estado_cliente 
       ,ciudad as ciudad_cliente 
       ,telparticular as telefono_particular
       ,telcelular as telefono_celular
       ,correoelectronico
       ,tipodeplan
       ,numserviciosutilizados
       ,tipodesolucion
       ,provedor
       ,fechaadquisiciondelclub
       ,importeofrecido
       ,tiempoduracionllamada
       ,id_plataforma as idPlataforma
       ,Current_Date - fechadeservicio as diasexperiencia
        FROM directorio_clubproteccionfamiliar
        WHERE numerocliente = " . $cliente->getCliente() . " AND (telcelular = '" . $cliente->getTelcelular() . "' OR telparticular = '" . $cliente->getTelcelular() . "')";
        
    //     $numeroDeCliente = $cliente->getCliente() ?? 0;
    //     $numeroDeTeléfonoDelCliente = $cliente->getTelcelular() ?? 0;

    //     $consulta = "SELECT  
    //     numerocliente
    //    ,COALESCE(fechadeservicio, '19700101')::Text fechadeservicio
    //    ,COALESCE(nombres, '')::Text nombre_cliente 
    //    ,COALESCE(apellidopaterno, '')::Text apellidopaterno
    //    ,COALESCE(apellidomaterno, '')::Text apellidomaterno
    //    ,COALESCE(servicio, '')::Text servicio_cliente 
    //    ,COALESCE(estado, '')::Text estado_cliente 
    //    ,COALESCE(ciudad, '')::Text ciudad_cliente 
    //    ,COALESCE(telparticular, '')::Text telefono_particular
    //    ,COALESCE(telcelular, '')::Text telefono_celular
    //    ,COALESCE(correoelectronico, '')::Text correoelectronico
    //    ,COALESCE(tipodeplan, '')::Text tipodeplan
    //    ,COALESCE(numserviciosutilizados, -1)::Text numserviciosutilizados
    //    ,COALESCE(tipodesolucion, '')::Text tipodesolucion
    //    ,COALESCE(provedor, '')::Text provedor
    //    ,COALESCE(fechaadquisiciondelclub, '19700101')::Text fechaadquisiciondelclub
    //    ,COALESCE(importeofrecido, -1)::Text importeofrecido
    //    ,COALESCE(tiempoduracionllamada, '00:00:00')::Text tiempoduracionllamada
    //    ,COALESCE(id_plataforma, -1)::Text idPlataforma
    //    ,Current_Date - COALESCE(fechadeservicio, Current_Date) diasexperiencia
    //     FROM directorio_clubproteccionfamiliar
    //     WHERE 0=0
    //     And numerocliente = $numeroDeCliente
    //     AND (telcelular = '$numeroDeTeléfonoDelCliente' OR telparticular = '$numeroDeTeléfonoDelCliente')";

        $res = @pg_query($bd, $consulta);

        if (!$res) {
            return false;
        }

        return @pg_fetch_array($res, null, PGSQL_ASSOC);
    }

    public function cargarEncuesta() {
        $bd = $this->getConnection36();

        $preguntas  = array();
        $respuestas = array();
        $preguntasYRespuestas = array();
        $catálogo = array();


        // $sQuery = "SELECT * FROM catalogo_preguntas_club_de_proteccion_familiar";

        $resDescripciones = @pg_query($bd, "SELECT * FROM catalogo_preguntas_club_de_proteccion_familiar");

        if (!$resDescripciones) {
            throw new Exception("Las preguntas.", 1);
        }

        while ($temp = @pg_fetch_array($resDescripciones, null, PGSQL_ASSOC)) {
            $temp = corrigeALaCarrera($temp);
            $preguntas[] = $temp;
        }

        $resDescripciones = @pg_query($bd, "SELECT * FROM catalogo_respuestas_club_de_proteccion_familiar");

        if (!$resDescripciones) {
            throw new Exception("Las respuestas.", 1);
        }

        while ($temp = @pg_fetch_array($resDescripciones, null, PGSQL_ASSOC)) {
            $respuestas[] = $temp;
        }

        // $sQuery = "SELECT * FROM catalogo_relacion_de_respuestas_club_de_proteccion_familiar";

        $resDescripciones = @pg_query($bd, "SELECT * FROM catalogo_relacion_de_respuestas_club_de_proteccion_familiar");

        if (!$resDescripciones) {
            throw new Exception("Las relaciones de preguntas-respuestas.", 1);
        }

        while ($temp = @pg_fetch_array($resDescripciones, null, PGSQL_ASSOC)) {
            $preguntasYRespuestas[] = $temp;
        }

        $resDescripciones = @pg_query($bd, "SELECT * FROM cat_fingestion_club_fam");

        if (!$resDescripciones) {
            throw new Exception("El catálogo de fines de gestión.", 1);
        }

        while ($temp = @pg_fetch_array($resDescripciones, null, PGSQL_ASSOC)) {
            $catálogo[] = $temp;
        }


        $salidaJSON = array(
            "preguntas" => $preguntas,
            "respuestas" => $respuestas,
            "preguntasYRespuestas" => $preguntasYRespuestas,
            "catálogo" => $catálogo
        );

        return $salidaJSON;
    }

    public function guardarMovimiento($cliente) {
        $bd = $this->getConnection36();
        $respuestas = $cliente->getVCadenaGuardar();

        //$totalArrayEndCallData = stripslashes($cliente->getVCadenaGuardar());
        $endCallData = json_decode($respuestas, true);

        $estado  = 0;
        $mensaje = "No se ejecutó proceso de guardar los datos de esta llamada";

        //Obtenemos la fecha y hora que finalizó la llamada
        $finalizoLlamada = date("Y-m-d H:i:s");
        $fechaLlamada = date("Y-m-d");
        $horaLlamada = date("H:i:s");

        //Funcion que se encuentra en el servidor 10.50.8.36 BD CES, la cual se ejecuta para guardar la información
        if ($bd) {
            $vCadenaGuardar = "SELECT fun_guarda_resultados_club_proteccion_fam('";
            /*1*/
            $vCadenaGuardar .= "" . $endCallData['v_num_cliente'] . "|";
            /*2*/
            $vCadenaGuardar .= "" . $endCallData['v_tipo_movimiento'] . "|";
            /*3*/
            $vCadenaGuardar .= "" . $fechaLlamada . "|";
            /*4*/
            $vCadenaGuardar .= "" . $horaLlamada . "|";
            /*5*/
            $vCadenaGuardar .= "" . $endCallData['v_id_llamada'] . "|";
            /*6*/
            $vCadenaGuardar .= "" . $endCallData['v_telefono_contacto'] . "|";
            /*7*/
            $vCadenaGuardar .= "" . $endCallData['v_id_fingestion'] . "|";
            /*8*/
            $vCadenaGuardar .= "" . $endCallData['v_descripcion'] . "|";
            /*9*/
            $vCadenaGuardar .= "" . $endCallData['v_observaciones'] . "|";
            /*10*/
            $vCadenaGuardar .= "" . $endCallData['v_empleado_registro'] . "|";
            /*11*/
            $vCadenaGuardar .= "" . $endCallData['v_fecha_servicio'] . "|";
            /*12*/
            $vCadenaGuardar .= "" . $endCallData['v_nombres'] . "|";
            /*13*/
            $vCadenaGuardar .= "" . $endCallData['v_apellido_paterno'] . "|";
            /*14*/
            $vCadenaGuardar .= "" . $endCallData['v_apellido_materno'] . "|";
            /*15*/
            $vCadenaGuardar .= "" . $endCallData['v_servicio'] . "|";
            /*16*/
            $vCadenaGuardar .= "" . $endCallData['v_estado'] . "|";
            /*17*/
            $vCadenaGuardar .= "" . $endCallData['v_ciudad'] . "|";
            /*18*/
            $vCadenaGuardar .= "" . $endCallData['v_correo'] . "|";
            /*19*/
            $vCadenaGuardar .= "" . $endCallData['v_tipo_plan'] . "|";
            /*20*/
            $vCadenaGuardar .= "" . $endCallData['v_num_serv_utilizados'] . "|";
            /*21*/
            $vCadenaGuardar .= "" . $endCallData['v_tipo_solucion'] . "|";
            /*22*/
            $vCadenaGuardar .= "" . $endCallData['v_proveedor'] . "|";
            /*23*/
            $vCadenaGuardar .= "" . $endCallData['v_fecha_obtuvo_club'] . "|";
            /*24*/
            $vCadenaGuardar .= "" . $endCallData['v_importe_ofrecido'] . "|";
            /*25*/
            $vCadenaGuardar .= "" . $endCallData['v_duracion_llamada'] . "|";
            /*26*/
            $vCadenaGuardar .= "" . $endCallData['v_id_plataforma'] . "|";
            /*27*/
            $vCadenaGuardar .= "" . $endCallData['v_hora_inicio'] . "|";
            /*28*/
            $vCadenaGuardar .= "" . $finalizoLlamada . "|";
            /*29*/
            $vCadenaGuardar .= "" . $endCallData['v_contesto_cliente'] . "|";
            /*30*/
            $vCadenaGuardar .= "" . $endCallData['v_acepto_recibir_info'] . "|";
            /*31*/
            $vCadenaGuardar .= "" . $endCallData['v_experiencia_servicio'] . "|";
            /*32*/
            $vCadenaGuardar .= "" . $endCallData['v_razones_calificacion'] . "|";
            /*33*/
            $vCadenaGuardar .= "" . $endCallData['v_facil_contacto'] . "|";
            /*34*/
            $vCadenaGuardar .= "" . $endCallData['v_razon_dificil_contacto'] . "|";
            /*35*/
            $vCadenaGuardar .= "" . $endCallData['v_minutos_espera'] . "|";
            /*36*/
            $vCadenaGuardar .= "" . $endCallData['v_amabilidad_ejecutivo'] . "|";
            /*37*/
            $vCadenaGuardar .= "" . $endCallData['v_info_servicio'] . "|";
            /*38*/
            $vCadenaGuardar .= "" . $endCallData['v_tiempo_cumplido'] . "|";
            /*39*/
            $vCadenaGuardar .= "" . $endCallData['v_tiempo_espera'] . "|";
            /*40*/
            $vCadenaGuardar .= "" . $endCallData['v_cal_tiempo_espera'] . "|";
            /*41*/
            $vCadenaGuardar .= "" . $endCallData['v_amabilidad_persona'] . "|";
            /*42*/
            $vCadenaGuardar .= "" . $endCallData['v_servicio_brindado'] . "|";
            /*43*/
            $vCadenaGuardar .= "" . $endCallData['v_espera_abogado'] . "|";
            /*44*/
            $vCadenaGuardar .= "" . $endCallData['v_cal_espera_abogado'] . "|";
            /*45*/
            $vCadenaGuardar .= "" . $endCallData['v_amabilidad_abogado'] . "|";
            /*46*/
            $vCadenaGuardar .= "" . $endCallData['v_asesoria_abogado'] . "|";
            /*47*/
            $vCadenaGuardar .= "" . $endCallData['v_tiempo_solucion'] . "|";
            /*48*/
            $vCadenaGuardar .= "" . $endCallData['v_tiempo_esp_asesor'] . "|";
            /*49*/
            $vCadenaGuardar .= "" . $endCallData['v_cal_tiempo_esp_asesor'] . "|";
            /*50*/
            $vCadenaGuardar .= "" . $endCallData['v_amabilidad_asesor'] . "|";
            /*51*/
            $vCadenaGuardar .= "" . $endCallData['v_cal_asesoria'] . "|";
            /*52*/
            $vCadenaGuardar .= "" . $endCallData['v_costo_adicional'] . "|";
            /*53*/
            $vCadenaGuardar .= "" . $endCallData['v_comunicacion_const'] . "|";
            /*54*/
            $vCadenaGuardar .= "" . $endCallData['v_atencion_seguimiento'] . "|";
            /*55*/
            $vCadenaGuardar .= "" . $endCallData['v_amabilidad_personal'] . "|";
            /*56*/
            $vCadenaGuardar .= "" . $endCallData['v_lugar_servicio_f'] . "|";
            /*57*/
            $vCadenaGuardar .= "" . $endCallData['v_cal_inst_f'] . "|";
            /*58*/
            $vCadenaGuardar .= "" . $endCallData['v_espera_servicio'] . "|";
            /*59*/
            $vCadenaGuardar .= "" . $endCallData['v_cal_servicio_f'] . "|";
            /*60*/
            $vCadenaGuardar .= "" . $endCallData['v_pagar_club_protec'] . "|";
            /*61*/
            $vCadenaGuardar .= "" . $endCallData['v_recomen_club_protec'] . "|";
            /*62*/
            $vCadenaGuardar .= "" . $endCallData['v_comentario_adicional'] . "|";
            /*63*/
            $vCadenaGuardar .= "" . $endCallData['v_porque_no_contesto'] . "|";
            /*64*/
            $vCadenaGuardar .= "" . $endCallData['v_fin_efectivo'] . "|";
            /*65*/
            $vCadenaGuardar .= "" . $endCallData['v_fin_abandono'] . "|";
            /*66*/
            $vCadenaGuardar .= "" . $endCallData['v_dias_experiencia'] . "|";
            /*67*/
            $vCadenaGuardar .= "" . $endCallData['v_observaciones_2'] . "|";
            /*68*/
            $vCadenaGuardar .= "" . $endCallData['v_razones_calificacion_2'] . "|";
            $vCadenaGuardar .= "')";

            $res = pg_query($bd, $vCadenaGuardar);
            pg_close($bd);

            if ($res) {
                $estado  = 1;
                $mensaje = "La informacion se guardo correctamente: " . $vCadenaGuardar;
            } else {
                $estado  = -2;
                $mensaje = pg_last_error($bd) . $vCadenaGuardar;
            }
        } else {
            $estado  = -3;
            $mensaje = "No hay conexion favor de llamar a torre de control";
        }
        $salidaJSON = array(
            'estado' => $estado,
            'mensaje' => $mensaje
        );
        return $salidaJSON;
    }

    //No se usa pero se deja por si acaso
    public static function obtenerIP() {
        return $_SERVER['REMOTE_ADDR'];
    }
}
