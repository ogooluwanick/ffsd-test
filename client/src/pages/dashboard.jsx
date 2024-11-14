import { GlobalContext } from '@/context/GlobalContext';
import { BASE_URL } from '@/utils';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import React, { useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function Dashboard() {
        const { status, data: session } = useSession();
        
        console.log("session",session)
        
        const router = useRouter();
        const { register, handleSubmit, reset, formState: { errors } } = useForm();
        // const [posts, setPosts] = useState([]);
        const { posts, setPosts } = useContext(GlobalContext);


        useEffect(() => {
                const token = session?.accessToken;

                if (!token) {
                        router.push('/signin');
                        return;
                }

        }, [session]);


        const onSubmit = async (data) => {
                try {
                        const toastId = toast.loading('Saving post...');

                        const url = data.id ? `${BASE_URL}/posts/${data.id}` : `${BASE_URL}/posts/`;
                        const method = data.id ? 'PUT' : 'POST';

                        const response = await fetch(url, {
                                method,
                                headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${session?.accessToken}`
                                },
                                body: JSON.stringify(data)
                        });

                        if (!response.ok) {
                                throw new Error('Failed to save post');
                        }

                        const savedPost = await response.json();

                        if (data.id) {
                                setPosts(posts.map(post => post._id === data.id ? savedPost : post));
                        } else {
                                setPosts([savedPost, ...posts]);
                        }

                        reset();
                        toast.dismiss(toastId);
                        toast.success(data.id ? 'Post updated successfully' : 'Post created successfully');
                } catch (error) {
                        toast.dismiss();
                        toast.error('Failed to save post');
                }
        };

        const handleDelete = async (postId) => {
                try {
                        const toastId = toast.loading('Deleting post...');
                        await fetch(`${BASE_URL}/posts/${postId}`, {
                                method: 'DELETE',
                                headers: {
                                        'Authorization': `Bearer ${session?.accessToken}`
                                }
                        });

                        setPosts(posts.filter(post => post._id !== postId));
                        toast.dismiss(toastId);
                        toast.success('Post deleted successfully');
                } catch (error) {
                        toast.dismiss();
                        toast.error('Failed to delete post');
                }
        };

        return (
                <div className="max-w-4xl mx-auto p-4">
                        <h1 className="text-3xl font-bold mb-6">Blog Dashboard</h1>

                        <div className="bg-white rounded-lg shadow-md mb-8 p-6">
                                <h2 className="text-xl font-semibold mb-4">Create/Edit Post</h2>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div>
                                                <input
                                                        type="text"
                                                        placeholder="Post Title"
                                                        {...register('title', { required: true })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.title && (
                                                        <div className="text-red-500">Title is required</div>
                                                )}
                                        </div>
                                        <div>
                                                <textarea
                                                        placeholder="Post Content"
                                                        {...register('content', { required: true })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
                                                />
                                                {errors.content && (
                                                        <div className="text-red-500">Content is required</div>
                                                )}
                                        </div>
                                        <input type="hidden" {...register('id')} />
                                        <button
                                                type="submit"
                                                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors text-center block"
                                        >
                                                Save Post
                                        </button>
                                </form>
                        </div>

                        <div className="space-y-4">
                                {posts.map((post) => (
                                        <div key={post._id} className="bg-white rounded-lg shadow-md p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                                <h3 className="text-xl font-semibold">{post.title}</h3>
                                                                <p className="text-sm text-gray-500">
                                                                        By {post?.creator?.name} • {new Date(post?.createdAt).toLocaleDateString()}
                                                                </p>
                                                        </div>
                                                        {session?.user?.id === post?.creator?._id && (
                                                                <div className="flex space-x-2">
                                                                        <button
                                                                                onClick={() => {
                                                                                        reset({ title: post.title, content: post.content, id: post._id });
                                                                                }}
                                                                                className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                                                                        >
                                                                                ✏️
                                                                        </button>
                                                                        <button
                                                                                onClick={() => handleDelete(post._id)}
                                                                                className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                                                        >
                                                                                🗑️
                                                                        </button>
                                                                </div>
                                                        )}
                                                </div>
                                                <p className="whitespace-pre-wrap text-gray-700">{post.content}</p>
                                        </div>
                                ))}
                        </div>
                </div>
        );
}