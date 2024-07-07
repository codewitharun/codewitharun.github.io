import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'tailwindcss/tailwind.css';

const initialPosts = [
    {
        title: "First Blog Post",
        date: "June 23, 2023",
        content: "This is the content of the first blog post."
    },
    {
        title: "Second Blog Post",
        date: "July 10, 2023",
        content: "This is the content of the second blog post."
    },
    {
        title: "Third Blog Post",
        date: "August 15, 2023",
        content: "This is the content of the third blog post."
    }
];

const Blog = () => {
    const [posts, setPosts] = useState(initialPosts);
    const [newPost, setNewPost] = useState({ title: '', date: '', content: '' });
    const [isAdmin, setIsAdmin] = useState(true); // Set to true for admin mode

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost({ ...newPost, [name]: value });
    };

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setNewPost({ ...newPost, content: data });
    };

    const handleAddPost = () => {
        setPosts([...posts, newPost]);
        setNewPost({ title: '', date: '', content: '' });
    };

    return (
        <>
            <Header />
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold mb-6">Blog</h1>
                {isAdmin && (
                    <div className="mb-6 p-4 border border-gray-300 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">Add New Post</h2>
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={newPost.title}
                            onChange={handleInputChange}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="date"
                            placeholder="Date"
                            value={newPost.date}
                            onChange={handleInputChange}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <div className="mb-4">
                            <CKEditor

                                editor={ClassicEditor}
                                data="<p>Start writing your post...</p>"
                                onChange={handleEditorChange}
                            />
                        </div>
                        <button
                            onClick={handleAddPost}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                        >
                            Add Post
                        </button>
                    </div>
                )}
                <div>
                    {posts.map((post, index) => (
                        <div key={index} className="mb-6 p-4 border border-gray-300 rounded-lg">
                            <h2 className="text-2xl font-semibold">{post.title}</h2>
                            <p className="text-gray-600 mb-2"><em>{post.date}</em></p>
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Blog;
