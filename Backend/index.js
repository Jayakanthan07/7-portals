const express = require('express');
const bodyParser = require('body-parser');
var http = require('follow-redirects').http;
const cors = require('cors');
var fs = require('fs');
const parser = require('xml-js');
var jwt = require('jsonwebtoken');

app = express();

app.use(bodyParser.json());
app.use(cors());

//Validating the credentials data from SAP Ztable ZTA_AUTH_DJ 
//zjk_auth

app.post('/login', (req, res) => {
	console.log("Cust_username,Cust_password");
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?channel=:BC_DJ:CC_V_SENDER',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const Cust_username = req.body.email;
	const Cust_password = req.body.password;
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:demo="http://DJ.com/demo">
   <soapenv:Header/>
   <soapenv:Body>
      <demo:MT_V_REQ>
         <UserName>${Cust_username}</UserName>
         <Password>${Cust_password}</Password>
      </demo:MT_V_REQ>
   </soapenv:Body>
</soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];
		
		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			console.log("trial5",xml);
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_V_RES'];
			let token;
			if(resp['Status']['_text']==='1 '){
				// login sucess
				token = jwt.sign({
                    id:'1998',
                    email: 'jk@gmail.com'
                }, 'jk', {
                    expiresIn: 604800
                });
			} else {
				token = null;
			}
			res.send({
				Status: resp['Status']['_text'],
				token: token,
				username: req.body.email
			});
		});

		res1.on("error", function (error) {
			console.error('probably SAP is not working',error);
			
		});
	});

	req1.write(postData);

	req1.end();
});

//displaying the profile data from SAP Ztable Zjk_cust_profile

app.post('/profile', (req, res) => {
	console.log('received token is : ', req.headers.token);

	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?channel=:BC_jk7:CC_jk7_sender',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const Cust_username = req.body.custID;
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:prof="http://jaikanth7.com/profile">
	<soapenv:Header/>
	<soapenv:Body>
	   <prof:MT_jk7_cust_req>
		  <username>${Cust_username}</username>
	   </prof:MT_jk7_cust_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_jk7_cust_res'];
			res.send({
				cust_name: resp['cust_name']['_text'],
				cust_email: resp['cust_email']['_text'],
				cust_phone: resp['cust_phone']['_text'],
				cust_city: resp['cust_city']['_text'],
				cust_country: resp['cust_country']['_text'],
				cust_pincode: resp['cust_pincode']['_text'],
				cust_district: resp['cust_district']['_text'],
				cust_state: resp['cust_state']['_text'],
				cust_addr: resp['cust_addr']['_text'],
				cust_fax: resp['cust_fax']['_text'],
				cust_companyid: resp['cust_companyid']['_text'],
				cust_vat: resp['cust_vat']['_text']
			});
		});

		res1.on("error", function (error) {
			console.error(error);
		});
	});

	req1.write(postData);

	req1.end();
});

//Updating the profile data from SAP Ztable Zaddress1_AV
//zjk_cust_profile


app.post('/updateprofile', (req, res) => {
	console.log('received token is : ', req.headers.token);

	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_jk7_pupdate&receiverParty=&receiverService=&interface=SI_OUT_jk7_pupdate_req&interfaceNamespace=http://jaikanth7.com/profileupdate',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const Cust_username = req.body.custID;
	console.log(Cust_username);
	const Cust_name = req.body.Name;
	console.log(Cust_name);
	const Cust_email = req.body.Email;
	const Cust_phone = req.body.Phone;
	const Cust_city = req.body.City;
	const Cust_country = req.body.Country;
	const Cust_pincode = req.body.Pincode;
	const Cust_district = req.body.District;
	const Cust_state = req.body.State;
	const Cust_addr = req.body.Address;
	console.log(Cust_addr);
	const Cust_fax = req.body.FAX;
	console.log(Cust_fax);
	const Cust_companyid = req.body.CompanyID;
	console.log(Cust_companyid);
	const Cust_vat = req.body.VAT;
	console.log(Cust_vat);
	
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:prof="http://jaikanth7.com/profileupdate">
	<soapenv:Header/>
	<soapenv:Body>
	<prof:MT_jk7_pupdate_req>
		  <user_name>${Cust_username}</user_name>
		  <cust_name>${Cust_name}</cust_name>
		  <cust_email>${Cust_email}</cust_email>
		  <cust_phone>${Cust_phone}</cust_phone>
		  <cust_city>${Cust_city}</cust_city>
		  <cust_country>${Cust_country}</cust_country>
		  <cust_pincode>${Cust_pincode}</cust_pincode>
		  <cust_district>${Cust_district}</cust_district>
		  <cust_state>${Cust_state}</cust_state>
		  <cust_addr>${Cust_addr}</cust_addr>
		  <cust_fax>${Cust_fax}</cust_fax>
		  <cust_companyid>${Cust_companyid}</cust_companyid>
		  <cust_vat>${Cust_vat}</cust_vat>
		  </prof:MT_jk7_pupdate_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log(xml);
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_jk7_pupdate_res'];
			res.send({
				status: resp['status']['_text'],
				
			})
			console.log("status response is:",resp['status']['_text']);
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});

//displaying the Invoice data from SAP Ztable Zaddress_AV
//zta_profile

app.post('/invoice', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_Invoice&receiverParty=&receiverService=&interface=SI_OUT_Invoice_req&interfaceNamespace=http://crimson-fern.com/customer',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const CustID = req.body.custID;
	console.log(CustID);
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="http://crimson-fern.com/customer">
	<soapenv:Header/>
	<soapenv:Body>
	   <cus:MT_Invoice_req>
		  <cust_id>${CustID}</cust_id>
	   </cus:MT_Invoice_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			// console.log(xml);
			// var empdetails = data["SOAP:Envelope"]["SOAP:Body"]["ns0:MT_INVOICE_RES"];
			
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			// console.log('recieved from Soap',JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_Invoice_res']['Invoice']);
		
			const resp = JSON.parse(data)['SOAP:Envelope'];
			console.log(resp);
			var invoiceresponse = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_Invoice_res']['Invoice'];
			
			console.log(invoiceresponse);

			for(i in invoiceresponse)
			{
				console.log(invoiceresponse[i].invoice_id);
				console.log(invoiceresponse[i].cust_id);
				console.log(invoiceresponse[i].vendor_id);
				console.log(invoiceresponse[i].price);
				console.log(invoiceresponse[i].itemname);
				console.log(invoiceresponse[i].quantity);
				console.log(invoiceresponse[i].totalamount);
				console.log(invoiceresponse[i].dateofdelivery);
				
			}
			
			res.send({
				invoiceresponse: invoiceresponse
				

				
			});
			
			
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});




//displaying the Credut Memo data from SAP Ztable Zcreditmemo

app.post('/credit', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_CUSTOMER&receiverParty=&receiverService=&interface=SI_CREDITMEMO_REQ&interfaceNamespace=http://crimson-fern.com/customer',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	//const InvID = req.body.CustID;
	//console.log(InvID);
	
	const CustID = req.body.custID;
	console.log(CustID);
	

	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="http://crimson-fern.com/customer">
	<soapenv:Header/>
	<soapenv:Body>
	   <cus:MT_CREDITMEMO_REQ>
		  <CUST_ID>${CustID}</CUST_ID>
	   </cus:MT_CREDITMEMO_REQ>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});


		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			// console.log(xml);
			// var empdetails = data["SOAP:Envelope"]["SOAP:Body"]["ns0:MT_INVOICE_RES"];
			
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			// console.log('recieved from Soap',JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_Invoice_res']['Invoice']);
		
			const resp = JSON.parse(data)['SOAP:Envelope'];
			console.log(resp);
			var creditresponse = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_CREDITMEMO_RES']['CREDITMEMO'];
			
			console.log(creditresponse);

			for(i in creditresponse)
			{
				console.log(creditresponse[i].CREDITMEMO_ID);
				console.log(creditresponse[i].VENDOR_ID);
				console.log(creditresponse[i].VENDOR_NAME);
				console.log(creditresponse[i].VENDOR_ADDRESS);
				console.log(creditresponse[i].DATE);
				console.log(creditresponse[i].LINE_ITEM);
				console.log(creditresponse[i].QTY);
				console.log(creditresponse[i].AMOUNT);
				console.log(creditresponse[i].TOTAL);
				
			}
			
			res.send({
				creditresponse: creditresponse
				

				
			});
			
			
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});

