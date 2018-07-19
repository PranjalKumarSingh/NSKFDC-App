package com.nskfdc.scgj.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import com.nskfdc.scgj.dto.BatchDto;
import com.nskfdc.scgj.dto.BatchIdDto;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nskfdc.scgj.common.SessionUserUtility;
import com.nskfdc.scgj.dto.BatchIdDto;
import com.nskfdc.scgj.dto.UploadDocumentsDto;
import com.nskfdc.scgj.service.UploadDocumentService;

@RestController
public class UploadDocumentsController {
	private static final Logger LOGGER= LoggerFactory.getLogger(UploadDocumentsController.class);

	@Autowired
	private UploadDocumentService uploadDocumentService;
	
	@Autowired
	private SessionUserUtility sessionUserUtility;
	
	
	
	
	@RequestMapping("/uploadDocuments")
	public void uploadDocuments() {
		String userEmail = sessionUserUtility.getSessionMangementfromSession().getUsername();
		uploadDocumentService.saveUploadedDocument();
	}
	
	
	@RequestMapping("/searchDocument")
	public Collection<UploadDocumentsDto> searchDocument(@RequestParam("batchId") String batchId){
		
	
try {
	String userEmail = sessionUserUtility.getSessionMangementfromSession().getUsername();
			LOGGER.debug("In try block ");
			LOGGER.debug("Sending request to service to get documents uploaded by id :" + batchId);	
			return uploadDocumentService.getSearchedDocument(batchId,userEmail);
		}
		catch(Exception e) {	
			LOGGER.debug("An error occurred while searching for uploaded documents" + e);
			LOGGER.debug("Returning NULL!");
			return null;
			
		}	
	
	}
	
	//adding my own:
	@RequestMapping("/downloadZipFileService")
	public void DownloadDoc(@RequestParam("batchId") String id, HttpServletResponse response){
		LOGGER.debug("In block DOWNLOAD");
		try {
			String userEmail = sessionUserUtility.getSessionMangementfromSession().getUsername();
			String zipFileLink="j";
			LOGGER.debug("In try block DOWNLOAD"  + zipFileLink + id);
			int count=0;
			//CHANGE HERE!!!!!!
			Collection<UploadDocumentsDto> oldCollection = uploadDocumentService.getSearchedDocument(id,userEmail);
			LOGGER.debug("In try block ");
				Iterator<UploadDocumentsDto> iterator = oldCollection.iterator();
				while (iterator.hasNext()) {
				count++;
				if(count==4)
				zipFileLink = iterator.next().getZipFileLink();
				System.out.print(zipFileLink);
				LOGGER.debug("After try" + zipFileLink + id);
				}
				
				System.out.print(zipFileLink);
				LOGGER.debug("Checking for zip value" + zipFileLink + "batchID:" +id);
				File file = new File(zipFileLink);
			    response.setContentType("application/zip");
			   
			    response.setHeader("Content-Disposition", "attachment;filename=" + file.getName());
			    BufferedInputStream inStrem = new BufferedInputStream(new FileInputStream(file));
			    BufferedOutputStream outStream = new BufferedOutputStream(response.getOutputStream());  
			    byte[] buffer = new byte[1024];
			    int bytesRead = 0;
			    while ((bytesRead = inStrem.read(buffer)) != -1) {
			        outStream.write(buffer, 0, bytesRead);
			    }
			    outStream.flush();
			    inStrem.close();
		}catch(Exception e) {
			
			LOGGER.debug("An error occurred" + e);
//			return;
			
		}
		}
	@RequestMapping("/getBatchIdDet")
	public List<BatchDto> getBatchIdDetails(){
		LOGGER.debug("Request received from frontend");
		LOGGER.debug("In upload Controller");
		String userEmail = sessionUserUtility.getSessionMangementfromSession().getUsername();
		LOGGER.debug("The username retreived from session is : " + userEmail);
		try{
			
			LOGGER.debug("In try block of upload documents" + userEmail);
			LOGGER.debug("Sending request to uploadservice to fetch batch ID for user with username" + userEmail);
			
			return uploadDocumentService.getBatchDetails(userEmail);
		}
		
		 catch(Exception e) {
		
			 LOGGER.error("An error occurred while sending Batch" + e);
				
			 return null;
		 }
	}
	 @RequestMapping("/getScgjDetails")
	 public int scgjDetails(@RequestParam("batchId") String batchId, @RequestParam("scgjBatchNumber") String scgjBatchNumber) {
	 		
	 		LOGGER.debug("Request received from frontend");
	 		LOGGER.debug("In Scgj Controller");
	 		
	 		try {
	 			String userEmail = sessionUserUtility.getSessionMangementfromSession().getUsername();
	 			
	 			LOGGER.debug("In try block of Scgj Controller");
	 			return uploadDocumentService.scgjBatchIdField(batchId,scgjBatchNumber);	
	 			
	 		}catch(Exception e) {
	 			LOGGER.error("In catch block of Scgj Controller"+e);
	 			return 0;
	 		}
	 		
	 	}
	 @RequestMapping("/getBatchDetails")
	 public int scgjDetails(@RequestParam("batchId") String batchId) {
	 		
	 		LOGGER.debug("Request received from frontend");
	 		LOGGER.debug("In Scgj Controller");
	 		
	 		try {
	 			String userEmail = sessionUserUtility.getSessionMangementfromSession().getUsername();
	 			
	 			LOGGER.debug("In try block of Scgj Controller");
	 			return uploadDocumentService.BatchIdField(batchId);	
	 			
	 		}catch(Exception e) {
	 			LOGGER.error("In catch block of Scgj Controller"+e);
	 			return 0;
	 		}
	 		
	 	}
	

}

	
