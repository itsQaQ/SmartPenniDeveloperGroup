<?php

//this file is used to read company finacial data;

require_once('/home/khutso/Documents/Projects/Investsure/PHPExcel-1.8/Classes/PHPExcel.php');

                $tmpfname='/home/khutso/Documents/Projects/Investsure/Company data/Company finacials/Aspen.xlsx';
		//home/khutso/Documents/Projects/Investsure/Company data/Company finacials/AngloGold Ashanti.xlsx
		$excelReader = PHPExcel_IOFactory::createReaderForFile($tmpfname);
		$excelObj = $excelReader->load($tmpfname);
		$worksheet = $excelObj->getSheet(0);
		$lastRow = $worksheet->getHighestRow();
		$lastColumn = $worksheet->getHighestColumn();
                $numberofcolumns=PHPExcel_Cell::columnIndexFromString($lastColumn);
		$arrayl=$worksheet->toArray(null,true,true,false);

		echo "<table>";
		for ($row = 1; $row <= $lastRow; $row++) {
		 echo "<tr>";
                for($column=1; $column <= $numberofcolumns; $column++){
			 echo "<td>";
			 echo $arrayl[$row][$column];
			 echo "</td>";
		}
		echo "</tr>";
               } 
		echo "</table>";

?>

/*
//home/khutso/Documents/Projects/Investsure/PHPExcel-1.8/Classe
//$xlsx= new XLSXReader('home/khutso/Desktop/Stock data/Khutso Stock data/Shoprite St.xlsx');
//$xlsx= new XLSXReader('Shoprite St.xlsx');
//$sheets= $xlsx->getSheetNames();
//echo $sheets;

//echo "</td><td>";
//echo $worksheet->getCell('B'.$row)->getValue();
//echo $lastColumn;
//echo $lastRow;
//echo PHPExcel_Cell::columnIndexFromString($column)." ";

   //for($row=0;$row<=$lastRow;$row++){
                 //for($column=0;$column<=$lastColumn;$column++){
                  // echo "<tr><td>";
                   //echo $arrayl[$row][$column];
                   //echo "<tr><td>";
                 //}
                 //echo  "<br><br>";    
                //}


*/