//displaying the Payment and Aging details from SAP Ztable Zta_payment

app.post('/payment', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_CUSTOMER&receiverParty=&receiverService=&interface=SI_AGING_REQ&interfaceNamespace=http://crimson-fern.com/customer',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const CustID = req.body.custID;
	console.log(CustID);
	
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="http://crimson-fern.com/customer">
	<soapenv:Header/>
	<soapenv:Body>
	   <cus:MT_AGING_REQ>
		  <CUST_ID>${CustID}</CUST_ID>
	   </cus:MT_AGING_REQ>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log('recieved from Soap',data);
			const resp = JSON.parse(data)['SOAP:Envelope'];
			var paymentresponse = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_AGING_RES']['AGING'];
			console.log(paymentresponse);
			for(i in paymentresponse)
			{
				console.log(paymentresponse[i].VENDOR_ID);
				console.log(paymentresponse[i].VENDOR_NAME);
				console.log(paymentresponse[i].TOTAL_AR);
				console.log(paymentresponse[i].ZEROTOTHIRTYDAYS);
				console.log(paymentresponse[i].THIRTYONETOSIXTYDAYS);
				console.log(paymentresponse[i].SIXTYONETONINETYDAYS);
				console.log(paymentresponse[i].NINETYPLUSDAYS);
			}
			
			res.send({
				paymentresponse: paymentresponse
			});
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});
//displaying the Payment and Aging details from SAP Ztable Zinquiry

app.post('/inquiry', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_CUSTOMER&receiverParty=&receiverService=&interface=SI_INQUIRY_REQ&interfaceNamespace=http://crimson-fern.com/customer',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const CustID = req.body.custID;
	console.log(CustID);
	
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="http://crimson-fern.com/customer">
	<soapenv:Header/>
	<soapenv:Body>
	   <cus:MT_INQUIRY_REQ>
		  <CUST_ID>${CustID}</CUST_ID>
	   </cus:MT_INQUIRY_REQ>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log('recieved from Soap',data);
			const resp = JSON.parse(data)['SOAP:Envelope'];
			var inquiryresponse = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_INQUIRY_RES']['INQUIRY'];
			
			for(i in inquiryresponse)
			{
				console.log(inquiryresponse[i].INQUIRY_NO);
				console.log(inquiryresponse[i].CUST_ID);
				console.log(inquiryresponse[i].CUST_PHONENO);
				console.log(inquiryresponse[i].PRODUCT_INQUIRY);
				console.log(inquiryresponse[i].QTY);
			}
			
			res.send({
				inquiryresponse: inquiryresponse
			});
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});
//displaying the Payment and Aging details from SAP Ztable Zta_payment

app.post('/saleorder', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_CUSTOMER&receiverParty=&receiverService=&interface=SI_SALESORDER_REQ&interfaceNamespace=http://crimson-fern.com/customer',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const CustID = req.body.custID;
	console.log(CustID);
	
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="http://crimson-fern.com/customer">
	<soapenv:Header/>
	<soapenv:Body>
	   <cus:MT_SALESORDER_REQ>
		  <CUST_ID>${CustID}</CUST_ID>
	   </cus:MT_SALESORDER_REQ>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log('recieved from Soap',data);
			const resp = JSON.parse(data)['SOAP:Envelope'];
			var salesresponse = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_SALESORDER_RES']['SALESORDER'];
			
			for(i in salesresponse)
			{
				console.log(salesresponse[i].SALESID);
				console.log(salesresponse[i].INQUIRYTYPE);
				console.log(salesresponse[i].SALES_ORG);
				console.log(salesresponse[i].SALES_GRP);
				console.log(salesresponse[i].ITEMNO);
				console.log(salesresponse[i].ITEMDESC);
				console.log(salesresponse[i].QUANTITY);
				console.log(salesresponse[i].TOTAL);
				console.log(salesresponse[i].DELIVERYTIME);
				console.log(salesresponse[i].PO_DATE);
				console.log(salesresponse[i].PO_NUM);
			}
			
			res.send({
				salesresponse: salesresponse
			});
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});

//displaying the Vendor profile data from SAP Ztable ZTA_VEN_PROFILE


app.post('/vendorprofile', (req, res) => {
	console.log('received token is : ', req.headers.token);

	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VLogin&receiverParty=&receiverService=&interface=SI_OUT_VProfile_req&interfaceNamespace=http://crimson-fern.com/vendor',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const Ven_username = req.body.venID;
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ven="http://crimson-fern.com/vendor">
	<soapenv:Header/>
	<soapenv:Body>
	   <ven:MT_VProfile_req>
		  <Username>${Ven_username}</Username>
	   </ven:MT_VProfile_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_VProfile_res'];
			res.send({
				ven_name: resp['ven_name']['_text'],
				ven_email: resp['ven_email']['_text'],
				ven_phone: resp['ven_phone']['_text'],
				ven_city: resp['ven_city']['_text'],
				ven_country: resp['ven_country']['_text'],
				ven_pincode: resp['ven_pincode']['_text'],
				ven_state: resp['ven_state']['_text'],
				ven_address: resp['ven_address']['_text'],

				ven_pan: resp['ven_pan']['_text'],
				ven_gstin: resp['ven_gstin']['_text'],
				ven_entitytype: resp['ven_entitytype']['_text'],
				ven_regtype: resp['ven_regtype']['_text']
			});
		});

		res1.on("error", function (error) {
			console.error(error);
		});
	});

	req1.write(postData);

	req1.end();
});

//Employee portal

app.post('/emplogin', (req, res) => {
	//console.log("Cust_username,Cust_password");
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_EmployeePortal&receiverParty=&receiverService=&interface=SI_OUT_ELogin_req&interfaceNamespace=http://crimson-fern.com/employee',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const emp_username = req.body.email;
	const emp_password = req.body.password;
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:emp="http://crimson-fern.com/employee">
	<soapenv:Header/>
	<soapenv:Body>
	   <emp:MT_ELogin_req>
		  <Username>${emp_username}</Username>
		  <Password>${emp_password}</Password>
	   </emp:MT_ELogin_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];
		
		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			console.log("trial5",xml);
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_ELogin_res'];
			let token;
			if(resp['Status']['_text']==='1 '){
				// login sucess
				token = jwt.sign({
                    id:'1998',
                    email: 'jk@gmail.com'
                }, 'jk', {
                    expiresIn: 604800
                });
			} else {
				token = null;
			}
			res.send({
				Status: resp['Status']['_text'],
				token: token,
				username: req.body.email
			});
		});

		res1.on("error", function (error) {
			console.error('probably SAP is not working',error);
			
		});
	});

	req1.write(postData);

	req1.end();
});


//emp profile

app.post('/empprofile', (req, res) => {
	console.log('received token is : ', req.headers.token);

	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_EmployeePortal&receiverParty=&receiverService=&interface=SI_OUT_EProfile_req&interfaceNamespace=http://crimson-fern.com/employee',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const emp_username = req.body.empID;  //comes from local storage
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:emp="http://crimson-fern.com/employee">
	<soapenv:Header/>
	<soapenv:Body>
	   <emp:MT_EProfile_req>
		  <Username>${emp_username}</Username>
	   </emp:MT_EProfile_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_EProfile_res'];
			console.log(resp);
			res.send({
				emp_name: resp['emp_name']['_text'],
				emp_email: resp['emp_email']['_text'],
				emp_phone: resp['emp_phone']['_text'],
				emp_city: resp['emp_city']['_text'],
				emp_country: resp['emp_country']['_text'],
				emp_pincode: resp['emp_pincode']['_text'],
				emp_state: resp['emp_state']['_text'],
				emp_address: resp['emp_address']['_text'],
				emp_fax: resp['emp_fax']['_text'],
				emp_company: resp['emp_company']['_text'],
				emp_department: resp['emp_department']['_text'],
				emp_jobrole: resp['emp_jobrole']['_text'],
				emp_reportsto: resp['emp_reportsto']['_text'],
				emp_hiredate: resp['emp_hiredate']['_text']
			});
		});

		res1.on("error", function (error) {
			console.error(error);
		});
	});

	req1.write(postData);

	req1.end();
});



