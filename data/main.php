<?php
include('common.php');

if(isset($_POST['cont']) && !empty($_POST['cont'])) {
	$cont = $_POST['cont'];
	$sql = "INSERT INTO main (cont) VALUES ('$cont')";
	$result = mysql_query($sql);
	echo $result;
} else {
	$sql="SELECT * FROM main ORDER BY id DESC limit 10";
	$result = mysql_query($sql);
	while($row = mysql_fetch_array($result))
	{
		$arr[]  = array(
			'id' => $row['id'],
			'cont' => $row['cont'],
			'time' => $row['time']
		); 
	}
	$json_string = json_encode($arr); 
	echo $json_string;
}

mysql_close($con);
?>