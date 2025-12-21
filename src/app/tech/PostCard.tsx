'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { TechPost } from '@/config/techPosts';

interface PostCardProps {
  post: TechPost;
  content?: string;
}

export function PostCard({ post, content }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasContent = content && content.length > 0;

  return (
    <div className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${hasContent ? 'col-span-1 md:col-span-2 lg:col-span-3' : ''}`}>
      {/* Category Badge */}
      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full mb-4">
        {post.category}
      </span>

      {/* Title */}
      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
        {post.title}
      </h3>

      {/* Description */}
      <p className="text-white/60 text-sm leading-relaxed mb-4">
        {post.description}
      </p>

      {/* Large Content Section */}
      {hasContent && (
        <div className="mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors mb-3"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Read More
              </>
            )}
          </button>

          {isExpanded && (
            <div className="bg-white/5 rounded-lg p-6 border border-white/10 prose prose-invert prose-sm max-w-none animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="markdown-content">
                {content.split('\n').map((line, index) => {
                  // Skip the first H1 title (it's already shown above)
                  if (line.startsWith('# ') && index === 0) return null;

                  // H2 headers
                  if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-lg font-semibold text-white mt-6 mb-3">{line.replace('## ', '')}</h2>;
                  }

                  // H3 headers
                  if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-base font-semibold text-white/90 mt-4 mb-2">{line.replace('### ', '')}</h3>;
                  }

                  // Bold text and bullet points
                  if (line.startsWith('- ')) {
                    const formattedLine = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>');
                    return (
                      <li key={index} className="flex items-start ml-4 text-white/60 mb-1">
                        <span className="mr-2 text-blue-400">•</span>
                        <span dangerouslySetInnerHTML={{ __html: formattedLine.replace('- ', '') }} />
                      </li>
                    );
                  }

                  // Empty lines
                  if (line.trim() === '') {
                    return <br key={index} />;
                  }

                  // Regular paragraphs with bold support
                  const formattedLine = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>');
                  return <p key={index} className="text-white/60 mb-2" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Highlights */}
      {post.highlights && post.highlights.length > 0 && (
        <ul className="space-y-2 mb-4">
          {post.highlights.map((highlight, index) => (
            <li key={index} className="flex items-center text-sm text-white/50">
              <ChevronRight className="w-4 h-4 mr-2 text-blue-400" />
              {highlight}
            </li>
          ))}
        </ul>
      )}

      {/* Links */}
      {post.links && post.links.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/10">
          {post.links.map((link, index) => (
            link.url.startsWith('/') ? (
              <Link
                key={index}
                href={link.url}
                className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                {link.label}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            ) : (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                {link.label}
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )
          ))}
        </div>
      )}

      {/* Date */}
      <div className="absolute top-6 right-6 text-xs text-white/30">
        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
      </div>
    </div>
  );
}
