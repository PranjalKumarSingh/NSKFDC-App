function checkforward() {
	
    var location = document.getElementById('Loca');
    var invalid = location.value == "none";
    if (invalid) {
        location.className = 'state';
    } else {
        location.className = 'state';
    }
   return !invalid;
}


function checkforstate() {
   var location = document.getElementById('State');
  var invalid = location.value == "State";
 if (invalid) {
      location.className = 'state';
  } else {
     location.className = 'state';
 }
   return !invalid;
}







var app = angular.module('app');
app.controller('importController', function($scope, $http, $rootScope, fileUpload, $timeout) {
	$scope.submitMsg=false;
	$scope.batch = {};
	$scope.masterSheet = {};
	$http.get('/getNameOfUser').then(function(response){
		$rootScope.nameOfuser=response.data.trainingPartnerName;
	});
	
	
	$http.get('/getFinancialYear')
    .then(function (response) {
    	let year = response.data;
    	let first = year%10000;
    	let second = year/10000;
    	
    	$scope.financialyear = Math.floor(second) + " - " + first;
    })
    /*.catch((response) => console.log("error in getting the value " + response + " " + response.status + " "  + response.data));*/
	
	$http.get('/getTotalTargets')
    .then(function (response) {
    	if(response.data == null)
    		{
    	$scope.totaltargets = 0;
    		}
    	else{
    		$scope.totaltargets = response.data;
    	}
    });

	$http.get('/getTargetAchieved')
    .then(function (response) {
    	if(response.data == null)
		{
	$scope.targetachieved = 0;
		}
	else{
		$scope.targetachieved = response.data;
	}

    });
	
	$http.get('/getRemainingTargets')
    .then(function (response) {
    	
    	if(response.data == null)
		{
	$scope.remainingtargets = 0;
		}
	else{
		$scope.remainingtargets = response.data;
	}

    });
	
	
var url = '/getBatchIdfortrainer';
    $scope.ids = [];
    $http.get(url)
	    .then(function(response) {
	        let dt = response.data;
	        for (i in dt) {
	            $scope.ids.push(response.data[i].batchId);
	        }
	    });

    $scope.batch.myVar = 'none';
    $scope.enable = function() {
        /*console.log("inside function " + $scope.batchDetails.value);*/
        $scope.isDisabled = false;
        $scope.isDisabled1 = false;
        $scope.isDisabled2 = false;
        $scope.isDisabled3 = false;
        $scope.isDisabled4 = false;
        $scope.isDisabled5 = false;
        $scope.isDisabled6 = false;
        $scope.isDisabled7 = false;
        $scope.isDisabled8 = false;
        $scope.isDisabled9 = false;
        $scope.isDisabled10 = false;
        $scope.isDisabled11 = false;
        $scope.isDisabled12 = false;
        $scope.isDisabled13 = false;
       
        /*----------------- To get the existing details of Batch Id--------------*/
        $http.get("/get-batch-details?batchId="+$scope.batchDetails.value)
        .then(function(response){        
        	$scope.batch = response;
        	$scope.batch.centreId= response.data.centreId;
        	$scope.batch.state= response.data.state;
        	$scope.batch.centreCity=response.data.centreCity;
        	$scope.batch.municipality=response.data.municipality;
        	$scope.batch.selectionCommitteeDate=response.data.selectionCommitteeDate;
        	$scope.batch.principalTrainerName=response.data.principalTrainerName;
        	$scope.batch.batchStartDate=response.data.batchStartDate;
        	$scope.batch.batchEndDate=response.data.batchEndDate;
        	$scope.batch.assessmentDate=response.data.assessmentDate;
        	$scope.batch.medicalExamDate=response.data.medicalExamDate;
        	$scope.batch.employerName=response.data.employerName;
        	$scope.batch.employerContactNumber=response.data.employerContactNumber;
        	$scope.batch.wardType = response.data.wardType;
        	$scope.batch.wardNumber = response.data.wardNumber;
        });
    };
    
    
    
    
    $scope.generateBatchId = function() {
    	$scope.rolling = true;
	    $scope.generating = "Please wait while we generate batch sheet for you.";
	    //To check if remaining targets is zero or negative	    
	    $http.get('/getRemainingTargets').then(
	    function(response)
	    {
	    	if(response.data <= 0 )
			{
	    		$scope.errorMsg = true;
	    		$scope.errorMessage="Please contact SCGJ for more targets";
	    		$scope.rolling = false;
	    		$timeout(function() {
    	        	$scope.rolling = false;
    	            $scope.success = false;
    	            $scope.successMessage = "";
    	            $scope.errorMessage="";
    	            $scope.errorMsg=false;
    	         }, 3000);
			}
		else
		{
			$http.get("/generateBatch")
            .then(function(response) {
            	var url='/downloadFinalMasterSheet';  	  
            	$http.get(url, { responseType : 'arraybuffer' }).then(function(response)
            	{	
            		
            			var excelFile = new Blob([response.data], { type : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            			var downloadURL = URL.createObjectURL(excelFile);
            			var link = document.createElement('a');
            			link.href = downloadURL;
            			link.download = "Batch Master Sheet.xlsx"
            			document.body.appendChild(link);
            			link.click();
            			
            	}); 
            	$scope.success = true;
            	$scope.successMessage = "Batch sheet generated successfully!";
                $scope.data = response.data;
                $scope.ids = [];
                $http.get('/getBatchIdfortrainer')
            	    .then(function(response) {
            	    	$scope.rolling = false;
            		    $scope.generating = "";
            	        let dt = response.data;
            	        for (i in dt) {
            	            $scope.ids.push(response.data[i].batchId);
            	        }
            	        
            	        $timeout(function() {
            	        	$scope.rolling = false;
            	            $scope.success = false;
            	            $scope.successMessage = "";
            	            $scope.errorMessage="";
            	            $scope.errorMsg=false;
            	         }, 3000);
            	    });
         }, function(errorResponse){
        	 $scope.$scope.errorMessage="";
        	 $timeout(function() {
 	        	$scope.rolling = false;
 	            $scope.success = false;
 	            $scope.successMessage = "";
 	           $scope.errorMessage="";
 	            $scope.errorMsg=false;
 	         }, 3000);
         });
		}	    	
	    });   
    };
    
    
    $scope.downloadMasterSheet = function(){
    	
    };
    
    
        
    $scope.setFile = function(element) {
        $scope.$apply(function($scope) {
            $scope.theFile = element.files[0];
            $scope.FileMessage = '';
            var filename = $scope.theFile.name;
            /*console.log(filename.length)*/
            var index = filename.lastIndexOf(".");
            var strsubstring = filename.substring(index, filename.length);
            if ( strsubstring == '.xlsx') {
                /*console.log('File Uploaded sucessfully');*/
            } else {
                $scope.theFile = '';
                $scope.FileMessage = 'please upload correct File ,File extension should be .xlsx';
            }
        });
    };
    
    
    
    

    /*------------Submit the Data in Database------------*/
    
    $scope.submitMasterSheet=function(){
    	
    	$scope.sumbitBatchDetails={
    			batchId : $scope.batchDetails.value,
    			wardType : $scope.batch.wardType,
    			wardNumber : $scope.batch.wardNumber,
    			centreId : $scope.batch.centreId,
    			state : $scope.batch.state,
    			city : $scope.batch.centreCity,
    			municipality : $scope.batch.municipality,
    			selectionCommitteeDate : $scope.batch.selectionCommitteeDate,
    			trainerName : $scope.batch.principalTrainerName,
    			batchStartDate : $scope.batch.batchStartDate,
    			batchEndDate : $scope.batch.batchEndDate,
    			assessmentDate : $scope.batch.assessmentDate,
    			medicalExamDate : $scope.batch.medicalExamDate,
    			employerName : $scope.batch.employerName,
    			employerNumber : $scope.batch.employerContactNumber
    			
    			
    	};
    	
    	
    	
    	$http({
    		url : '/submitBatchDetails',
    		method :"POST",
    		data : angular.toJson($scope.sumbitBatchDetails),
    		headers : {
    			'Content-type' : 'application/json'
    		}
    	}).then(function(response){
    		$scope.status= response.data;
			if($scope.status==1){
				$scope.submitMsg=true;
				$scope.errorMsg=false;
				$scope.SuccessMessage="Batch details inserted successfully";
			 	var file = $scope.masterSheet.import;
		      	/*console.log('File selected is :'+file);*/
		      	var batchId = $scope.batchDetails.value;
		      	/*console.log('batch  is :'+batchId)*/
		          var importUrl = "/importMasterSheet";
		        var fileuploaded = fileUpload.uploadFileToUrl(file, importUrl, batchId);
		    
				
			}
		
		
			else{
				
				$scope.submitMsg=false;
				$scope.errorMessage="Could not insert details of batch";
				$scope.errorMsg=true;
				
			}          
    	},function(errorResponse){
    		$scope.submitMsg=false;
			$scope.errorMessage="Could not insert details of batch";
			$scope.errorMsg=true;
    	});
    	
    	$timeout(function() {
            $scope.submitMsg="";
            $scope.errorMsg="";
            $scope.success = false;
            $scope.successMessage = false;
            $scope.errorMsg=false;
         }, 3000);
    }
    
    
 
    
});