# React + Vite

# BillBuddy

BillBuddy is a web application that simplifies expense management among friends, similar to Splitwise. Built with Vite and React and using Firebase as the database, this app provides an efficient way to track and manage shared expenses.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Dependencies](#dependencies)

## Description

BillBuddy is a fast and user-friendly web application designed to help users manage shared expenses effortlessly. It provides the following features:

- **User Authentication:** Secure user registration and login system.
- **Expense Management:** Create and manage equal and unequal expenses.
- **Expense Overview:** View all expenses and their details.
- **Debt Settlement:** Easily settle outstanding debt expenses.
- **Protected Routing:** Ensure secure access to user accounts.
  
## Features

- **User Authentication:** BillBuddy includes a robust user registration and login system. Users can create accounts with their email and password, providing a secure environment for managing expenses.

- **Expense Management:** Users can create two types of expenses:
  - **Equal Expense:** Create an expense where everyone pays the same amount.
  - **Unequal Expense:** Create an expense with different contribution amounts from each user.

- **Expense Overview:** BillBuddy allows users to view and manage all expenses they've created or have been involved in. This overview helps users keep track of their financial activity.

- **Debt Settlement:** The app simplifies the process of settling outstanding debt expenses, making it easier for friends to square up.

- **Protected Routing:** To ensure data privacy and security, BillBuddy features protected routing. Users can log in and access their accounts with confidence.

## Installation

To run BillBuddy locally, follow these steps:

1. Clone the repository to your local machine:
   git clone https://github.com/your-username/billbuddy.git
2. cd splitwise
3. npm install
4. Set up Firebase:
   -Create a Firebase project at https://console.firebase.google.com/.
   -Add a web app to your Firebase project and obtain your Firebase configuration (apiKey, authDomain, projectId, etc.).
   -Create a .env file in the project root and add your Firebase configuration as env.sample file have
5. Start the development server: npm run dev
6. Open your browser and visit http://localhost:5173 to use BillBuddy locally.

## Usage
To make the most of BillBuddy, follow these steps:

1. Sign Up: Create an account with your email and password.
2. Log In: Log in to your account if you already have one.
3. Create Expenses:
     -Equal Expense: Create an expense where everyone pays the same amount.
     -Unequal Expense: Create an expense with different contribution amounts from each user.
4. View Expenses: Check all expenses you've created or have been involved in.
5. Settle Debts: Settle outstanding debt expenses with ease.
6. Log Out: Sign out of your account when you're done.

## Dependencies
BillBuddy relies on the following dependencies:

1. Bootstrap (^5.3.1): A popular CSS framework for creating responsive and stylish web interfaces.
2. dotenv (^16.3.1): Loads environment variables from a .env file into process.env.
3. Firebase (^10.1.0): A comprehensive platform for building web and mobile applications, including authentication and cloud services.
4. React (^18.2.0): A JavaScript library for building user interfaces.
5. react-dom (^18.2.0): Provides DOM-specific methods for React.
react-router-dom (^6.15.0): Declarative routing for React applications.
6. react-toastify (^9.1.3): A notification library for React.

You can install these dependencies using npm:
    -npm install bootstrap dotenv firebase react react-dom react-router-dom react-toastify

## Authors
For any questions or feedback, please contact:
- [@khunshan](https://github.com/Khunshan07)
- Name: Khunshan Shahid (khunshan.intern@devsinc.com)
- Project Repository: (https://github.com/Khunshan07/SplitWise)