app.post('/empupdateprofile', (req, res) => {
	console.log('received token is : ', req.headers.token);

	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_EmployeePortal&receiverParty=&receiverService=&interface=SI_OUT_EUpdate_req&interfaceNamespace=http://crimson-fern.com/employee',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const emp_id = req.body.empID;
	const emp_name = req.body.Name;
	const emp_email = req.body.Email;
	const emp_phone = req.body.Phone;
	const emp_city = req.body.City;
	const emp_country = req.body.Country;
	const emp_pincode = req.body.Pincode;
	const emp_state = req.body.State;
	const emp_address = req.body.Address;
	const emp_fax = req.body.FAX;
	const emp_company = req.body.Company;	
	const emp_department = req.body.Department;
	const emp_jobrole = req.body.Jobrole;
	const emp_reportsto = req.body.Reportsto;
	const emp_hiredate = req.body.Hiredate;
	
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:emp="http://crimson-fern.com/employee">
	<soapenv:Header/>
	<soapenv:Body>
	   <emp:MT_EUpdate_req>
		  <emp_id>${emp_id}</emp_id>	   
		  <emp_name>${emp_name}</emp_name>
		  <emp_phone>${emp_phone}</emp_phone>
		  <emp_city>${emp_city}</emp_city>
		  <emp_state>${emp_state}</emp_state>
		  <emp_address>${emp_address}</emp_address>
		  <emp_country>${emp_country}</emp_country>
		  <emp_pincode>${emp_pincode}</emp_pincode>
		  <emp_email>${emp_email}</emp_email>
		  <emp_fax>${emp_fax}</emp_fax>
		  <emp_company>${emp_company}</emp_company>
		  <emp_department>${emp_department}</emp_department>
		  <emp_jobrole>${emp_jobrole}</emp_jobrole>
		  <emp_reportsto>${emp_reportsto}</emp_reportsto>
		  <emp_hiredate>${emp_hiredate}</emp_hiredate>
	   </emp:MT_EUpdate_req>
		 </soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log(xml);
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_EUpdate_res'];
			res.send({
				Status: resp['Status']['_text'],
				
			})
			console.log("status response is:",resp['Status']['_text']);
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});


//Creating Employee leave request ZTA_Leave


app.post('/empleaverequest', (req, res) => {
	console.log('received token is : ', req.headers.token);

	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_TA_EMPLOYEE&receiverParty=&receiverService=&interface=SI_CREATELR_REQ&interfaceNamespace=http://crimson-fern.com/employee',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const emp_id = req.body.empID;
	const leave_id = req.body.leaveID;
	const emp_name = req.body.name;
	const emp_department = req.body.department;
	const leavetype = req.body.leavetype;
	const emailto = req.body.emailto;
	const date_from = req.body.date_from;
	const date_to = req.body.date_to;
	const reason = req.body.reason;
	

	
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:emp="http://crimson-fern.com/employee">
	<soapenv:Header/>
	<soapenv:Body><emp:MT_CREATELR_REQ>
		  <EMP_ID>${emp_id}</EMP_ID>
		  <LEAVE_ID>${leave_id}</LEAVE_ID>
		  <EMP_NAME>${emp_name}</EMP_NAME>
		  <EMP_DEPT>${emp_department}</EMP_DEPT>
		  <LEAVE_TYPE>${leavetype}</LEAVE_TYPE>
		  <EMAIL_TO>${emailto}</EMAIL_TO>
		  <DATE_FROM>${date_from}</DATE_FROM>
		  <DATE_TO>${date_to}</DATE_TO>
		  <REASON>${reason}</REASON>
	   </emp:MT_CREATELR_REQ>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log(xml);
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_CREATELR_RES'];
			res.send({
				Status: resp['STATUS_CODE']['_text'],
				
			})
			console.log("status response is:",resp['STATUS_CODE']['_text']);
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});



//leave display

//displaying the Leave requests of employee from SAP ZTA_LEAVE

app.post('/empleavedisplay', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_TA_EMPLOYEE&receiverParty=&receiverService=&interface=SI_DISPLAYLR_REQ&interfaceNamespace=http://crimson-fern.com/employee',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const emp_id = req.body.empID;
	console.log(emp_id);
	
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:emp="http://crimson-fern.com/employee">
	<soapenv:Header/>
	<soapenv:Body>
	   <emp:MT_DISPLAYLR_REQ>
		  <EMP_ID>${emp_id}</EMP_ID>
	   </emp:MT_DISPLAYLR_REQ>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log('recieved from Soap',data);
			const resp = JSON.parse(data)['SOAP:Envelope'];
			var leaveresponse = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_DISPLAYLR_RES']['DISPLAYLR'];
			console.log(leaveresponse);
			for(i in leaveresponse)
			{
				console.log(leaveresponse[i].LEAVE_ID);
				console.log(leaveresponse[i].EMP_ID);
				console.log(leaveresponse[i].EMP_NAME);
				console.log(leaveresponse[i].EMP_DEPT);
				console.log(leaveresponse[i].LEAVE_TYPE);
				console.log(leaveresponse[i].EMAIL_TO);
				console.log(leaveresponse[i].DATE_FROM);
				console.log(leaveresponse[i].DATE_TO);
				console.log(leaveresponse[i].REASON);
			}
			
			res.send({
				leaveresponse: leaveresponse
			});
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});

// payslip
//displaying the Salary Display of employee from SAP ZTA_SALARY


app.post('/emppayslip', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_TA_EMPLOYEE&receiverParty=&receiverService=&interface=SI_SALARYPAYSLIP_REQ&interfaceNamespace=http://crimson-fern.com/employee',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const emp_id = req.body.empID;
	const Year = req.body.year;
	console.log(emp_id);
	
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:emp="http://crimson-fern.com/employee">
	<soapenv:Header/>
	<soapenv:Body>
	   <emp:MT_SALARYPAYSLIP_REQ>
		  <EMP_ID>${emp_id}</EMP_ID>
		  <YEAR>${Year}</YEAR>
	   </emp:MT_SALARYPAYSLIP_REQ>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log('recieved from Soap',data);
			const resp = JSON.parse(data)['SOAP:Envelope'];
			var salaryresponse = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_SALARYPAYSLIP_RES']['SALARYPAYSLIP'];
			console.log(salaryresponse);
			for(i in salaryresponse)
			{
				console.log(salaryresponse[i].COMPANY_NAME);
				console.log(salaryresponse[i].EMP_ID);
				console.log(salaryresponse[i].EMP_NAME);
				console.log(salaryresponse[i].EMP_DEPT);
				console.log(salaryresponse[i].ACCOUNT_NUMBER);
				console.log(salaryresponse[i].MODE_OF_PARTY);
				console.log(salaryresponse[i].BASIC);
				console.log(salaryresponse[i].DA);
				console.log(salaryresponse[i].HRA);
				console.log(salaryresponse[i].NET_PAY);
				console.log(salaryresponse[i].MONTH);
				console.log(salaryresponse[i].YEAR);
			}
			
			res.send({
				salaryresponse: salaryresponse
			});
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});

//payslip hardwork
//displaying the Month and year wise Salary Details of employee from SAP ZTA_SALARY


app.post('/payslipfilter', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_TA_EMPLOYEE&receiverParty=&receiverService=&interface=SI_SALARYPAYSLIP_REQ&interfaceNamespace=http://crimson-fern.com/employee',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const emp_id = req.body.empID;
	const Month = req.body.month;
	const Year = req.body.year;
	console.log(emp_id);
	
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:emp="http://crimson-fern.com/employee">
	<soapenv:Header/>
	<soapenv:Body>
	   <emp:MT_SALARYPAYSLIP_REQ>
		  <EMP_ID>${emp_id}</EMP_ID>
		  <MONTH>${Month}</MONTH>
		  <YEAR>${Year}</YEAR>
	   </emp:MT_SALARYPAYSLIP_REQ>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log('recieved from Soap',data);
			const resp = JSON.parse(data)['SOAP:Envelope'];
			console.log('Parsing data: ',resp);
			var monthresponse = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_SALARYPAYSLIP_RES']['SALARYPAYSLIP'];
			console.log("final parsing: ",monthresponse);
			res.send({
				COMPANY_NAME: monthresponse['COMPANY_NAME']['_text'],
				EMP_ID:  monthresponse['EMP_ID']['_text'],
				EMP_NAME:  monthresponse['EMP_NAME']['_text'],
				EMP_DEPT:  monthresponse['EMP_DEPT']['_text'],
				ACCOUNT_NUMBER:  monthresponse['ACCOUNT_NUMBER']['_text'],
				MODE_OF_PARTY:  monthresponse['MODE_OF_PARTY']['_text'],
				BASIC:  monthresponse['BASIC']['_text'],
				DA:  monthresponse['DA']['_text'],
				HRA:  monthresponse['HRA']['_text'],
				NET_PAY:  monthresponse['NET_PAY']['_text'],
				MONTH:  monthresponse['MONTH']['_text'],
				YEAR:  monthresponse['YEAR']['_text']

			});
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});
//----------------------------------------------------------------------End of Employee portal----------------------------------------------------------------------------------------------------
// Quality Portal

