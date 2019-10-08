<?php
$uid="33";
$title="11";
$location="";
$discount="";
$description="";

include 'DBConfig.php';

$conn = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);

if ($conn->connect_error) {
 die("Connection failed: " . $conn->connect_error);
}

if(isset($_POST['userid'])){
	$uid=$_POST['userid'];
	$title=$_POST['title'];
	$location=$_POST['location'];
	$discount=$_POST['discount'];
	$description=$_POST['description'];
	
}
    $file_tmp=$_FILES["image"]["tmp_name"];
	
     $check = getimagesize($file_tmp);
    

$img_path='images/';

$filename=$uid.".jpg";
$msg="faild";
  if($check !== false){
 //$filename ='099.jpg';
      
        if(move_uploaded_file($file_tmp, $img_path.$filename)){
			
			$url='http://192.168.2.17:80/theriac/images/'.$filename;
			
			$sql4 = "UPDATE `seller` SET `pharmacy_name`='$title',`location`='$location',`discounts`='$discount',`description`='$description',`backgroundImage`='$url' WHERE sell_uid='$uid' ";
			
				if(mysqli_query($conn,$sql4)){
					json_encode('success');
				 }
				 else{
					json_encode('error');
				 }
            
		
			
        }else{
          
            $filename="default.jpg";
        }
      

}

echo json_encode($msg);

?>