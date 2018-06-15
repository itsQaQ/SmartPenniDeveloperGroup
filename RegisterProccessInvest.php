<?php

require_once('/var/www/html/PassInvest.php');

$conn= new mysqli($hostname,$username,$password,$databasename);

if($conn->connect_error){
die($conn->connect_error);
}


if(isset($_POST['Name']) && isset($_POST['Surname'])
&& isset($_POST['ID']) && isset($_POST['Username']) 
&& isset($_POST['Email']) && isset($_POST['Cell']) 
&& isset($_POST['Password']) && isset($_POST['VPassword'])){

if($_POST['Password']!==$_POST['VPassword']){
echo "Passwords do not match. Re-enter password.";
}

else{
$name=$_POST['Name'];
$surname=$_POST['Surname'];
$id=$_POST['ID'];
$username=$_POST['Username'];
$email=$_POST['Email'];
$cell=$_POST['Cell'];
$password=$_POST['Password'];
}

}

else{
echo "Input feilds are missing";
}

$query="insert into User(Name,Surname,Username,Password,ID,Email,Cell_number) values"."('$name','$surname','$username','$password',$id,'$email','$cell');";
$result=$conn->query($query);

if(!$result){
echo "did not perform insert";
}

else{
echo 'User successfully registered'.'<br>';
}

//Once the user is registered an Investment account will be automatically created for them

$query_one="insert into Account(Cell_number,Balance) values"."('$cell',0);";
$result_one=$conn->query($query_one);

if(!$result_one){
echo "did not create account";
}

else{
echo 'Account successfully created for '.$name;
}

/*else{

}*/

$conn->close();
?>

