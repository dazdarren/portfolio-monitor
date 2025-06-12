# Portfolio Monitor

A modern portfolio monitoring application that helps you track your net worth across all your financial accounts. Similar to Kubera, this app provides a comprehensive view of your financial health with daily email summaries.

## Features

- 🔐 Secure account connections to major financial institutions
- 💰 Support for multiple account types:
  - Bank accounts
  - Brokerage accounts
  - Investment accounts
  - Cryptocurrency wallets
  - Real estate assets
  - Other assets and liabilities
- 📊 Real-time portfolio tracking
- 📈 Historical performance analysis
- 📧 Daily email summaries
- 🔔 Customizable alerts and notifications
- 📱 Responsive design for all devices

## Tech Stack

- Frontend: React with Material-UI
- Backend: Node.js/Express
- Database: PostgreSQL
- Authentication: JWT
- Financial Data: Plaid API
- Email: SendGrid
- Deployment: Docker

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- Plaid API credentials
- SendGrid API key

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd portfolio-monitor
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   ```bash
   # In server directory
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. Start the development servers:
   ```bash
   # Start backend (from server directory)
   npm run dev

   # Start frontend (from client directory)
   npm start
   ```

## Project Structure

```
portfolio-monitor/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   └── public/           # Static files
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   └── services/     # Business logic
│   └── config/           # Configuration files
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 