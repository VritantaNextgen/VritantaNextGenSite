import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

export function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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
      setLoading(false);
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-800 text-lg">Loading Blog...</p>
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

      <main className="pt-40 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-12 text-center">
            Vritanta Blog
          </h1>
          <div className="space-y-8">
            {posts.map((post) => (
              <Card key={post.id} className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow flex flex-col md:flex-row">
                {post.image_url && (
                  <div className="md:w-1/3">
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover rounded-l-lg" />
                  </div>
                )}
                <div className="p-6 flex flex-col justify-between md:w-2/3">
                  <div>
                    <CardTitle className="text-3xl font-bold">
                      <Link to={`/blog/${post.id}`} target="_blank" rel="noopener noreferrer">{post.title}</Link>
                    </CardTitle>
                    <p className="text-gray-600 line-clamp-3 mt-2">{post.content}</p>
                  </div>
                  <div className="mt-4">
                    <Link to={`/blog/${post.id}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 font-semibold hover:underline">
                      Read More
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
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
