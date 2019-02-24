<?php

require_once('/var/www/html/PassInvest.php');

echo 'hello  <br>';

$conn= new mysqli($hostname,$username,$password,$databasename);

if($conn->connect_error){
echo "Could not establish server connection.";
die($conn->connect_error);
}


if(isset($_POST['Name']) && isset($_POST['Surname'])
&& isset($_POST['ID']) && isset($_POST['Username']) 
&& isset($_POST['Email']) && isset($_POST['Cell']) 
&& isset($_POST['Password']) && isset($_POST['VPassword'])
&& isset($_POST['House_num']) && isset($_POST['Street_name'])
&& isset($_POST['City']) && isset($_POST['Postal_code'])){

if($_POST['Password']!==$_POST['VPassword']){
echo "Passwords do not match. Re-enter password.";
die();
}

else{
$name=$_POST['Name'];
$surname=$_POST['Surname'];
$id=$_POST['ID'];
$username=$_POST['Username'];
$email=$_POST['Email'];
$cell=$_POST['Cell'];
$password=$_POST['Password'];
$house_num=$_POST['House_num'];
$street=$_POST['Street_name'];
$city=$_POST['City'];
$postal=$_POST['Postal_code'];
}

}

else{
echo "Input feilds are missing";
die();
}

$query="insert into User(Name,Surname,Username,Password,ID,Email,Cell_number) values"."('$name','$surname','$username','$password',$id,'$email','$cell');";
$result=$conn->query($query);

if(!$result){
echo "did not perform insert User <br>";
die($conn->mysql_error);
}

else{
echo 'User successfully registered'.'<br>';
}

$query_five="select User_id from User where ID"."='$id';";
$result_five=$conn->query($query_five);
$row_five=$result_five->fetch_array(MYSQLI_BOTH);
$userid=$row_five['User_id'];


?>
