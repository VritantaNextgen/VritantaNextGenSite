import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

export function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching blog post:', error);
      } else {
        setPost(data);
      }
      setLoading(false);
    }

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-800 text-lg">Loading Post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">Post not found</h1>
          <p className="text-gray-600 mt-4">The blog post you are looking for does not exist.</p>
          <Button onClick={() => navigate('/blog')} className="mt-8">Back to Blog</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight">Vritanta Next Gen</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:bg-gray-100"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button 
                className="bg-purple-600 text-white hover:bg-purple-700"
                onClick={() => navigate('/register')}
              >
                Access Tools
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-40 pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <article>
            <header className="mb-12 text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-gray-900">
                {post.title}
              </h1>
              <p className="text-lg text-gray-500">
                By {post.author || 'Anonymous'} on {new Date(post.created_at).toLocaleDateString()}
              </p>
            </header>

            {post.image_url && (
              <div className="mb-12">
                <img src={post.image_url} alt={post.title} className="w-full h-auto object-cover rounded-lg shadow-lg" />
              </div>
            )}

            <div className="prose prose-lg max-w-none mx-auto text-gray-800" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
          </article>

          <div className="mt-16 text-center">
            <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-20 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>&copy; 2025 Vritanta Next Gen. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
