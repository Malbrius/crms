<?php	
function conectaBD_13_campunicaweb(){
    // $server = '10.40.44.13';
 $server = '10.44.2.128';
	$user = 'reportes';
	$pass = 'ff7b3106de28225ca601288654f6c57a';
	$bd = 'atencionacliente';
	$connec = pg_connect("host=".$server." dbname=".$bd." user=".$user." password=".$pass."") or die ("Error de conexion servidor 10.44.2.128 BD appwebcat");
	return $connec;
}
// function conectaBD_13_promocioncoppel(){
//     $server = '10.40.32.11';
// 	$user = 'reportes';
// 	$pass = 'repcredito';
// 	$bd = 'ctcpl';
// 	$connec = pg_connect("host=".$server." dbname=".$bd." user=".$user." password=".$pass." ") or die ("Error de conexion servidor ( ".$server." ) Base de datos ( ".$bd." )");
// 	return $connec;
// }
?>