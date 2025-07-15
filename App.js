Creating a full-stack blog application with React for the frontend, Node.js for the backend, and Supabase for the database requires several steps. Below is an outline of how you can set up each part of the stack, with some example code snippets.

### Frontend: React

1. **Set Up React Application**

   Use `create-react-app` to bootstrap your application.

   ```bash
   npx create-react-app blog-frontend
   cd blog-frontend
   ```

2. **Install Axios**

   You will use Axios to make HTTP requests to your Node.js backend.

   ```bash
   npm install axios
   ```

3. **Create Basic Components**

   Create components for listing posts, showing individual posts, and a form to create new posts.

   - **PostList.js**

     ```jsx
     import React, { useEffect, useState } from 'react';
     import axios from 'axios';

     function PostList() {
       const [posts, setPosts] = useState([]);

       useEffect(() => {
         axios.get('/api/posts').then(response => {
           setPosts(response.data);
         });
       }, []);

       return (
         <div>
           <h1>Blog Posts</h1>
           <ul>
             {posts.map(post => (
               <li key={post.id}>{post.title}</li>
             ))}
           </ul>
         </div>
       );
     }

     export default PostList;
     ```

   - **Post.js**

     ```jsx
     import React, { useState, useEffect } from 'react';
     import axios from 'axios';
     import { useParams } from 'react-router-dom';

     function Post() {
       const { id } = useParams();
       const [post, setPost] = useState(null);

       useEffect(() => {
         axios.get(`/api/posts/${id}`).then(response => {
           setPost(response.data);
         });
       }, [id]);

       if (!post) return <p>Loading...</p>;

       return (
         <div>
           <h1>{post.title}</h1>
           <p>{post.content}</p>
         </div>
       );
     }

     export default Post;
     ```

   - **NewPost.js**

     ```jsx
     import React, { useState } from 'react';
     import axios from 'axios';

     function NewPost() {
       const [title, setTitle] = useState('');
       const [content, setContent] = useState('');

       const handleSubmit = async (e) => {
         e.preventDefault();
         await axios.post('/api/posts', { title, content });
         setTitle('');
         setContent('');
       };

       return (
         <form onSubmit={handleSubmit}>
           <h1>Create New Post</h1>
           <input
             type="text"
             placeholder="Title"
             value={title}
             onChange={e => setTitle(e.target.value)}
           />
           <textarea
             placeholder="Content"
             value={content}
             onChange={e => setContent(e.target.value)}
           />
           <button type="submit">Submit</button>
         </form>
       );
     }

     export default NewPost;
     ```

4. **Handle Routing**

   Install `react-router-dom` for routing between components.

   ```bash
   npm install react-router-dom
   ```

   - **App.js**

     ```jsx
     import React from 'react';
     import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
     import PostList from './PostList';
     import Post from './Post';
     import NewPost from './NewPost';

     function App() {
       return (
         <Router>
           <Switch>
             <Route path="/" exact component={PostList} />
             <Route path="/posts/new" component={NewPost} />
             <Route path="/posts/:id" component={Post} />
           </Switch>
         </Router>
       );
     }

     export default App;
     ```

### Backend: Node.js

1. **Set Up Node.js Application**

   Create a new directory for your backend application and initialize a new Node.js project.

   ```bash
   mkdir blog-backend
   cd blog-backend
   npm init -y
   ```

2. **Install Express and Other Dependencies**

   ```bash
   npm install express cors supabase-js
   ```

3. **Create Express Server**

   - **server.js**

     ```javascript
     const express = require('express');
     const cors = require('cors');
     const { createClient } = require('@supabase/supabase-js');

     const supabaseUrl = 'https://your-supabase-url.supabase.co';
     const supabaseKey = 'your-supabase-anon-key';
     const supabase = createClient(supabaseUrl, supabaseKey);

     const app = express();

     app.use(cors());
     app.use(express.json());

     app.get('/api/posts', async (req, res) => {
       const { data: posts, error } = await supabase.from('posts').select('*');
       if (error) res.status(500).send(error.message);
       else res.json(posts);
     });

     app.get('/api/posts/:id', async (req, res) => {
       const { id } = req.params;
       const { data: post, error } = await supabase.from('posts').select('*').eq('id', id).single();
       if (error) res.status(500).send(error.message);
       else res.json(post);
     });

     app.post('/api/posts', async (req, res) => {
       const { title, content } = req.body;
       const { data, error } = await supabase.from('posts').insert([{ title, content }]);
       if (error) res.status(500).send(error.message);
       else res.status(201).json(data);
     });

     const PORT = process.env.PORT || 5000;
     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
     ```

### Database: Supabase

1. **Set Up Supabase**

   - Go to the [Supabase website](https://supabase.io/), and sign in or sign up.
   - Create a new project.
   - Get your Supabase URL and `anon` key from the API settings.

2. **Database Schema**

   Use Supabase SQL Editor to create a simple table schema for storing blog posts.

   ```sql
   create table posts (
     id bigint generated by default as identity primary key,
     title text not null,
     content text not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   ```

### Running the Application

1. **Start the Backend Server**

   Ensure you are in the `blog-backend` directory and run:

   ```bash
   node server.js
   ```

2. **Start the Frontend Application**

   Ensure you are in the `blog-frontend` directory and run:

   ```bash
   npm start
   ```

This structure provides a basic blog application stack using React for the client-side, Node.js with Express for the server-side logic, and Supabase as the backend database service. You can extend and customize this application as needed, such as adding user authentication, improving the UI, or implementing more advanced features.