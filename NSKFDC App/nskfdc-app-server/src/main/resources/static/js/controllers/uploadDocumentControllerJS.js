var uploadDocument = angular.module('app');

uploadDocument.controller("uploadDocumentController" , function($scope, $http){
	console.log("working");
	  $scope.submitForm = function () {
		  console.log("inside submit form"+$scope.batchID);
	    /*alert("Send a request to the server: "+$scope.batchID);*/
	    $http.get('/searchDocument?batchId='+$scope.batchID)
	    .then(function (response) {
	    	 $scope.details.data= response.data;
	    	console.log("working after grid");
	    	//downloadZipFileService
	    });
	    
	    
	  };

	  

	  $scope.details = {
		        enableGridMenus: false,
		        enableSorting: false,
		        enableFiltering: false,
		        enableCellEdit: false,
		        enableColumnMenus: false,
		        enableHorizontalScrollbar: 0,
		        enableVerticalScrollbar: 0,
		        paginationPageSizes: [5, 10, 20, 30],
		        paginationPageSize: 10,
		        useExternalPagination: true,
//		        rowHeight:70,
//		        enableColumnResizing: true,
		        columnDefs: [
		            {
		            	name: 'batchId', 
		                displayName: 'Batch ID'
		            },
		            {
		            	name: 'dateUploaded',
		            	displayName: 'Uploaded On'
		            },
		            {
		                name: 'documentsUploaded',
		                displayName: 'Documents Uploaded'
		            },
		             {
		            	 name: 'zipFileLink', 
		            	 displayName: 'Download Zip File', 
//		            	 cellTemplate: '<a ng-href="file:///D:/sarthak/testZIp/test1.zip" target="_blank" download="test1.zip"><img src="images/rar_icon.png" alt="abc" class="pointer"></a>'
		            	 cellTemplate: '<img src="images/rar_icon.png" alt="abc" ng-click="grid.appScope.downloadZip()" class="pointer">'
				             
		            }
		        ]
//	  ,enableColumnResizing: true
		    };
	  	  
	  //zip download start
	  $scope.downloadZip = function(){
		  var url='/downloadZipFileService?batchId='+$scope.batchID;
		  console.log("This is downloading")
		  $http.get(url, { responseType : 'arraybuffer' })
		  .then(function(response){
			  console.log("done"+$scope.batchID + response.data);
			  var zipFile = new Blob([response.data], { type : 'application/zip' })
			  var downloadURL = URL.createObjectURL(zipFile);
			  var link = document.createElement('a');
			  //from here:: move the rest from up
			  link.href = downloadURL;
			  link.download = $scope.batchID + '.zip';
			  document.body.appendChild(link);
			  link.click();
		  });
	  };
	  //zip download end
    
//  			$scope.getBatchId = function()
//  			{
//  				$scope.ids=[];
//  				$http.get("/getBatchIdDet").then(function (response) {
//  			    	 
//  					let batchId = response.data;
//  					for(i in batchId)
//  						{
//  						   $scope.ids.push(response.data[i].batchId);
//  						}
//
//  			    });
//  			}
  			
  			$scope.ids=[];
				$http.get("/getBatchIdDet").then(function (response) {
			    	 
					let batchId = response.data;
					for(i in batchId)
						{
						   $scope.ids.push(response.data[i].batchId);
						}

		    });

	  
	  $scope.getTableHeight = function(){
			var rowHeight=30;
			var headerHeight =30;
			return{
				height:($scope.details.data.length* rowHeight + headerHeight) +"px"
			};
		  };
		  
		  var content = 'file content for example';
		  var blob = new Blob([ content ], { type : 'text/plain' });
		  $scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
		  
		  
		  $scope.submitForm1 = function (){
				 console.log("working3");
				
			
			console.log($scope.myVar2);
			console.log($scope.myVar3 );
			$http.get("/getScgjDetails?batchId="+$scope.myVar2+"&scgjBatchNumber="+$scope.myVar3)
			.then(function (response){
				console.log("working5");
				$scope.status= response.data;
				if($scope.status==1 || $scope.scgjId!=null){
					document.getElementById("error_msg1").innerHTML="";	
					document.getElementById("error_msg2").innerHTML="";	
					alert("upload successfull!!");
					
				}
				else{
					console.log("working10");
					 document.getElementById("error_msg1").innerHTML="Invalid BatchId";
					 document.getElementById("error_msg2").innerHTML="Invalid ScgjID";
					 
					
		               
				}
			
			});
			 };
			 $scope.enable = function() {
			        console.log("inside function " + $scope.value);
			        $scope.isDisabled = false;
			 };
			 
			 
			
				  


});


//	});
	