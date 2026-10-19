'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { ExternalLink, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { TechPost } from '@/config/techPosts';

interface PostCardProps {
  post: TechPost;
  content?: string;
  // Optional English version. The 中文 / English toggle is rendered only
  // when both the primary content and this English content exist.
  contentEn?: string;
}

export function PostCard({ post, content, contentEn }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lang, setLang] = useState<'primary' | 'en'>('primary');
  const hasContent = content && content.length > 0;
  const hasEn = !!contentEn && contentEn.length > 0;
  const activeContent = lang === 'en' && hasEn ? contentEn : content;
  const contentRegionId = `${post.id}-full-content`;

  // Strip the first H1 line (already shown as card title)
  const markdownContent = hasContent
    ? (activeContent ?? '').replace(/^# .+\n?/, '')
    : '';

  // Preview header (badge + title + description). When the post has full
  // content, the whole preview is rendered inside one big button so readers
  // can open the article by clicking anywhere on the preview — not only via
  // the small "Read More" text control below it.
  const previewHeader = (
    <>
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
    </>
  );

  return (
    <div id={post.id} className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${hasContent ? 'col-span-1 md:col-span-2 lg:col-span-3' : ''}`}>
      {hasContent ? (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls={contentRegionId}
          className="block w-full cursor-pointer text-left rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
        >
          {previewHeader}
        </button>
      ) : (
        previewHeader
      )}

      {/* Large Content Section */}
      {hasContent && (
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-controls={contentRegionId}
              className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
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
            {hasEn && (
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                双语全文 · 中文 / English
              </span>
            )}
          </div>

          {isExpanded && (
            <div id={contentRegionId} role="region" aria-label={post.title} className="bg-white/5 rounded-lg p-6 border border-white/10 prose prose-invert prose-sm max-w-none animate-in fade-in slide-in-from-top-2 duration-300">
              {hasEn && (
                <div className="not-prose flex justify-end gap-2 mb-4">
                  <button
                    onClick={() => setLang('primary')}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 ${
                      lang === 'primary'
                        ? 'bg-white text-slate-900'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
                    }`}
                  >
                    中文
                  </button>
                  <button
                    onClick={() => setLang('en')}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 ${
                      lang === 'en'
                        ? 'bg-white text-slate-900'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
                    }`}
                  >
                    English
                  </button>
                </div>
              )}
              <ReactMarkdown>{markdownContent}</ReactMarkdown>
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
