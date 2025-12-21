import Link from 'next/link';
import { ArrowLeft, ExternalLink, ChevronRight } from 'lucide-react';
import { techPosts, techCategories } from '@/config/techPosts';
import { getAllPostContents } from '@/lib/posts';
import { PostCard } from './PostCard';

export const metadata = {
  title: 'AI Techs - Great Seattle Life Hacks',
};

export default async function TechPage() {
  // Load all MD file contents at build/request time
  const contentPaths = techPosts
    .filter(post => post.contentPath)
    .map(post => post.contentPath!);

  const postContents = await getAllPostContents(contentPaths);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-twinkle"
              style={{
                left: `${(i * 7) % 100}%`,
                top: `${(i * 11) % 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container max-w-6xl mx-auto px-6 pt-8 pb-16">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
              AI Techs
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Explore cutting-edge technology articles, tutorials, and insights for everyday learning and professional growth.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {techCategories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300
                  ${category === 'All'
                    ? 'bg-white text-slate-900'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                content={post.contentPath ? postContents[post.contentPath] : undefined}
              />
            ))}
          </div>

          {/* Empty State for future */}
          {techPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/40 text-lg">No posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container max-w-6xl mx-auto px-6 text-center">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Great Seattle Life Hacks
          </p>
        </div>
      </footer>
    </div>
  );
}
