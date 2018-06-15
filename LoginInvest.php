<?php
//require_once('/var/www/html/RegisterProccessInvest.php');
require_once('/var/www/html/PassInvest.php');

function StringSearch($strings){
$boo=false;

for($i=0;$i<strlen($strings);$i++){
if($strings[$i]=='@'){
$boo=true;
}
}
return $boo;
}

$conn= new mysqli($hostname,$username,$password,$databasename);

if($conn->connect_error){
die($conn->connect_error);
}

else{
//echo 'Connected';
}

if(isset($_POST['name']) && isset($_POST['password'])){

$name=$_POST['name'];
$password=$_POST['password'];

if(StringSearch($name)==true){
$query="select * from User where Email"."='$name';";
$result=$conn->query($query);
$row=$result->fetch_array(MYSQLI_BOTH);

//echo $row['Name'];

if($row['Password']==$password){
echo 'Welcome '.$row['Name'];
}

else{
echo 'Incorrect Password';
}
}

else{
$query="select * from User where Username"."='$name';";
$result=$conn->query($query);
$row=$result->fetch_array(MYSQLI_BOTH);

//$pass=$row['Password'];

//echo $row['Name'];

if($row['Password']==$password){
echo 'Welcome '.$row['Name'];
}
else{
echo 'Incorrect Password';
}

}

}

else{
echo 'Missing input feild';
}

//echo $query;

?>
