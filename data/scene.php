<?php
include('common.php');
$mid = $_POST['mid'] | 0;
$aid = $_POST['aid'] | 0;
if(isset($_POST['cont']) && !empty($_POST['cont'])) {
	$cont = $_POST['cont'];
	$sql = "INSERT INTO scene (mid,aid,cont) VALUES ('$mid','$aid','$cont')";
	$result = mysql_query($sql);
	echo $result;
} else {
	$sql = "SELECT * FROM scene WHERE mid='$mid' and aid='$aid' ORDER BY id DESC limit 10";
	$result = mysql_query($sql);
	while($row = mysql_fetch_array($result))
	{
		$arr[]  = array(
			'id' => $row['id'],
			'mid' => $row['mid'],
			'aid' => $row['aid'], 
			'cont' => $row['cont'],
			'time' => $row['time']
		); 
	}

	$json_string = json_encode($arr); 
	echo $json_string;
}

mysql_close($con);
?>