//quality checker login
app.post('/qualitychecklogin', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_QualityPortal&receiverParty=&receiverService=&interface=SI_OUT_QLogin_req&interfaceNamespace=http://crimon-fern.com/quality',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	
	
	const qc_username = req.body.email;
	const qc_password = req.body.password;
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:qual="http://crimon-fern.com/quality">
	<soapenv:Header/>
	<soapenv:Body>
	   <qual:MT_QLogin_req>
		  <Username>${qc_username}</Username>
		  <Password>${qc_password}</Password>
	   </qual:MT_QLogin_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];
		
		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			console.log("trial5",xml);
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_QLogin_res'];
			console.log(resp);
			let token;
			if(resp['Status']['_text']==='1 '){
				// login sucess
				token = jwt.sign({
                    id:'1634',
                    email: 'Quality@gmail.com'
                }, 'siva', {
                    expiresIn: 604800
                });
			} else {
				token = null;
			}
			res.send({
				Status: resp['Status']['_text'],
				token: token,
				username: req.body.email
			});
			
		});

		res1.on("error", function (error) {
			console.error('probably SAP is not working',error);
			
		});
	});

	req1.write(postData);

	req1.end();
});


//displaying the lot inspection details from ZTA_inspection

app.post('/lotinspection', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_QualityPortal&receiverParty=&receiverService=&interface=SI_OUT_Inspection_req&interfaceNamespace=http://crimon-fern.com/quality',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const eng_id = req.body.engID;
	console.log(eng_id);
	
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:qual="http://crimon-fern.com/quality">
	<soapenv:Header/>
	<soapenv:Body>
	   <qual:MT_Inspection_req>
		  <eng_id>${eng_id}</eng_id>
	   </qual:MT_Inspection_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log('recieved from Soap',data);
			const resp = JSON.parse(data)['SOAP:Envelope'];
			console.log('Parsing data: ',resp);
			var lotinspection = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_Inspection_res']['inspection'];
			console.log("final parsing: ",lotinspection);
			res.send({
				lotinspection : lotinspection,
				
			});
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});


//displaying the LOT result record details from ZTA_LOTRECORD


app.post('/lotrecord', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_QualityPortal&receiverParty=&receiverService=&interface=SI_OUT_lotresult_req&interfaceNamespace=http://crimon-fern.com/quality',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const eng_id = req.body.engID;
	console.log(eng_id);
	
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:qual="http://crimon-fern.com/quality">
	<soapenv:Header/>
	<soapenv:Body>
	   <qual:MT_lotresult_req>
		  <eng_id>${eng_id}</eng_id>
	   </qual:MT_lotresult_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log('recieved from Soap',data);
			const resp = JSON.parse(data)['SOAP:Envelope'];
			console.log('Parsing data: ',resp);
			var lotrecord = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_lotresult_res']['lotresult'];
			console.log("final parsing: ",lotrecord);
			res.send({
				lotrecord : lotrecord,
				
			});
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});


//EHSM Portal

//ehsm login

//EHSM login
app.post('/ehsmlogin', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_Ehsm_login&receiverParty=&receiverService=&interface=SI_OUT_ehsmlogin_req&interfaceNamespace=http://crimson-fern.com/ehsm',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	
	
	const ehsm_username = req.body.email;
	const ehsm_password = req.body.password;
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ehsm="http://crimson-fern.com/ehsm">
	<soapenv:Header/>
	<soapenv:Body>
	   <ehsm:MT_ehsmlogin_req>
		  <Username>${ehsm_username}</Username>
		  <Password>${ehsm_password}</Password>
	   </ehsm:MT_ehsmlogin_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];
		
		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			console.log("trial5",xml);
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_ehsmlogin_res'];
			console.log(resp);
			let token;
			if(resp['Status']['_text']==='1 '){
				// login sucess
				token = jwt.sign({
                    id:'1635',
                    email: 'ehsm@gmail.com'
                }, 'siva', {
                    expiresIn: 604800
                });
			} else {
				token = null;
			}
			res.send({
				Status: resp['Status']['_text'],
				token: token,
				username: req.body.email
			});
			
		});

		res1.on("error", function (error) {
			console.error('probably SAP is not working',error);
			
		});
	});

	req1.write(postData);

	req1.end();
});




//inspection display

app.post('/incidentdisp', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_Ehsm_login&receiverParty=&receiverService=&interface=SI_OUT_ehsm_incidentdisp_req&interfaceNamespace=http://crimson-fern.com/ehsm',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const eng_id = req.body.engID;
	console.log(eng_id);
	
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ehsm="http://crimson-fern.com/ehsm">
	<soapenv:Header/>
	<soapenv:Body>
	   <ehsm:MT_ehsm_incidentdisp_req>
		  <eng_id>${eng_id}</eng_id>
	   </ehsm:MT_ehsm_incidentdisp_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log('recieved from Soap',data);
			const resp = JSON.parse(data)['SOAP:Envelope'];
			console.log('Parsing data: ',resp);
			var incidentdisplay = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_ehsm_incidentdisp_res']['incident'];
			console.log("final parsing: ",incidentdisplay);
			res.send({
				incidentdisplay : incidentdisplay,
				
			});
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});

//ehsm create

//Creating EHSM Incident into Ztable ZTA_INCIDENT

app.post('/incidentcreate', (req, res) => {
	console.log('received token is : ', req.headers.token);

	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_Ehsm_login&receiverParty=&receiverService=&interface=SI_OUT_ehsm_incidentcreate_req&interfaceNamespace=http://crimson-fern.com/ehsm',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const incident_id = req.body.incidentid;
	const eng_id = req.body.engID;
	const description = req.body.description;
	const customer = req.body.customer;
	const reporter = req.body.reporter;
	const processor = req.body.processor;
	const serviceteam = req.body.serviceteam;
	const status = req.body.status;
	const priority = req.body.priority;
	const createdon = req.body.createdon;
	const firstresponse = req.body.firstresponse;
	const endedon = req.body.endedon;

	
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ehsm="http://crimson-fern.com/ehsm">
	<soapenv:Header/>
	<soapenv:Body>
	   <ehsm:MT_ehsm_incidentcreate_req>
		  <incident_id>${incident_id}</incident_id>
		  <eng_id>${eng_id}</eng_id>
		  <description>${description}</description>
		  <customer>${customer}</customer>
		  <reporter>${reporter}</reporter>
		  <processor>${processor}</processor>
		  <serviceteam>${serviceteam}</serviceteam>
		  <status>${status}</status>
		  <priority>${priority}</priority>
		  <createdon>${createdon}</createdon>
		  <firstresponse>${firstresponse}</firstresponse>
		  <endedon>${endedon}</endedon>
	   </ehsm:MT_ehsm_incidentcreate_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log(xml);
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_ehsm_incidentcreate_res'];
			res.send({
				Status: resp['Status']['_text'],
				
			})
			console.log("status response is:",resp['Status']['_text']);
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});

//jk
//incident edit

