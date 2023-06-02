# File Sharing Website with WebRTC Connection

This is a simple file sharing website that allows users to upload files and share them with others using WebRTC connection. The website generates a unique link for each file uploaded, and when a user opens that link, a direct peer-to-peer connection is established between the uploader and downloader for secure and fast file transfer.

## Features

- Upload files and generate unique sharing links
- Direct peer-to-peer file transfer using WebRTC connection
- Real-time signaling using Firebase as a signaling server
- Progress bar to track file upload and download progress
- Simple and intuitive user interface

## Technologies Used

- HTML, CSS, JavaScript for frontend development
- Firebase for real-time signaling and hosting
- WebRTC for peer-to-peer communication
- Firebase Storage for file storage

## How It Works

1. Uploader selects a file to upload on the website.
2. The file is uploaded and details of the file store in the firebase storage , and a unique sharing link is generated.
3. The sharing link is displayed to the uploader.
4. The downloader opens the sharing link in their browser.
5. The downloader's browser establishes a WebRTC connection with the uploader's browser.
6. The downloader requests the file from the uploader using the WebRTC connection.
7. The uploader's browser sends the file to the downloader's browser via the WebRTC connection.
8. The file is downloaded and saved on the downloader's device.

## Installation

1. Clone this repository to your local machine.
2. Set up a Firebase project and enable Firebase Storage.
3. Replace the Firebase configuration in `.env` with your own Firebase configuration.
4. npm install && npm start

## Usage

1. Open the website in your browser.
2. Choose a file to upload using the file upload button.
3. After the file is uploaded, a unique sharing link will be generated.
4. Share the link with others who want to download the file.
5. When someone opens the sharing link, There will be a download button. Click the download button and download it.


## Acknowledgments

- The project is inspired by the need for secure and direct file sharing.
- Thanks to the contributors and open-source community for their valuable contributions.

## Contact

For any questions or inquiries, please contact [baphonreaz@gmail.com].
