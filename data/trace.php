<?php
include('common.php');

$hash = $_POST['hash'];

$hash = explode('s', $hash);

preg_match("/#m(\d+)/", $hash[0], $result);

$mid = $result[1];
$sql = "SELECT * FROM main WHERE id=$mid";
$result = mysql_query($sql);
while($row = mysql_fetch_array($result))
{
	$arr[]  = array(
		'sid' => 0,
		'aid' => 0,
		'mid' => $row['id'],
		'cont' => $row['cont']
	); 
}

for ($i = 1; $i < count($hash); $i++) { 
	$rule  = "/(\d+)_(\d+)/";  
	preg_match($rule, $hash[$i], $result);
	$sid[] = $result[1];
}
$sid = implode(",", $sid);

for ($i = 1; $i < count($hash); $i++) { 
	$rule  = "/(\d+)_(\d+)/";  
	preg_match($rule, $hash[$i], $result);
	$aid[] = $result[2];
}
$aid = implode(",", $aid);

$sql = "SELECT s.id AS sid, s.mid AS mid, a.id AS aid, s.cont AS scont, a.cont AS acont FROM scene AS s, action AS a WHERE s.id in ($sid) and a.id in ($aid) and s.id = a.sid";
$result = mysql_query($sql);
while($row = mysql_fetch_array($result))
{
	$arr[] = array(
		'sid' => $row['sid'],
		'mid' => $row['mid'],
		'aid' => $row['aid'], 
		'cont' => $row['scont']."(".$row['acont'].")"
	);
}


$json_string = json_encode($arr);
echo $json_string;

mysql_close($con);
?>