app.post('/incidentdisp2', (req, res) => {
	console.log('received token is : ', req.headers.token);

	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_Ehsm_login&receiverParty=&receiverService=&interface=SI_OUT_ehsm_incidentdisp_req&interfaceNamespace=http://crimson-fern.com/ehsm',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const incident_id = req.body.incidentid;
	const eng_id = req.body.engID;
	

	
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ehsm="http://crimson-fern.com/ehsm">
	<soapenv:Header/>
	<soapenv:Body>
	   <ehsm:MT_ehsm_incidentdisp_req>
		  <eng_id>${eng_id}</eng_id>
		  <incident_id>${incident_id}</incident_id>
	   </ehsm:MT_ehsm_incidentdisp_req>
	</soapenv:Body>
 </soapenv:Envelope>`;

 console.log("Postdata:",postData);
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log("data",data);
			const resp = JSON.parse(data)['SOAP:Envelope'];
			console.log('Parsing data: ',resp);
			var incidentfilter = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_ehsm_incidentdisp_res']['incident'];
			console.log("final parsing: ",incidentfilter);
			res.send({
				incidentid: incidentfilter['incident_id']['_text'],
				description:  incidentfilter['description']['_text'],
				customer:  incidentfilter['customer']['_text'],
				reporter:  incidentfilter['reporter']['_text'],
				processor:  incidentfilter['processor']['_text'],
				serviceteam:  incidentfilter['serviceteam']['_text'],
				status:  incidentfilter['status']['_text'],
				priority:  incidentfilter['priority']['_text'],
				createdon:  incidentfilter['createdon']['_text'],
				firstresponse:  incidentfilter['firstresponse']['_text'],
				endedon:  incidentfilter['endedon']['_text']
				
			})
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});


//incident edittttt

//Editing the current EHSM Incident into Ztable ZTA_INCIDENT


app.post('/incidentedit', (req, res) => {
	console.log('received token is : ', req.headers.token);

	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_Ehsm_login&receiverParty=&receiverService=&interface=SI_OUT_ehsm_incidentedit_req&interfaceNamespace=http://crimson-fern.com/ehsm',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const incident_id = req.body.incidentid;
	const eng_id = req.body.engID;
	const description = req.body.description;
	const customer = req.body.customer;
	const reporter = req.body.reporter;
	const processor = req.body.processor;
	const serviceteam = req.body.serviceteam;
	const status = req.body.status;
	const priority = req.body.priority;
	const createdon = req.body.createdon;
	const firstresponse = req.body.firstresponse;
	const endedon = req.body.endedon;

	
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ehsm="http://crimson-fern.com/ehsm">
	<soapenv:Header/>
	<soapenv:Body>
	   <ehsm:MT_ehsm_incidentcreate_req>
		  <incident_id>${incident_id}</incident_id>
		  <eng_id>${eng_id}</eng_id>
		  <description>${description}</description>
		  <customer>${customer}</customer>
		  <reporter>${reporter}</reporter>
		  <processor>${processor}</processor>
		  <serviceteam>${serviceteam}</serviceteam>
		  <status>${status}</status>
		  <priority>${priority}</priority>
		  <createdon>${createdon}</createdon>
		  <firstresponse>${firstresponse}</firstresponse>
		  <endedon>${endedon}</endedon>
	   </ehsm:MT_ehsm_incidentcreate_req>
	</soapenv:Body>
 </soapenv:Envelope>`;

 console.log("Postdata:",postData);
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log("data",data);
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_ehsm_incidentcreate_res'];
			console.log("The response from sap is:",resp);
			res.send({
				Status: resp['Status']['_text'],
				
			})
			console.log("status response is:",resp['Status']['_text']);
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});

//Shop floor Portal


//------------------------------------ SHOP FLOOR PORTAL---------------------------------//
//Validating the credentials data from SAP Ztable ZTA_MTN_AUTH

//login 
app.post('/shopfloorlogin', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_MLogin&receiverParty=&receiverService=&interface=SI_OUT_MLogin_req&interfaceNamespace=http://crimson-fern.com/maintenance',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	
	
	const Shop_username = req.body.email;
	const Shop_password = req.body.password;
	console.log(Shop_username);
	console.log(Shop_password);
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:main="http://crimson-fern.com/maintenance">
	<soapenv:Header/>
	<soapenv:Body>
	   <main:MT_MLogin_req>
		  <Username>${Shop_username}</Username>
		  <Password>${Shop_password}</Password>
	   </main:MT_MLogin_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];
		
		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			console.log("trial5",xml);
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_MLogin_res'];
			console.log(resp);
			let token;
			if(resp['Status']['_text']==='1 '){
				// login sucess
				token = jwt.sign({
                    id:'1639',
                    email: 'Shop@gmail.com'
                }, 'siva', {
                    expiresIn: 604800
                });
			} else {
				token = null;
			}
			res.send({
				Status: resp['Status']['_text'],
				token: token,
				username: req.body.email
			});
			
		});

		res1.on("error", function (error) {
			console.error('probably SAP is not working',error);
			
		});
	});

	req1.write(postData);

	req1.end();
});



//planned display

app.post('/planneddisp', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_ShopfloorPortal&receiverParty=&receiverService=&interface=SI_OUT_shop_planned_req&interfaceNamespace=http://crimson-fern.com/shopfloor',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const eng_id = req.body.engID;
	console.log(eng_id);
	
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:shop="http://crimson-fern.com/shopfloor">
	<soapenv:Header/>
	<soapenv:Body>
	   <shop:MT_shop_planned_req>
		  <eng_id>${eng_id}</eng_id>
 
	   </shop:MT_shop_planned_req>
	</soapenv:Body>
 </soapenv:Envelope>`
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log('recieved from Soap',data);
			const resp = JSON.parse(data)['SOAP:Envelope'];
			console.log('Parsing data: ',resp);
			var planneddisplay = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_shop_planned_res']['plans'];
			console.log("final parsing: ",planneddisplay);
			res.send({
				planneddisplay : planneddisplay,
				
			});
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});






//planned edit
//wsdl to be updated>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

app.post('/plannededit', (req, res) => {
	console.log('received token is : ', req.headers.token);

	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_ShopfloorPortal&receiverParty=&receiverService=&interface=SI_OUT_shop_plannededit_req&interfaceNamespace=http://crimson-fern.com/shopfloor',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	
	const eng_id = req.body.engID;
	const porder_id = req.body.porder_id;
	const material_id = req.body.material_id;
	const materialname = req.body.materialname;
	const plant = req.body.plant;
	const mrp = req.body.mrp;
	const orderstart = req.body.orderstart;
	const orderfinish = req.body.orderfinish;
	const plndopen = req.body.plndopen;
	const quantity = req.body.quantity;
	

	
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:shop="http://crimson-fern.com/shopfloor">
	<soapenv:Header/>
	<soapenv:Body>
	   <shop:MT_shop_plannedcreate_req>
		  <eng_id>${eng_id}</eng_id>
		  <porder_id>${porder_id}</porder_id>
		  <material_id>${material_id}</material_id>
		  <materialname>${materialname}</materialname>
		  <plant>${plant}</plant>
		  <mrp>${mrp}</mrp>
		  <orderstart>${orderstart}</orderstart>
		  <orderfinish>${orderfinish}</orderfinish>
		  <plndopen>${plndopen}</plndopen>
		  <quantity>${quantity}</quantity>
	   </shop:MT_shop_plannedcreate_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log(xml);
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_shop_plannedcreate_res'];
			res.send({
				Status: resp['Status']['_text'],
				
			})
			console.log("status response is:",resp['Status']['_text']);
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});

// planned create

app.post('/plannedcreate', (req, res) => {
	console.log('received token is : ', req.headers.token);

	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_ShopfloorPortal&receiverParty=&receiverService=&interface=SI_OUT_shop_plannedcreate_req&interfaceNamespace=http://crimson-fern.com/shopfloor',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	
	const eng_id = req.body.engID;
	const porder_id = req.body.porder_id;
	const material_id = req.body.material_id;
	const materialname = req.body.materialname;
	const plant = req.body.plant;
	const mrp = req.body.mrp;
	const orderstart = req.body.orderstart;
	const orderfinish = req.body.orderfinish;
	const plndopen = req.body.plndopen;
	const quantity = req.body.quantity;
	

	
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:shop="http://crimson-fern.com/shopfloor">
	<soapenv:Header/>
	<soapenv:Body>
	   <shop:MT_shop_plannedcreate_req>
		  <eng_id>${eng_id}</eng_id>
		  <porder_id>${porder_id}</porder_id>
		  <material_id>${material_id}</material_id>
		  <materialname>${materialname}</materialname>
		  <plant>${plant}</plant>
		  <mrp>${mrp}</mrp>
		  <orderstart>${orderstart}</orderstart>
		  <orderfinish>${orderfinish}</orderfinish>
		  <plndopen>${plndopen}</plndopen>
		  <quantity>${quantity}</quantity>
	   </shop:MT_shop_plannedcreate_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log(xml);
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_shop_plannedcreate_res'];
			res.send({
				Status: resp['Status']['_text'],
				
			})
			console.log("status response is:",resp['Status']['_text']);
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});


//planned disp2 (1------1)

app.post('/planneddisp2', (req, res) => {
	console.log('received token is : ', req.headers.token);

	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_ShopfloorPortal&receiverParty=&receiverService=&interface=SI_OUT_shop_planned_req&interfaceNamespace=http://crimson-fern.com/shopfloor',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const porder_id = req.body.porder_id;
	const eng_id = req.body.engID;
	

	
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ehsm="http://crimson-fern.com/shopfloor">
	<soapenv:Header/>
	<soapenv:Body>
	   <ehsm:MT_shop_planned_req>
		  <eng_id>${eng_id}</eng_id>
		  <porder_id>${porder_id}</porder_id>
	   </ehsm:MT_shop_planned_req>
	</soapenv:Body>
 </soapenv:Envelope>`;

 console.log("Postdata:",postData);
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log("data",data);
			const resp = JSON.parse(data)['SOAP:Envelope'];
			console.log('Parsing data: ',resp);
			var plannedfilter = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_shop_planned_res']['plans'];
			console.log("final parsing: ",plannedfilter);
			res.send({
				porder_id: plannedfilter['porder_id']['_text'],
				material_id:  plannedfilter['material_id']['_text'],
				materialname:  plannedfilter['materialname']['_text'],
				plant:  plannedfilter['plant']['_text'],
				mrp:  plannedfilter['mrp']['_text'],
				orderstart:  plannedfilter['orderstart']['_text'],
				orderfinish:  plannedfilter['orderfinish']['_text'],
				plndopen:  plannedfilter['plndopen']['_text'],
				quantity:  plannedfilter['quantity']['_text'],
				
				
			})
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});

