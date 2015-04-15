<?php
include('common.php');
$mid = strip_tags($_POST['mid']) | 0;
$aid = strip_tags($_POST['aid']) | 0;
switch ($_POST['opt']) {
	case 'add':
		if(isset($_POST['cont']) && !empty($_POST['cont'])) {
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
			$first = $_POST['first'];
			$sql = "INSERT INTO scene (mid,cont,uid,first) VALUES ('$mid','$cont','$uid','$first')";
			$result = mysql_query($sql);
			$sid = mysql_insert_id();
			if($aid) {
				$sql = "INSERT INTO link (aid,sid) VALUES ('$aid','$sid')";
				$result = mysql_query($sql);
			}
			echo $result;
		}
		break;

	case 'add_link':
		// add exist scene to new action
		$aid = $_POST['aid'];
		$sid = $_POST['sid'];
		$first = $_POST['first'];
		if($first) {
			$sql = "UPDATE scene SET first='$first' WHERE id='$sid'";
			$result = mysql_query($sql);
		}
		$sql = "INSERT INTO link (aid,sid) VALUES ('$aid','$sid')";
		$result = mysql_query($sql);
		echo $result;
		break;

	case 'aid':
		//scene is got from action
		$sql = "SELECT scene.id AS id,scene.mid AS mid,link.aid AS aid,scene.cont AS cont,scene.time AS time FROM scene,link WHERE link.aid='$aid' and link.sid=scene.id ORDER BY scene.id DESC limit 10";
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
		break;

	case 'mid':
		// scene is got from main
		$sql = "SELECT * FROM scene WHERE mid='$mid' and first=1 ORDER BY id DESC limit 10";
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
		break;

	case 'exist':
		// scene is got from main
		$sql = "SELECT * FROM scene WHERE mid='$mid' ORDER BY id ASC";
		$result = mysql_query($sql);
		while($row = mysql_fetch_array($result))
		{
			$arr[]  = array(
				'id' => $row['id'],
				'mid' => $row['mid'],
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