export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <head>
          <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
          <title>ziva</title>
          <meta name="description" content="smartest email for founders" />
        </head>
        <body>
          <div id="root">{children}</div>
        </body>
      </html>
    )
  }