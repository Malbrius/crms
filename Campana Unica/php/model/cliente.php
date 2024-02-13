<?php

include "../services/clienteDAO.php";


class cliente {
    private $apellido_materno;
    private $apellido_paterno;
    private $ciudad;
    private $cliente;
    private $correo;
    private $duracion_llamada;
    private $estado;
    private $fecha_adquisicion;
    private $fecha_servicio;
    private $id_plataforma;
    private $importe_ofrecido;
    private $nombres;
    private $num_servicios_uti;
    private $proveedor;
    private $servicio;
    private $telcelular;
    private $telparticular;
    private $tipo_plan;
    private $tipo_solucion;
    private $vCadenaGuardar;

    public function buscarCliente() {
        $clienteDAO = new clienteDAO();

        return $clienteDAO->buscarCliente($this);
    }

    public function cargarEncuesta() {
        $clienteDAO = new clienteDAO;

        return $clienteDAO->cargarEncuesta();
    }

    public function guardarMovimiento() {
        $clienteDAO = new clienteDAO();

        return $clienteDAO->guardarMovimiento($this);
    }

    //***************************************************************

    /**
     * Get the value of apellido_materno
     */
    public function getApellidoMaterno() {
        return $this->apellido_materno;
    }

    /**
     * Set the value of apellido_materno
     */
    public function setApellidoMaterno($apellido_materno): self {
        $this->apellido_materno = $apellido_materno;

        return $this;
    }

    /**
     * Get the value of apellido_paterno
     */
    public function getApellidoPaterno() {
        return $this->apellido_paterno;
    }

    /**
     * Set the value of apellido_paterno
     */
    public function setApellidoPaterno($apellido_paterno): self {
        $this->apellido_paterno = $apellido_paterno;

        return $this;
    }

    /**
     * Get the value of ciudad
     */
    public function getCiudad() {
        return $this->ciudad;
    }

    /**
     * Set the value of ciudad
     */
    public function setCiudad($ciudad): self {
        $this->ciudad = $ciudad;

        return $this;
    }

    /**
     * Get the value of cliente
     */
    public function getCliente() {
        return $this->cliente;
    }

    /**
     * Set the value of cliente
     */
    public function setCliente($cliente): self {
        $this->cliente = $cliente;

        return $this;
    }

    /**
     * Get the value of correo
     */
    public function getCorreo() {
        return $this->correo;
    }

    /**
     * Set the value of correo
     */
    public function setCorreo($correo): self {
        $this->correo = $correo;

        return $this;
    }

    /**
     * Get the value of duracion_llamada
     */
    public function getDuracionLlamada() {
        return $this->duracion_llamada;
    }

    /**
     * Set the value of duracion_llamada
     */
    public function setDuracionLlamada($duracion_llamada): self {
        $this->duracion_llamada = $duracion_llamada;

        return $this;
    }

    /**
     * Get the value of estado
     */
    public function getEstado() {
        return $this->estado;
    }

    /**
     * Set the value of estado
     */
    public function setEstado($estado): self {
        $this->estado = $estado;

        return $this;
    }

    /**
     * Get the value of fecha_adquisicion
     */
    public function getFechaAdquisicion() {
        return $this->fecha_adquisicion;
    }

    /**
     * Set the value of fecha_adquisicion
     */
    public function setFechaAdquisicion($fecha_adquisicion): self {
        $this->fecha_adquisicion = $fecha_adquisicion;

        return $this;
    }

    /**
     * Get the value of fecha_servicio
     */
    public function getFechaServicio() {
        return $this->fecha_servicio;
    }

    /**
     * Set the value of fecha_servicio
     */
    public function setFechaServicio($fecha_servicio): self {
        $this->fecha_servicio = $fecha_servicio;

        return $this;
    }

    /**
     * Get the value of id_plataforma
     */
    public function getIdPlataforma() {
        return $this->id_plataforma;
    }

    /**
     * Set the value of id_plataforma
     */
    public function setIdPlataforma($id_plataforma): self {
        $this->id_plataforma = $id_plataforma;

        return $this;
    }

    /**
     * Get the value of importe_ofrecido
     */
    public function getImporteOfrecido() {
        return $this->importe_ofrecido;
    }

    /**
     * Set the value of importe_ofrecido
     */
    public function setImporteOfrecido($importe_ofrecido): self {
        $this->importe_ofrecido = $importe_ofrecido;

        return $this;
    }

    /**
     * Get the value of nombres
     */
    public function getNombres() {
        return $this->nombres;
    }

    /**
     * Set the value of nombres
     */
    public function setNombres($nombres): self {
        $this->nombres = $nombres;

        return $this;
    }

    /**
     * Get the value of num_servicios_uti
     */
    public function getNumServiciosUti() {
        return $this->num_servicios_uti;
    }

    /**
     * Set the value of num_servicios_uti
     */
    public function setNumServiciosUti($num_servicios_uti): self {
        $this->num_servicios_uti = $num_servicios_uti;

        return $this;
    }

    /**
     * Get the value of proveedor
     */
    public function getProveedor() {
        return $this->proveedor;
    }

    /**
     * Set the value of proveedor
     */
    public function setProveedor($proveedor): self {
        $this->proveedor = $proveedor;

        return $this;
    }

    /**
     * Get the value of servicio
     */
    public function getServicio() {
        return $this->servicio;
    }

    /**
     * Set the value of servicio
     */
    public function setServicio($servicio): self {
        $this->servicio = $servicio;

        return $this;
    }

    /**
     * Get the value of telcelular
     */
    public function getTelcelular() {
        return $this->telcelular;
    }

    /**
     * Set the value of telcelular
     */
    public function setTelcelular($telcelular): self {
        $this->telcelular = $telcelular;

        return $this;
    }

    /**
     * Get the value of telparticular
     */
    public function getTelparticular() {
        return $this->telparticular;
    }

    /**
     * Set the value of telparticular
     */
    public function setTelparticular($telparticular): self {
        $this->telparticular = $telparticular;

        return $this;
    }

    /**
     * Get the value of tipo_plan
     */
    public function getTipoPlan() {
        return $this->tipo_plan;
    }

    /**
     * Set the value of tipo_plan
     */
    public function setTipoPlan($tipo_plan): self {
        $this->tipo_plan = $tipo_plan;

        return $this;
    }

    /**
     * Get the value of tipo_solucion
     */
    public function getTipoSolucion() {
        return $this->tipo_solucion;
    }

    /**
     * Set the value of tipo_solucion
     */
    public function setTipoSolucion($tipo_solucion): self {
        $this->tipo_solucion = $tipo_solucion;

        return $this;
    }

    /**
     * Get the value of vCadenaGuardar
     */
    public function getVCadenaGuardar() {
        return $this->vCadenaGuardar;
    }

    /**
     * Set the value of vCadenaGuardar
     */
    public function setVCadenaGuardar($vCadenaGuardar): self {
        $this->vCadenaGuardar = $vCadenaGuardar;

        return $this;
    }
}
