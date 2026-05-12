## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download) (or newer)
- [Node.js](https://nodejs.org/) (v18+)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) or LocalDB

### 1. Clone the Repository
```bash
git clone https://github.com/Babiboyy55/Lumiere-Stay.git
cd Lumiere-Stay
```

### 2. Backend Setup
```bash
cd BE-Project
# Open Lumiere.sln in Visual Studio or restore packages via CLI:
dotnet restore

# Update the connection string in `appsettings.json` to point to your local SQL Server instance.

# Run Entity Framework Migrations to set up the database
dotnet ef database update

# Start the API server
dotnet run
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd Frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

---
