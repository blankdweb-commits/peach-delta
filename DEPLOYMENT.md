# Peach App Deployment Guide (cPanel)

This guide explains how to deploy the Peach React application to a cPanel hosting environment (Apache).

## Prerequisites

1.  **Node.js & npm**: Installed on your local development machine.
2.  **cPanel Access**: Access to File Manager or FTP.
3.  **Supabase Project**: A configured Supabase project (URL and Key).

## Step 1: Configure Environment

1.  Open `.env` in the root directory.
2.  Update the Supabase credentials:
    ```env
    REACT_APP_SUPABASE_URL=https://your-project.supabase.co
    REACT_APP_SUPABASE_KEY=your-anon-key
    REACT_APP_ADMIN_PASSWORD=your-admin-password
    REACT_APP_USE_SUPABASE=true
    ```
    *Note: For cPanel, ensure variables start with `REACT_APP_` so they are embedded during the build process.*

## Step 2: Build the Application

Run the build command locally:

```bash
npm run build
```

This creates a `build` folder containing optimized HTML, CSS, and JS files.

## Step 3: Configure .htaccess (Routing)

Since this is a Single Page Application (SPA) using React Router, you must configure the server to redirect all requests to `index.html`.

1.  Create a file named `.htaccess` inside the `build` folder (or create it manually on cPanel).
2.  Add the following content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

## Step 4: Upload to cPanel

1.  Log in to cPanel.
2.  Open **File Manager**.
3.  Navigate to `public_html` (or the subdomain folder).
4.  Upload the **contents** of your local `build` folder (including `index.html`, `static/`, and `.htaccess`).
    *   *Tip: Zip the contents of `build`, upload the zip, and extract it on the server.*

## Step 5: Database Setup

1.  Go to your Supabase project dashboard -> **SQL Editor**.
2.  Copy the contents of `schema.sql` from this repository.
3.  Run the query to set up tables and security policies.

## Troubleshooting

*   **White Screen / 404**: Ensure `.htaccess` is present and correct.
*   **API Errors**: Check the console. If Supabase fails, verify the URL/Key in the build (inspect the network tab).
*   **Permissions**: Ensure folder permissions are 755 and file permissions are 644 in File Manager.
