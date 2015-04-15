<?php
include('common.php');
switch ($_POST['opt']) {
	case "add":
		$cont = strip_tags($_POST['cont']);
		if(!$_COOKIE['uid']) {
			// $name = $_POST['uid'];
			$name = "u".time();
			$sql = "INSERT INTO user (name) VALUES ('$name')";
			$result = mysql_query($sql);
			$uid = mysql_insert_id();
			setcookie('uid', $uid);
		}
		$uid = $_COOKIE['uid'];
		$sql = "INSERT INTO main (cont,uid) VALUES ('$cont','$uid')";
		$result = mysql_query($sql);
		echo $result;
		break;
	case "get":
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
		break;
}
mysql_close($con);
?>