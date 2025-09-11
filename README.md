# PDF Extraction Dashboard

## Overview

**PDF Extraction Dashboard** is an AI-driven web application for extracting, processing, and editing invoice data directly from PDF files. It streamlines manual invoice data entry by converting unstructured PDFs into structured, machine-readable formats for easy editing and integration.

***

## Features

- **AI-Powered Invoice Extraction:** Automatically identify, extract, and structure invoice data (invoice number, dates, line items, totals) from PDF invoices using advanced AI models.
- **Invoice Editing Interface:** Edit extracted invoice fields and line items with a user-friendly dashboard.
- **Export Capabilities:** Download extracted and edited data into standard formats (JSON, XML) for further processing.
- **Error Reduction:** Reduce manual data entry effort and errors by leveraging intelligent extraction and enrichment.

***

## Technologies

TECH STACK : HTML, CSS(TAILWIND), JS(NEXT.JS), SHAD/CN COMPONENTS, PDF.JS, EXPRESS.JS, MONGODB, GEMINI_API 

| Language     | Usage                          |
|--------------|-------------------------------|
| TypeScript   | Frontend and backend logic [1] |
| CSS tailwind | Styling and UI                |
| JavaScript   | Additional frontend utilities |

***

## Getting Started

### Prerequisites

- Node.js (Latest LTS)
- Package Manager (NPM or Yarn)

### Installation

```bash
git clone https://github.com/shysai/pdf-extraction-dashboard.git
cd pdf-extraction-dashboard
npm install
```

### Running the App

```bash
cd apps/api
cd apps.web
npm run dev(each for the above folders) 
```
- Access the dashboard in your browser at `http://localhost:3000`.

***

## Usage

1. **Upload Invoice PDF**: Drag and drop or select an invoice PDF in the dashboard.
2. **Automatic Extraction**: The app uses AI to parse and extract key invoice fields and line items.
3. **Review & Edit**: Inspect extracted data and make adjustments as needed within the dashboard. And perform CRUD operations on either newly extracted invoice or already exisitng invoices

***

## Contributing

Feel free to fork the repository, open issues, or submit pull requests to improve AI extraction accuracy, add features, or fix bugs.

***

## License

This project is published under the MIT License.

***

## Contact

For issues, feature requests, or support, please open a GitHub issue or contact the repository maintainer through GitHub.

***

**PDF Extraction Dashboard**—take control of your invoice processing with AI efficiency![2][3][1]


NOTE : THE WEB APP WILL BE SHORTLY BE DEPLOYED ON VERCEL
---
