<?php
include('common.php');
if(isset($_POST['id'])) {
	$sid = $_POST['id'];
	if(isset($_POST['cont']) && !empty($_POST['cont'])) {
		$cont = $_POST['cont'];
		$sql = "INSERT INTO action (sid,cont) VALUES ('$sid','$cont')";
		$result = mysql_query($sql);
		echo $result;
	} else {
		$sql = "SELECT * FROM action WHERE sid='$sid' ORDER BY id DESC limit 10";
		$result = mysql_query($sql);
		while($row = mysql_fetch_array($result))
		{
			$arr[]  = array(
				'id' => $row['id'],
				'sid' => $row['sid'],
				'cont' => $row['cont'],
				'time' => $row['time']
			); 
		}

		$json_string = json_encode($arr); 
		echo $json_string;
	}
}

mysql_close($con);
?>