//production order


//<<<<<<<<<<<< Production order >>>>>>>>>>>>>>>//

//Production order display from table ZTA_PRODORDER


app.post('/productiondisp', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_ShopfloorPortal2&receiverParty=&receiverService=&interface=SI_OUT_shop_prod_req&interfaceNamespace=http://crimson-fern.com/shopfloor',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const eng_id = req.body.engID;
	console.log(eng_id);
	
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:shop="http://crimson-fern.com/shopfloor">
	<soapenv:Header/>
	<soapenv:Body>
	   <shop:MT_shop_prod_req>
		  <eng_id>${eng_id}</eng_id>
	   </shop:MT_shop_prod_req>
	</soapenv:Body>
 </soapenv:Envelope>`
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log('recieved from Soap',data);
			const resp = JSON.parse(data)['SOAP:Envelope'];
			console.log('Parsing data: ',resp);
			var proddisplay = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_shop_prod_res']['prod'];
			console.log("final parsing: ",proddisplay);
			res.send({
				proddisplay : proddisplay,
				
			});
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});

//prod disp2 1..1
app.post('/productiondisp2', (req, res) => {
	console.log('received token is : ', req.headers.token);

	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_ShopfloorPortal2&receiverParty=&receiverService=&interface=SI_OUT_shop_prod_req&interfaceNamespace=http://crimson-fern.com/shopfloor',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const prodorder_id = req.body.prodorder_id;
	const eng_id = req.body.engID;
	

	
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:shop="http://crimson-fern.com/shopfloor">
	<soapenv:Header/>
	<soapenv:Body>
	   <shop:MT_shop_prod_req>
		  <eng_id>${eng_id}</eng_id>
		  <prodorder_id>${prodorder_id}</prodorder_id>
	   </shop:MT_shop_prod_req>
	</soapenv:Body>
 </soapenv:Envelope>`;

 console.log("Postdata:",postData);
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log("data",data);
			const resp = JSON.parse(data)['SOAP:Envelope'];
			console.log('Parsing data: ',resp);
			var prodfilter = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_shop_prod_res']['prod'];
			console.log("final parsing: ",prodfilter);
			res.send({
				prodorder_id: prodfilter['prodorder_id']['_text'],
				material_id:  prodfilter['material_id']['_text'],
				materialname:  prodfilter['materialname']['_text'],
				plant:  prodfilter['plant']['_text'],
				status:  prodfilter['status']['_text'],
				quantity:  prodfilter['quantity']['_text'],
				
				
			})
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});


// prod order creation from table ZTA_prodORDER

app.post('/prodcreate', (req, res) => {
	console.log('received token is : ', req.headers.token);

	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_ShopfloorPortal2&receiverParty=&receiverService=&interface=SI_OUT_shop_prodcreate_req&interfaceNamespace=http://crimson-fern.com/shopfloor',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	
	const eng_id = req.body.engID;
	const prodorder_id = req.body.prodorder_id;
	const material_id = req.body.material_id;
	const materialname = req.body.materialname;
	const plant = req.body.plant;
	const status = req.body.status;
	const quantity = req.body.quantity;


	
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:shop="http://crimson-fern.com/shopfloor">
	<soapenv:Header/>
	<soapenv:Body>
	   <shop:MT_shop_prodcreate_req>
		  <eng_id>${eng_id}</eng_id>
		  <prodorder_id>${prodorder_id}</prodorder_id>
		  <material_id>${material_id}</material_id>
		  <materialname>${materialname}</materialname>
		  <status>${status}</status> 
		  <plant>${plant}</plant>
		  <quantity>${quantity}</quantity>
	   </shop:MT_shop_prodcreate_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log(xml);
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_shop_prodcreate_res'];
			res.send({
				Status: resp['Status']['_text'],
				
			})
			console.log("status response is:",resp['Status']['_text']);
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});


// prod order updation from table ZTA_prodORDER

app.post('/prodedit', (req, res) => {
	console.log('received token is : ', req.headers.token);

	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_ShopfloorPortal2&receiverParty=&receiverService=&interface=SI_OUT_shop_prodedit_req&interfaceNamespace=http://crimson-fern.com/shopfloor',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	
	const eng_id = req.body.engID;
	const prodorder_id = req.body.prodorder_id;
	const material_id = req.body.material_id;
	const materialname = req.body.materialname;
	const plant = req.body.plant;
	const status = req.body.status;
	const quantity = req.body.quantity;



	
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:shop="http://crimson-fern.com/shopfloor">
	<soapenv:Header/>
	<soapenv:Body>
	   <shop:MT_shop_prodcreate_req>
		  <eng_id>${eng_id}</eng_id>
		  <prodorder_id>${prodorder_id}</prodorder_id>
		  <material_id>${material_id}</material_id>
		  <materialname>${materialname}</materialname>
		  <status>${status}</status> 
		  <plant>${plant}</plant>
		  <quantity>${quantity}</quantity>
	   </shop:MT_shop_prodcreate_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log(xml);
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_shop_prodcreate_res'];
			res.send({
				Status: resp['Status']['_text'],
				
			})
			console.log("status response is:",resp['Status']['_text']);
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});



//--------------------------------END OF SHOP FLOOR PORTAL--------------------------------//

//login
//Validating the credentials data from SAP Ztable ZTA_MTN_AUTH


app.post('/Maintenancelogin', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_MLogin&receiverParty=&receiverService=&interface=SI_OUT_MLogin_req&interfaceNamespace=http://crimson-fern.com/maintenance',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	
	
	const Mtn_username = req.body.email;
	const Mtn_password = req.body.password;
	console.log(Mtn_username);
	console.log(Mtn_password);
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:main="http://crimson-fern.com/maintenance">
	<soapenv:Header/>
	<soapenv:Body>
	   <main:MT_MLogin_req>
		  <Username>${Mtn_username}</Username>
		  <Password>${Mtn_password}</Password>
	   </main:MT_MLogin_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];
		
		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			console.log("trial5",xml);
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_MLogin_res'];
			console.log(resp);
			let token;
			if(resp['Status']['_text']==='1 '){
				// login sucess
				token = jwt.sign({
                    id:'1632',
                    email: 'maintenance@gmail.com'
                }, 'siva', {
                    expiresIn: 604800
                });
			} else {
				token = null;
			}
			res.send({
				Status: resp['Status']['_text'],
				token: token,
				username: req.body.email
			});
			
		});

		res1.on("error", function (error) {
			console.error('probably SAP is not working',error);
			
		});
	});

	req1.write(postData);

	req1.end();
});

