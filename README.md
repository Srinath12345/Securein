Installation
Clone the repository:

git clone https://github.com/Srinath12345/Securein.git
Navigate to the backend directory:

cd backend
npm i 
npm start (will run on port number 3000)

Frontend Installation
Navigate to the frontend directory:

cd frontend
npm i

Start the React development server:
npm run dev

node cronjob.js (to update the database periodically (every 6 hour))


Usage
Once both the backend and frontend are up and running, you can interact with the CVE Management System via the web browser:

CVE List Page
View a paginated list of CVEs fetched from the NVD.
Filter CVEs by year, CVSS score, and last modified date.
Click on a CVE entry to view its detailed information.
CVE Detail Page
View detailed information about a selected CVE, including:
Description
CVSS metrics (base score and vector string)
CPE (Common Platform Enumeration) data indicating the affected software/hardware.


output :
CVE List Table

![image](https://github.com/user-attachments/assets/2103ed66-022b-4a9e-b268-6705e63d9d87)

Filter Options Provided

![image](https://github.com/user-attachments/assets/6333fda7-d33b-486a-a3f1-30662880f402)

Search Bar Provided to Filter be CVE-ID

![image](https://github.com/user-attachments/assets/d8ef1ced-29f4-4fa1-b8c5-3d38d0803aaf)

CVE Details

![image](https://github.com/user-attachments/assets/d31fb28d-418b-433c-a75c-5cd0726ec0a1)




