<?php	
function getTimeZone($Formato){
date_default_timezone_set('America/Mazatlan');
	switch ($Formato){   
		case 'F': 
			$today = date("Y-m-d");
			return $today;
		break;   
		case 'H':
			$today = date("H:i:s");
			return $today;
		break;   
		case 'FH': 
			$today = date("Y-m-d H:i:s");
			return $today;    
		break;
	}
}
?>