//Maintainance Portal
//Workorder display from table ZMAINTENANCE_TAB




app.post('/workorderdisp', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_MAINTENANCE&receiverParty=&receiverService=&interface=SI_OPENWO_REQ&interfaceNamespace=http://maintainenceportal.com/all',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const eng_id = req.body.engID;
	const WO_TYPE =req.body.WO_TYPE;
	console.log(eng_id);
	
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:all="http://maintainenceportal.com/all">
	<soapenv:Header/>
	<soapenv:Body>
	   <all:MT_OPENWO_REQ>
		  <MID>${eng_id}</MID>
		  <WO_TYPE>${WO_TYPE}</WO_TYPE>
	   </all:MT_OPENWO_REQ>
	</soapenv:Body>
 </soapenv:Envelope>`

	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log('recieved from Soap',data);
			const resp = JSON.parse(data)['SOAP:Envelope'];
			console.log('Parsing data: ',resp);
			var wodisplay = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_OPENWO_RES']['OPEN_WO'];
			console.log("final parsing: ",wodisplay);
			res.send({
				wodisplay : wodisplay,
				
			});
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});
 
//work order disp 2 for 1 to 1 edit
//workorder disp2 1..1
app.post('/workorderdisp2', (req, res) => {
	console.log('received token is : ', req.headers.token);

	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_MAINTENANCE&receiverParty=&receiverService=&interface=SI_DISPLAYWO_REQ&interfaceNamespace=http://maintainenceportal.com/all',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	
	const eng_id = req.body.engID;
	const WO_ID = req.body.WO_ID;

	
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:all="http://maintainenceportal.com/all">
	<soapenv:Header/>
	<soapenv:Body>
	   <all:MT_DISPLAYWO_REQ>
		  <MID>${eng_id}</MID>
		  <WO_ID>${WO_ID}</WO_ID>
	   </all:MT_DISPLAYWO_REQ>
	</soapenv:Body>
 </soapenv:Envelope>`;

 console.log("Postdata:",postData);
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log("data",data);
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_DISPLAYWO_RES'];
			console.log("final parsing: ",resp);
			res.send({
				eng_id: resp['MID']['_text'],
				WO_NAME:  resp['WO_NAME']['_text'],
				INSTRUCTIONS:  resp['INSTRUCTIONS']['_text'],
				DUE_DATE:  resp['DUE_DATE']['_text'],
				PRIORITY:  resp['PRIORITY']['_text'],
				SEND_TO:  resp['SEND_TO']['_text'],
				WO_TYPE:  resp['WO_TYPE']['_text'],
				WO_ID:  resp['WO_ID']['_text'],
				
			})
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});



// Workorder creation from table ZMAINTENANCE_TAB

app.post('/workordercreate', (req, res) => {
	console.log('received token is : ', req.headers.token);

	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_MAINTENANCE&receiverParty=&receiverService=&interface=SI_INSERTWO_REQ&interfaceNamespace=http://maintainenceportal.com/all',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	
	const eng_id = req.body.engID;
	const WO_ID = req.body.WO_ID;
	const WO_TYPE = req.body.WO_TYPE;
	const SEND_TO = req.body.SEND_TO;
	const PRIORITY = req.body.PRIORITY;
	const DUE_DATE = req.body.DUE_DATE;
	const INSTRUCTIONS = req.body.INSTRUCTIONS;
	const WO_NAME = req.body.WO_NAME;

	
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:all="http://maintainenceportal.com/all">
	<soapenv:Header/>
	<soapenv:Body>
	   <all:MT_INSERTWO_REQ>
		  <WO_NAME>${WO_NAME}</WO_NAME>
		  <INSTRUCTIONS>${INSTRUCTIONS}</INSTRUCTIONS>
		  <DUE_DATE>${DUE_DATE}</DUE_DATE>
		  <PRIORITY>${PRIORITY}</PRIORITY>
		  <SEND_TO>${SEND_TO}</SEND_TO>
		  <MID>${eng_id}</MID>
		  <WO_TYPE>${WO_TYPE}</WO_TYPE>
		  <WO_ID>${WO_ID}</WO_ID>
	   </all:MT_INSERTWO_REQ>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log(xml);
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_INSERTWO_RES'];
			res.send({
				Status: resp['STATUS_CODE']['_text'],
				
			})
			console.log("STATUS response is:",resp['STATUS_CODE']['_text']);
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});

//Work order edit from table ZMAINTENANCE_TAB



app.post('/workorderedit', (req, res) => {
	console.log('received token is : ', req.headers.token);

	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_MAINTENANCE&receiverParty=&receiverService=&interface=SI_EDITWO_REQ&interfaceNamespace=http://maintainenceportal.com/all',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	
	const eng_id = req.body.engID;
	const WO_ID = req.body.WO_ID;
	const WO_TYPE = req.body.WO_TYPE;
	const SEND_TO = req.body.SEND_TO;
	const PRIORITY = req.body.PRIORITY;
	const DUE_DATE = req.body.DUE_DATE;
	const INSTRUCTIONS = req.body.INSTRUCTIONS;
	const WO_NAME = req.body.WO_NAME;


	
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:all="http://maintainenceportal.com/all">
	<soapenv:Header/>
	<soapenv:Body>
	   <all:MT_EDITWO_REQ>
		  <WO_NAME>${WO_NAME}</WO_NAME>
		  <INSTRUCTIONS>${INSTRUCTIONS}</INSTRUCTIONS>
		  <DUE_DATE>${DUE_DATE}</DUE_DATE>
		  <PRIORITY>${PRIORITY}</PRIORITY>
		  <SEND_TO>${SEND_TO}</SEND_TO>
		  <MID>${eng_id}</MID>
		  <WO_TYPE>${WO_TYPE}</WO_TYPE>
		  <WO_ID>${WO_ID}</WO_ID>
	   </all:MT_EDITWO_REQ>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log(xml);
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_EDITWO_RES'];
			res.send({
				Status: resp['STATUS_CODE']['_text'],
				
			})
			console.log("status response is:",resp['STATUS_CODE']['_text']);
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});

//Vendor Portal
////--------------------------------------VENDOR PORTAL------------------------------------//
//Validating the credentials data from SAP Ztable ZTA_VEN_AUTH
//Function Module : ZFM_AUTH_VEN


app.post('/Vendorlogin', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VLogin&receiverParty=&receiverService=&interface=SI_OUT_VLogin_req&interfaceNamespace=http://crimson-fern.com/vendor',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	
	
	const Ven_username = req.body.email;
	const Ven_password = req.body.password;
	console.log(Ven_username);
	console.log(Ven_password);
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ven="http://crimson-fern.com/vendor">
	<soapenv:Header/>
	<soapenv:Body>
	   <ven:MT_VLogin_req>
		  <Username>${Ven_username}</Username>
		  <Password>${Ven_password}</Password>
	   </ven:MT_VLogin_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];
		
		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_VLogin_res'];
			console.log(resp);
			let token;
			
			if(resp['Status']['_text']==='1 '){
				// login sucess
				token = jwt.sign({
                    id:'1613',
                    email: 'Vendor@gmail.com'
                }, 'siva', {
                    expiresIn: 604800
                });
			} else {
				token = null;
			}

			res.send({
				Status: resp['Status']['_text'],
				token: token,
				username: req.body.email
			});
		});

		res1.on("error", function (error) {
			console.error('probably SAP is not working',error);
			
		});
	});

	req1.write(postData);

	req1.end();
});

//displaying the Vendor profile data from SAP Ztable ZTA_VEN_PROFILE


