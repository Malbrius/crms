<?php

include "../model/cliente.php";

$opcion = $_POST['opcion'] ?? "0";
$numCliente = $_POST['clienteId'] ?? 0;
$numTelefono = $_POST['telefonoContacto'] ?? 0;
$vCadenaGuardar = $_POST['totalArrayEndCallData'] ?? 0;

switch ($opcion) {
    case 'buscarCliente':
        clienteController::buscarCleinte($numCliente, $numTelefono);
        break;

    case 'cargarEncuesta':
        clienteController::cargarEncuesta();
        break;

    case 'guardaMovimientos':
        clienteController::guardaMovimientos($vCadenaGuardar);
        break;
}

class clienteController {
    public static function buscarCleinte($numCliente, $numTelefono) {
        $cliente = new cliente();

        $cliente->setCliente($numCliente);

        $cliente->setTelcelular($numTelefono);

        $resultadoDeLaBúsqueda = $cliente->buscarCliente();
        // var_dump($resultadoDeLaBúsqueda);
        // exit();
        // var_dump($resultadoDeLaBúsqueda);
        // exit();
        if (!$resultadoDeLaBúsqueda) {
            echo json_encode(array("error" => "1"));
            return;
        }
        // $ward = json_encode(array_map('utf8_encode', $resultadoDeLaBúsqueda));
        // exit($ward);
        echo json_encode(array_map("UTF8_Encode", $resultadoDeLaBúsqueda));
    }

    public static function cargarEncuesta() {
        $cliente = new cliente();

        echo json_encode($cliente->cargarEncuesta());
    }

    public static function guardaMovimientos($vCadenaGuardar) {
        $cliente = new cliente();

        $cliente->setVCadenaGuardar($vCadenaGuardar);

        echo json_encode($cliente->guardarMovimiento());
    }
}
