import fs from 'fs';
import path from 'path';

const POSTS_DIRECTORY = path.join(process.cwd(), 'data/posts');

export async function getPostContent(filename: string): Promise<string | null> {
  try {
    const filePath = path.join(POSTS_DIRECTORY, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error(`Error reading post file: ${filename}`, error);
    return null;
  }
}

export async function getAllPostContents(filenames: string[]): Promise<Record<string, string>> {
  const contents: Record<string, string> = {};

  for (const filename of filenames) {
    const content = await getPostContent(filename);
    if (content) {
      contents[filename] = content;
    }
  }

  return contents;
}
