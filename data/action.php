<?php
include('common.php');
if(isset($_POST['id'])) {
	$sid = strip_tags($_POST['id']);
	switch ($_POST['opt']) {
		case 'add':
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
			$sql = "INSERT INTO action (sid,cont,uid) VALUES ('$sid','$cont','$uid')";
			$result = mysql_query($sql);
			echo $result;			
			break;
		case 'sid':
			$sql = "SELECT * FROM action WHERE sid='$sid' ORDER BY id DESC limit 10";
			$result = mysql_query($sql);
			while($row = mysql_fetch_array($result))
			{
				$arr[]  = array(
					'id' => $row['id'],
					'sid' => $row['sid'],
					'rollback' => $row['rollback'],
					'cont' => $row['cont'],
					'time' => $row['time']
				); 
			}

			$json_string = json_encode($arr); 
			echo $json_string;
			break;
	}
}

mysql_close($con);
?>