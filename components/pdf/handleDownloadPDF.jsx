import jsPDF from "jspdf";
import { barcodeBase64, qrCodeBase64, paidStamp } from "../../public/base64Image";

function getDate(inputDate = null) {
  const date = inputDate ? new Date(inputDate) : new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString('default', { month: 'long' }); // Full month name
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

function getTime(inputTime = null) {
  const time = inputTime ? new Date(inputTime) : new Date();
  let hours = time.getHours();
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours || 12; // The hour '0' should be '12'
  const formattedHours = String(hours).padStart(2, "0");
  return `${formattedHours}:${minutes} ${ampm}`;
}

const handleDownloadPDF = (payment) => {
  const doc = new jsPDF();

  //doc.addImage('/public/logo.png', "JPEG", 20, 10, 40, 30); // Position (x, y), Width, Height

  doc.setFontSize(25);
  doc.text("SpecCare Ltd", 80, 20);

  doc.setFontSize(12);
  const locationText = "Dhaka Bangladesh, 1000";
  doc.text(locationText, 85, 30);

  doc.setFontSize(16);
  doc.text("Payment Slip", 105, 46);

  // Transaction details
  doc.setFontSize(12);
  doc.text("TrxID:" + payment.transactionId, 160, 20);

  // User Details
  doc.text("Payment Name", 20, 60);
  doc.text(String(payment.userName), 55, 60);
  doc.text("Topic", 20, 70);
  doc.text(String(payment.name), 55, 70);
  doc.text("Payment Date", 20, 80);
  doc.text(String(getDate(payment.date)), 55, 80);
  doc.text("Time", 20, 90);
  doc.text(String(getTime(payment.date)), 55, 90);

  doc.text("Total:", 20, 100);
  doc.text(String(payment.amount), 55, 100);

  doc.addImage(barcodeBase64, "JPEG", 155, 30, 50, 40); // Barcode image
  doc.addImage(qrCodeBase64, "JPEG", 148, 55, 55, 40); // QR code image
  doc.addImage(paidStamp, "JPEG", 80, 100, 60, 40); // Stamp image

  doc.save("fee-receipt.pdf");
};

export default handleDownloadPDF;
