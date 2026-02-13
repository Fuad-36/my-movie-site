# 🎬 Movie Discovery App

A modern movie discovery web application built with **React** that fetches real-time movie data from the **TMDB (The Movie Database) API**.

The application allows users to explore movies, search efficiently with optimized performance, view dynamically generated trending content, and navigate large datasets using a scalable pagination system.

---

## 🚀 Features

### 🔍 Smart Movie Search
- Integrated with TMDB API for real-time movie data
- Implemented **debounced search optimization** to reduce unnecessary API calls
- Improves performance and enhances user experience

### 🎥 Browse All Movies
- Displays a list of popular and discoverable movies
- Clean and responsive UI
- Dynamic rendering of movie posters, titles, and details

### 📄 Advanced Pagination System
- Implemented dynamic pagination for:
  - All movies
  - Queried (searched) movies
- Displays page numbers with smart truncation (`...`) for large page counts
- Handles thousands of pages efficiently
- Scalable design that supports extremely large datasets
- Responsive and compact UI for better usability

### 🔥 Trending Movies Section
- Tracks most searched movies
- Dynamically displays trending content
- Reflects real user interaction patterns

---

## ⚡ Performance Optimization

- Implemented **Debouncing** to:
  - Minimize redundant API requests
  - Improve responsiveness
  - Optimize network usage

- Efficient state management and conditional rendering for smooth UI updates
- Pagination logic designed to prevent unnecessary re-renders

---

## 🛠 Tech Stack

- **Frontend:** React  
- **API:** TMDB API  
- **Backend Service:** Appwrite  
- **Deployment:** Vercel  

---

## 🌐 Live Demo

👉 [View Live Project](https://my-movie-site-topaz.vercel.app/)

---

## 📌 What I Learned

- Working with third-party REST APIs
- Implementing debouncing for performance optimization
- Designing scalable pagination systems
- Managing dynamic state updates in React
- Building reusable and maintainable UI components
- Handling asynchronous data fetching efficiently