app.post('/vendorprofile', (req, res) => {
	console.log('received token is : ', req.headers.token);

	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VLogin&receiverParty=&receiverService=&interface=SI_OUT_VProfile_req&interfaceNamespace=http://crimson-fern.com/vendor',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const Ven_username = req.body.venID;
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ven="http://crimson-fern.com/vendor">
	<soapenv:Header/>
	<soapenv:Body>
	   <ven:MT_VProfile_req>
		  <Username>${Ven_username}</Username>
	   </ven:MT_VProfile_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_VProfile_res'];
			res.send({
				ven_name: resp['ven_name']['_text'],
				ven_email: resp['ven_email']['_text'],
				ven_phone: resp['ven_phone']['_text'],
				ven_city: resp['ven_city']['_text'],
				ven_country: resp['ven_country']['_text'],
				ven_pincode: resp['ven_pincode']['_text'],
				ven_state: resp['ven_state']['_text'],
				ven_address: resp['ven_address']['_text'],

				ven_pan: resp['ven_pan']['_text'],
				ven_gstin: resp['ven_gstin']['_text'],
				ven_entitytype: resp['ven_entitytype']['_text'],
				ven_regtype: resp['ven_regtype']['_text']
			});
		});

		res1.on("error", function (error) {
			console.error(error);
		});
	});

	req1.write(postData);

	req1.end();
});

//Updating the Vendor profile data from SAP Ztable ZTA_VEN_PROFILE

//FM_UPDATE_VPROFILE

app.post('/updatevendorprofile', (req, res) => {
	console.log('received token is : ', req.headers.token);

	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VLogin&receiverParty=&receiverService=&interface=SI_OUT_VUpdate_req&interfaceNamespace=http://crimson-fern.com/vendor',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const Ven_username = req.body.venID;
	console.log(Ven_username);
	const ven_name = req.body.ven_name;
	console.log(ven_name);
	const ven_email = req.body.ven_email;
	console.log(ven_email);
	const ven_phone = req.body.ven_phone;
	console.log(ven_phone);
	const ven_city = req.body.ven_city;
	console.log(ven_city);
	const ven_country = req.body.ven_country;
	console.log(ven_country);
	const ven_pincode = req.body.ven_pincode;
	console.log(ven_pincode);
	const ven_state = req.body.ven_state;
	console.log(ven_state);
	const ven_address = req.body.ven_address;
	console.log(ven_address);
	const ven_pan = req.body.ven_pan;
	console.log(ven_pan);
	const ven_gstin = req.body.ven_gstin;
	console.log(ven_gstin);
	const ven_entitytype = req.body.ven_entitytype;
	console.log(ven_entitytype);
	const ven_regtype = req.body.ven_regtype;
	console.log(ven_regtype);
	
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ven="http://crimson-fern.com/vendor">
	<soapenv:Header/>
	<soapenv:Body>
	   <ven:MT_VUpdate_req>
		  <user_name>${Ven_username}</user_name>
		  <ven_name>${ven_name}</ven_name>
		  <ven_phone>${ven_phone}</ven_phone>
		  <ven_email>${ven_email}</ven_email>
		  <ven_address>${ven_address}</ven_address>
		  <ven_city>${ven_city}</ven_city>
		  <ven_state>${ven_state}</ven_state>
		  <ven_country>${ven_country}</ven_country>
		  <ven_pincode>${ven_pincode}</ven_pincode>
		  <ven_pan>${ven_pan}</ven_pan>
		  <ven_gstin>${ven_gstin}</ven_gstin>
		  <ven_entitytype>${ven_entitytype}</ven_entitytype>
		  <ven_regtype>${ven_regtype}</ven_regtype>
	   </ven:MT_VUpdate_req>
	</soapenv:Body>
 </soapenv:Envelope>`;

 console.log(postData);
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			
			const body = Buffer.concat(chunks);
			// console.log(body);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log('line 237',data);
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_VUpdate_res'];
			console.log('line 237',resp);
			// console.log("status response is:",resp['status']['_text']);
			console.log('Status Response',resp);
			res.send({
				status: resp['Status']['_text'],
				// status: "1 ",
			})
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});

//displaying the Quotation details from SAP Ztable ZINQUIRY


app.post('/quotation', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VLogin&receiverParty=&receiverService=&interface=SI_OUT_vendor_quotation_req&interfaceNamespace=http://crimson-fern.com/vendor',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const venID = req.body.venID;
	console.log(venID);
	
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ven="http://crimson-fern.com/vendor">
	<soapenv:Header/>
	<soapenv:Body>
	   <ven:MT_vendor_quotation_req>
		  <vendor_id>${venID}</vendor_id>
	   </ven:MT_vendor_quotation_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log('recieved from Soap',data);
			const resp = JSON.parse(data)['SOAP:Envelope'];
			var quotationresponse = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_vendor_quotation_res']['quotation'];
			

			res.send({
				quotationresponse: quotationresponse
			});
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});

//credit memo for vendor
app.post('/creditvendor', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VLogin&receiverParty=&receiverService=&interface=SI_OUT_Vcreditmemo_req&interfaceNamespace=http://crimson-fern.com/vendor',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	//const InvID = req.body.CustID;
	//console.log(InvID);
	
	const venID = req.body.venID;
	console.log(venID);
	

	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ven="http://crimson-fern.com/vendor">
	<soapenv:Header/>
	<soapenv:Body>
	   <ven:MT_vendor_creditmemo_req>
		  <vendor_id>${venID}</vendor_id>
	   </ven:MT_vendor_creditmemo_req>
	</soapenv:Body>
 </soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});


		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			// console.log(xml);
			// var empdetails = data["SOAP:Envelope"]["SOAP:Body"]["ns0:MT_INVOICE_RES"];
			
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			// console.log('recieved from Soap',JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_Invoice_res']['Invoice']);
		
			const resp = JSON.parse(data)['SOAP:Envelope'];
			console.log(resp);
			var vendorcredit = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_vendor_creditmemo_res']['credit'];
			
			console.log(vendorcredit);

			
			res.send({
				vendorcredit: vendorcredit
				

				
			});
			
			
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();

});

//Purchase order display from table ZTA_PLANNEDORDER


app.post('/purchaseorder1', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VLogin&receiverParty=&receiverService=&interface=SI_OUT_Vpurchaseorder_req&interfaceNamespace=http://crimson-fern.com/vendor',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const eng_id = req.body.venID;
	console.log(eng_id);
	
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ven="http://crimson-fern.com/vendor">
	<soapenv:Header/>
	<soapenv:Body>
	   <ven:MT_vendor_purchaseorder_req>
		  <vendor_id>${eng_id}</vendor_id>
	   </ven:MT_vendor_purchaseorder_req>
	</soapenv:Body>
 </soapenv:Envelope>`
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log('recieved from Soap',data);
			const resp = JSON.parse(data)['SOAP:Envelope'];
			console.log('Parsing data: ',resp);
			var purchasedisplay = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_vendor_purchaseorder_res']['purchase'];
			console.log("final parsing: ",purchasedisplay);
			res.send({
				purchasedisplay : purchasedisplay,
				
			});
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});

//Goods receipt display from table ZTA_PRODORDER


app.post('/goodsreciept', (req, res) => {
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VLogin&receiverParty=&receiverService=&interface=SI_OUT_vendor_goods_req&interfaceNamespace=http://crimson-fern.com/vendor',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	
	const eng_id = req.body.venID;
	console.log(eng_id);
	
	
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ven="http://crimson-fern.com/vendor">
	<soapenv:Header/>
	<soapenv:Body>
	   <ven:MT_vendor_goods_req>
		  <vendor_id>${eng_id}</vendor_id>
	   </ven:MT_vendor_goods_req>
	</soapenv:Body>
 </soapenv:Envelope>`
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});



		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			console.log('recieved from Soap',data);
			const resp = JSON.parse(data)['SOAP:Envelope'];
			console.log('Parsing data: ',resp);
			var grdisplay = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_vendor_goods_res']['goods'];
			console.log("final parsing: ",grdisplay);
			res.send({
				grdisplay : grdisplay,
				
			});
		});

		res1.on("error", function (error) {
			console.error(error);
			
		});
	});

	req1.write(postData);

	req1.end();
});
//-------------------------------------END OF VENDOR PORTAL-----------------------------------//
 


app.listen(8000, () => {
	console.log('Reading on port ', 8000);
})



