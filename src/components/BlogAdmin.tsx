import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useAuth } from '../hooks/useAuth';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().optional(),
  image_url: z.string().optional(),
});

export function BlogAdmin() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      content: '',
      author: '',
      image_url: '',
    },
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
    } else {
      setPosts(data);
    }
  }

  async function onSubmit(values: z.infer<typeof blogPostSchema>) {
    let imageUrl = editingPost?.image_url || '';

    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    const postData = {
      ...values,
      author: values.author || user?.email,
      image_url: imageUrl,
    };

    let error;
    if (editingPost) {
      ({ error } = await supabase.from('blog_posts').update(postData).eq('id', editingPost.id));
    } else {
      ({ error } = await supabase.from('blog_posts').insert([postData]));
    }

    if (error) {
      console.error('Error saving blog post:', error);
    } else {
      await fetchPosts();
      setEditingPost(null);
      setImageFile(null);
      form.reset();
    }
  }

  function handleEdit(post: any) {
    setEditingPost(post);
    form.setValue('title', post.title);
    form.setValue('content', post.content);
    form.setValue('author', post.author);
    form.setValue('image_url', post.image_url);
  }

  async function handleDelete(postId: string) {
    const { error } = await supabase.from('blog_posts').delete().eq('id', postId);
    if (error) {
      console.error('Error deleting blog post:', error);
    } else {
      await fetchPosts();
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Blog Admin</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingPost ? 'Edit Post' : 'Create Post'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Blog post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write your blog post here..." {...field} rows={10} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Author name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Blog Image</FormLabel>
                <FormControl>
                  <Input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                </FormControl>
                <FormMessage />
              </FormItem>
              <div className="flex gap-4">
                <Button type="submit">{editingPost ? 'Update Post' : 'Create Post'}</Button>
                {editingPost && (
                  <Button variant="outline" onClick={() => { setEditingPost(null); form.reset(); }}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Existing Posts</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{post.title}</h3>
                <p className="text-sm text-gray-500">
                  By {post.author || 'Anonymous'} on {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => handleEdit(post)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(post.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
