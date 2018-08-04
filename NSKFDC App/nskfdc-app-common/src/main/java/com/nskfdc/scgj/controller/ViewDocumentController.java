package com.nskfdc.scgj.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.util.Collection;
import java.util.Iterator;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nskfdc.scgj.common.SessionUserUtility;
import com.nskfdc.scgj.dto.ViewDocumentDto;
import com.nskfdc.scgj.service.ViewDocumentService;

@RestController
public class ViewDocumentController {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(ViewDocumentController.class);

	@Autowired
	private SessionUserUtility sessionUserUtility;
	private String userEmail;

	@Autowired
	private ViewDocumentService viewDocumentService;

	/**
	 * Method to get training partner details based on a batch Id
	 * 
	 * @param tpName
	 * @param batchId
	 * @return
	 */
	@RequestMapping("/getTrainingPartnerDetailForSearchbatchId")
	public Collection<ViewDocumentDto> getTrainingPartnerDetailForSearchbatchId(
			@RequestParam("tpName") String tpName,
			@RequestParam("batchId") String batchId) {

		LOGGER.debug("Request received from frontend");
		LOGGER.debug("In  ViewDocument Controller");

		try {
			userEmail = sessionUserUtility.getSessionMangementfromSession()
					.getUsername();
			LOGGER.debug("In try block to get training partner details for Search");
			LOGGER.debug("Sending request to service");
			return viewDocumentService.getViewTrainingPartnerDetailForBatchId(
					tpName, batchId);

		} catch (Exception e) {

			LOGGER.debug("An error occurred while getting the training partner details for Search"
					+ e);
			return null;
		}

	}

	/**
	 * Method to get details of training Partner based on SCGJ Batch number
	 * 
	 * @param tpName
	 * @param scgjBtNumber
	 * @return
	 */
	@RequestMapping("/getTrainingPartnerDetailForSearchscgjBtNumber")
	public Collection<ViewDocumentDto> getTrainingPartnerDetailForSearchscgjBtNumber(
			@RequestParam("tpName") String tpName,
			@RequestParam("scgjBtNumber") String scgjBtNumber) {

		LOGGER.debug("Request received from frontend");
		LOGGER.debug("In  ViewDocument Controller");

		try {
			LOGGER.debug("In try block to get training partner details for Search");
			LOGGER.debug("Sending request to service");
			return viewDocumentService
					.getViewTrainingPartnerDetailForscgjBtNumber(tpName,
							scgjBtNumber);

		} catch (Exception e) {

			LOGGER.debug("An error occurred while getting the training partner details for Search"
					+ e);
			return null;
		}
	}

	// adding my own code for downloadZipFileForBatchId :
	@RequestMapping("/downloadZipFileForBatchId")
	public void DownloadZipFileForBatchId(
			@RequestParam("tpName") String tpName,
			@RequestParam("batchId") String batchId,
			HttpServletResponse response) {
		LOGGER.debug("In block DOWNLOAD");
		try {
			String zipFileLink = "j";
			LOGGER.debug("In try block DOWNLOAD" + zipFileLink + tpName
					+ batchId);
			int count = 0;
			// CHANGE HERE!!!!!!
			Collection<ViewDocumentDto> oldCollection = viewDocumentService
					.getViewTrainingPartnerDetailForBatchId(tpName, batchId);
			LOGGER.debug("In try block ");

			Iterator<ViewDocumentDto> iterator = oldCollection.iterator();
			while (iterator.hasNext()) {
				count++;
				if (count == 3) {
					zipFileLink = iterator.next().getZipFileLink();
				}
				System.out.print(zipFileLink);
				LOGGER.debug("After try" + zipFileLink + tpName + batchId);
			}

			LOGGER.debug("ZIP FILE LINK is" + zipFileLink + "batchID" + batchId);
			System.out.print(zipFileLink);
			LOGGER.debug("Checking for zip value" + zipFileLink + "batchID:"
					+ tpName + batchId);
			File file = new File(zipFileLink);
			response.setContentType("application/zip");

			response.setHeader("Content-Disposition", "attachment;filename="
					+ file.getName());

			BufferedInputStream inStrem = new BufferedInputStream(
					new FileInputStream(file));
			BufferedOutputStream outStream = new BufferedOutputStream(
					response.getOutputStream());
			byte[] buffer = new byte[1024];
			int bytesRead = 0;
			while ((bytesRead = inStrem.read(buffer)) != -1) {
				outStream.write(buffer, 0, bytesRead);
			}
			outStream.flush();
			inStrem.close();
			if (file.delete())
				LOGGER.debug("FILE DELETED SUCCESSFULLY");
			else
				LOGGER.debug("COULD NOT DELETE FILE");

		} catch (Exception e) {

			LOGGER.debug("An error occurred" + e);

		}

	}

	/**
	 * Method to download zip with training partner name and scgj batch number
	 * as parameter
	 * 
	 * @param tpName
	 * @param scgjBtNumber
	 * @param response
	 */
	@RequestMapping("/downloadZipFileForSearchscgjBtNumber")
	public void DownloadZipFileForSearchscgjBtNumber(
			@RequestParam("tpName") String tpName,
			@RequestParam("scgjBtNumber") String scgjBtNumber,
			HttpServletResponse response) {
		LOGGER.debug("In block DOWNLOAD");
		try {
			
			  String zipFileLink="j"; LOGGER.debug("In try block DOWNLOAD" +
			  zipFileLink + tpName + scgjBtNumber);
			 
			int count = 0;
			// CHANGE HERE!!!!!!
			Collection<ViewDocumentDto> oldCollection = viewDocumentService
					.getViewTrainingPartnerDetailForscgjBtNumber(tpName,
							scgjBtNumber);

			LOGGER.debug("In try block ");
			Iterator<ViewDocumentDto> iterator = oldCollection.iterator();
			while (iterator.hasNext()) {
				count++;
				if (count == 4)
					zipFileLink = iterator.next().getZipFileLink();
				System.out.print(zipFileLink);
				LOGGER.debug("After try" + zipFileLink + tpName + scgjBtNumber);
			}

			System.out.print(zipFileLink);
			LOGGER.debug("Checking for zip value" + zipFileLink + "batchID:"
					+ tpName + scgjBtNumber);
			File file = new File(zipFileLink);
			response.setContentType("application/zip");

			response.setHeader("Content-Disposition", "attachment;filename="
					+ file.getName());

			BufferedInputStream inStrem = new BufferedInputStream(
					new FileInputStream(file));
			BufferedOutputStream outStream = new BufferedOutputStream(
					response.getOutputStream());
			byte[] buffer = new byte[1024];
			int bytesRead = 0;
			while ((bytesRead = inStrem.read(buffer)) != -1) {
				outStream.write(buffer, 0, bytesRead);
			}
			outStream.flush();
			inStrem.close();
			if (file.delete())
				LOGGER.debug("FILE DELETED SUCCESSFULLY");
			else
				LOGGER.debug("NOT DELETED FILE");
		} catch (Exception e) {

			LOGGER.debug("An error occurred" + e);

		}
	}

}
